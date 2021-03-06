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
        this.global_cache = {};
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
        this.local_cache = {
            cache_enemies: []
        }
    }
    assessment(cache) {
        let result = 800, cache_died = [], enemies_near_4, fighter_first = false, enemies_near_3, best_enemie, cache_enemies, first_archer, enemie_first_archer = undefined;
        // ввести кеш, тех мест где приблизительно будут находиться друзья,
        // ..когда пойжут мочить врагов
        // надо что бы они вместе длержались, те выбор врагов и напрввление удара по количеству союзников рядом

        this.ai_units.forEach(curent_unit => {

            // result += (5 - this.unit_collection.getCountEnemy()) * 300;
            enemies_near_4 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
            enemies_near_4.forEach(enemie => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result += 400;
                } else {
                    result += 200;
                }
                if (curent_unit.person.class == "archer") {
                    result += 6 * Math.abs(70 - enemie.person.health);
                } else {
                    result += 4 * Math.abs(100 - enemie.person.health);
                }
            });
            // result += (5 - this.unit_collection.getCountEnemy()) * 300;
            enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);

            if (curent_unit.isArchers()) {
                if (curent_unit.person.health < 30) {
                    result += 300;
                }
                if (curent_unit.person.health < 20) {
                    result += 500;
                }
                cache_enemies = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 8);
                let enemy_near_archer_3 = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 3);
                let enemy_near_archer_2 = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 2);

                result += enemy_near_archer_2.length * 3500;
                result += enemy_near_archer_3.length * 200;
                // }
                if (cache_enemies.length > 0) {

                    if (enemie_first_archer) {
                        if (this.getEnemyInField(enemie_first_archer, 2).length > 1 &&
                            (Math.abs(first_archer.x - curent_unit.x) < 2 ||
                                Math.abs(first_archer.y - curent_unit.y) < 2)) {

                            cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);
                        }
                    }


                    cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache_died);
                    if (cache_enemies.length > 0) {
                        best_enemie = this.getBestEnemie(cache_enemies, curent_unit);
                    } else {
                        best_enemie = this.findNearestEnemies(curent_unit);
                    }
                } else {
                    best_enemie = this.findNearestEnemies(curent_unit);
                }
                // console.log("countEnemyWnenMoveToEnemy => ", this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie));
                // result -= 200 * this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie);

                if (curent_unit.person.damage >= (best_enemie.person.health - 5) && this.getDistanceBetweenUnits(curent_unit, best_enemie) < 7) {
                    cache_died.push(best_enemie);
                }
                first_archer = curent_unit;
                enemie_first_archer = best_enemie;
                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
            } else {
                if (enemies_near_3.length > 0) {
                    enemies_near_3 = this.deleteEqualEnemyFromCache(enemies_near_3, cache_died);

                    best_enemie = this.getBestEnemie(enemies_near_3, curent_unit);

                    // console.log("cache_died fighter", curent_unit.person.damage, best_enemie.person.health, this.getDistanceBetweenUnits(curent_unit, best_enemie));
                    if (curent_unit.person.damage >= (best_enemie.person.health - 10) && this.getDistanceBetweenUnits(curent_unit, best_enemie) < 4) {

                        cache_died.push(best_enemie);

                    }
                    cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });



                } else {
                    cache.units_purpose.push({ enemie: this.findNearestEnemies(curent_unit), id: curent_unit.person.id });
                }
            }

        });
        result -= (2 - this.unit_collection.getAiArchers().length) * 1000;
        // });
        console.log("Protect Arcgers", Math.round(result), cache);
        return { total: Math.round(result), cache: cache };
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
        let cache_enemies = [], best_enemie: any = {}, enemies_3field = [], strategy_cache: any = {}, archers;

        best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
        // if (!best_enemie) {
        if (unit.person.class == "archer") {
            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 5);

            if (cache_enemies.length > 0) {
                best_enemie = this.getBestEnemie(cache_enemies, unit);
            } else {
                best_enemie = this.findNearestEnemies(unit);
            }
        }
        if (!best_enemie) {

            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 4);
            if (cache_enemies.length > 0) {
                best_enemie = this.getBestEnemie(cache_enemies, unit);
            } else {
                best_enemie = this.findNearestEnemies(unit);
            }
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
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "GoAwayIfManyEnemies");
        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit
        });
        if (cache_unit[index].person.class == "fighter") {

            ai.start(cache_unit, best_enemie).then(() => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });
        } else {
            // console.log('best_enemie!!!!!! 2', best_enemie);
            ai.atackeChosenUnit(cache_unit, best_enemie, true).then((data) => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });

        }
    }
    start(cache) {
        this.global_cache = cache;
        this.startMove(this.ai_units, 0);
        // console.log("start Distance", cache);
    }
}