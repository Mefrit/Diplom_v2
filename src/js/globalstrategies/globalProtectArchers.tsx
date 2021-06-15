import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class ProtectArchers extends DefaultGlobalMethodsStrategy {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    local_cache: any;
    constructor(props: any) {
        // console.log("DistanceAgro", props);
        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
        this.local_cache = {
            cache_enemies: []
        }
    }
    assessment(cache) {

        var result = 1100, enemies_near_archers, archers;
        archers = this.unit_collection.getAiArchers();
        // console.log(near_archer);
        // FIX ME  можно в кеш положить
        // учитывать здоровье лучников?
        archers.forEach(elem => {
            enemies_near_archers = this.getEnemyInField({
                x: elem.person.x,
                y: elem.person.y
            }, 5);
            result += enemies_near_archers.length * 600;
            result += elem.person.health * 6;
            enemies_near_archers = this.getEnemyInField({
                x: elem.person.x,
                y: elem.person.y
            }, 3);
            result += enemies_near_archers.length * 2200;
            result += (100 - elem.person.health) * 100;
            enemies_near_archers = this.getEnemyInField({
                x: elem.person.x,
                y: elem.person.y
            }, 2);
            result += enemies_near_archers.length * 6200;

            // }
        });
        // this.ai_units.forEach(elem => {
        //     if (elem.person.health > 30) {
        //         result += 300;
        //     }
        //     if (elem.person.health > 20 && elem.person.health < 30) {
        //         result += 100;
        //     }
        // });

        // // if (!cache.enemies_near_3) {
        // //     enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
        // //     cache.enemies_near_3 = enemies;
        // // } else {
        // //     enemies = cache.enemies_near_3;
        // // }
        // enemies = this.unit_collection.getUserCollection();
        // enemies.forEach(elem => {
        //     if (elem.person.health < 30) {
        //         result += 300;
        //     }
        //     // if (elem.person.health > 20 && elem.person.health < 30) {
        //     //     result += 100;
        //     // }
        // });
        // if (enemies.length == 0) {
        //     result += 300;
        // } else {
        //     result -= 1000 / enemies.length;
        // }
        // console.log("!!!!!!!!!!\n\n\n enemies in fields AtackTheArcher", enemies);
        // enemies.forEach(elem => {
        //     result -= elem.health * 5
        // });
        // console.log("!!!!!!!!!!\n\n\n enemies in fields", enemies);
        // чем больше. тем лучше будет считаьься стратегия
        console.log("ProtectArchers ==> ", Math.round(result));
        return { total: Math.round(result), cache: cache };
        // return Math.floor(Math.random() * Math.floor(100));
    }
    getBestEnemie(cache_enemies, unit) {
        var best_enemie = cache_enemies[0], distance_best = 0;
        cache_enemies.forEach(elem => {
            distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
            if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                best_enemie = elem;
            }
        });
        return best_enemie;
    }
    getEnemyFromCache(archer, enemies) {
        let chosen_enemime = enemies[0], min_obj = { distance: 100000, enemie: enemies[0] }, min_distance = 10000;
        enemies.forEach(enemie => {
            min_distance = this.getDistanceBetweenUnits(archer, enemie);
            if (min_distance < min_obj.distance) {
                min_obj.enemie = enemie;
                min_obj.distance = min_distance;
            }
            // getDistanceBetweenUnits
        });
        return min_obj.enemie;
    }

    startMove(cache_unit, index) {
        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie = {}, enemies_3field = [], strategy_cache: any = {}, archers;
        cache_enemies = this.getEnemyInField({
            x: unit.person.x,
            y: unit.person.y
        }, 4);
        if (cache_enemies.length > 0) {
            best_enemie = this.getBestEnemie(cache_enemies, unit);
        } else {
            best_enemie = this.findNearestEnemies(unit);
        }
        var ChoosenStrategy;
        // сделать так , что бы двигались в сторону ближайших игроков
        if (cache_unit[index].person.class == "fighter") {
            archers = this.unit_collection.getAiArchers();
            // console.log(near_archer);
            archers.forEach(elem => {
                enemies_3field = this.getEnemyInField({
                    x: elem.person.x,
                    y: elem.person.y
                }, 3);
                if (enemies_3field.length > 0) {
                    // переписать как ближайышимй
                    strategy_cache.most_damaged_person_3 = this.getEnemyFromCache(elem, enemies_3field);
                    ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "FightIfYouCan");
                } else {
                    ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "SecurityArcher");
                }
            });

        } else {
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");
        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit
        });
        if (cache_unit[index].person.class == "fighter") {
            ai.start(cache_unit).then(() => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });
        } else {
            ai.atackeChosenUnit(cache_unit, best_enemie).then((data) => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });

        }
    }
    start(cache) {
        this.startMove(this.ai_units, 0);
        // console.log("start Distance", cache);
    }
}