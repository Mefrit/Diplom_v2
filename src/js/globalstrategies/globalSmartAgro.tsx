import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"

//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class SmartAgro extends DefaultGlobalMethodsStrategy {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    global_cache: any;
    constructor(props: any) {
        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.global_cache = {};
        this.view = props.view;
    }
    assessment(cache: any = {}) {
        let result = 1000, min_health = 200, enemies_near_4, enemies_near_3, best_enemie, cache_enemies;

        this.ai_units.forEach(curent_unit => {
            if (curent_unit.person.health < 30) {
                result -= 400;
            }
            if (curent_unit.person.health < 20) {
                result -= 700;
            }

            enemies_near_4 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);
            enemies_near_4.forEach(enemie => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result -= 300;
                } else {
                    result -= 500;
                }
                if (curent_unit.person.class == "archer") {
                    result += 12 * enemie.person.health;
                } else {
                    result += 10 * enemie.person.health;
                }
            });
            enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);

            if (enemies_near_3.length > 0) {
                cache.units_purpose.push({ enemie: this.getBestEnemie(enemies_near_3, curent_unit), id: curent_unit.person.id });
            }
            if (curent_unit.isArchers()) {

                cache_enemies = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 5);

                if (cache_enemies.length > 0) {
                    best_enemie = this.getBestEnemie(cache_enemies, curent_unit);
                } else {
                    best_enemie = this.findNearestEnemies(curent_unit);
                }
                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
            }

        });
        // enemies = this.unit_collection.getUserCollection();
        // enemies.forEach(elem => {
        //     if (elem.person.health > 30) {
        //         result -= 200;
        //     }
        //     if (elem.person.health < 30) {
        //         result += 400;
        //     }
        //     if (elem.person.health < 20) {
        //         result += 700;
        //     }
        // });

        // if (!cache.enemies_near_3) {
        //     enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
        //     cache.enemies_near_3 = enemies
        // } else {
        //     enemies = cache.enemies_near_3;
        // }
        // if (enemies.length == 0) {
        //     result -= 500;
        //     damaged_person = {};
        // } else {
        //     damaged_person = enemies[0];
        //     min_health = damaged_person.person.health
        //     result += 1000 / enemies.length;
        // }
        // // min_health = 150;
        // // как вариант выбирать еще и самого дальнего
        // enemies.forEach(elem => {
        //     // console.log(elem);
        //     if (elem.person.health < min_health) {
        //         damaged_person = elem;
        //     }
        //     result -= elem.person.health * 5;
        // });
        // cache.most_damaged_person_3 = damaged_person;
        // console.log("!!!!!!!!!!\n\n\n enemies in fields FightIfYouCan", enemies, "damaged", damaged_person);
        return { total: Math.round(result), cache: cache };
    }

    startMove(cache_unit, index) {

        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie: any = {}, ChoosenStrategy;
        console.log("this.global_cache", this.global_cache);
        best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);

        if (!best_enemie) {

            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 5);

            if (cache_enemies.length > 0) {
                best_enemie = this.getBestEnemie(cache_enemies, unit);
            } else {
                best_enemie = this.findNearestEnemies(unit);
            }
        } else {
            best_enemie = best_enemie.enemie;
        }
        // сделать так , что бы двигались в сторону ближайших игроков

        if (cache_unit[index].person.class == "fighter") {
            ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "FightIfYouCan");
        } else {
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");
        }

        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit,
            global_cache: this.global_cache
        });

        ai.atackeChosenUnit(cache_unit, best_enemie).then(() => {
            if (index < cache_unit.length - 1) {
                this.startMove(cache_unit, index + 1);
            }
        });
    }

    start(cache) {
        this.global_cache = cache;
        // ToDO? сделать так что бы программа проверяла в какой
        //  последовательности ходить юнитами, типа если бойцы атаку прикрывают - их 1ми
        this.ai_units = this.sortArchersFirst(this.ai_units);
        this.startMove(this.ai_units, 0);

    }
}