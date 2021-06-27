import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class DistanceAgro extends DefaultGlobalMethodsStrategy {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {

        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
        this.global_cache = {};
    }
    assessment(cache) {
        // тут нужно выбрать кто куда будет ходить

        // let result = 1000, enemies, enemies_near_6, enemies_near_3, best_enemie, cache_enemies, enemies_near_4;
        // this.ai_units.forEach(curent_unit => {
        //     if (curent_unit.person.health > 30) {
        //         result += 300;
        //     }
        //     if (curent_unit.person.health > 20 && curent_unit.person.health < 30) {
        //         result += 100;
        //     }
        //     enemies_near_6 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);

        //     enemies_near_6.forEach(enemie => {
        //         // учет возможных атак
        //         if (enemie.person.class == "archer") {
        //             result -= 300;
        //         } else {
        //             result -= 500;
        //         }
        //         if (curent_unit.person.class == "archer") {
        //             result += 14 * enemie.person.health;
        //         } else {
        //             result += 10 * enemie.person.health;
        //         }
        //     });
        //     enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);
        //     if (this.isArchers(curent_unit)) {

        //         // console.log()
        //         result -= enemies_near_3.length * 800;
        //     }


        //     if (curent_unit.isArchers()) {

        //         cache_enemies = enemies_near_6;

        //         if (cache_enemies.length > 0) {

        //             cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);


        //             if (cache_enemies.length > 0) {

        //                 best_enemie = this.getBestEnemie(cache_enemies, curent_unit);

        //             } else {

        //                 best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
        //             }

        //         } else {
        //             best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
        //         }

        //         cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
        //     } else {

        //         if (enemies_near_3.length > 0) {
        //             cache.units_purpose.push({ enemie: this.getBestEnemie(enemies_near_3, curent_unit), id: curent_unit.person.id });
        //         }
        //     }


        // });
        // // this.global_cache = cache;
        // // enemies = this.unit_collection.getUserCollection();
        // // enemies.forEach(elem => {
        // //     if (elem.person.health < 30) {
        // //         result += 300;
        // //     }
        // // });
        // // enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);

        // // if (enemies_near_3.length > 0) {
        // //     cache.units_purpose.push({ enemie: this.getBestEnemie(enemies_near_3, curent_unit), id: curent_unit.person.id });
        // // }
        // console.log("distanceAgro ", Math.round(result));
        // return { total: Math.round(result), cache: cache };
        let result = 1000, cache_died = [], enemies_near_4, fighter_first = false, enemies_near_3, best_enemie, cache_enemies, first_archer, enemie_first_archer = undefined;
        // ввести кеш, тех мест где приблизительно будут находиться друзья,
        // ..когда пойжут мочить врагов
        // надо что бы они вместе длержались, те выбор врагов и напрввление удара по количеству союзников рядом

        this.ai_units.forEach(curent_unit => {
            if (curent_unit.person.health < 30) {
                result -= 400;
            }
            if (curent_unit.person.health < 20) {
                result -= 700;
            }
            result -= (5 - this.unit_collection.getCountEnemy()) * 300;
            enemies_near_4 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
            enemies_near_4.forEach(enemie => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result += 500;
                } else {
                    result += 300;
                }
                if (curent_unit.person.class == "archer") {
                    result += 10 * Math.abs(70 - enemie.person.health);
                } else {
                    result += 8 * Math.abs(100 - enemie.person.health);
                }
            });
            enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);

            if (curent_unit.isArchers()) {
                cache_enemies = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 8);

                if (cache_enemies.length > 0) {
                    // console.log("units_purpose=======>>> ", cache_died, cache.units_purpose);
                    // вопрос, когда лучше удалять этих чуваков?
                    if (enemie_first_archer) {
                        if (this.getEnemyInField(enemie_first_archer, 2).length > 1 &&
                            (Math.abs(first_archer.x - curent_unit.x) < 2 ||
                                Math.abs(first_archer.y - curent_unit.y) < 2)) {
                            // console.log("deleteEqualEnemyFromCache", curent_unit, this.getEnemyInField(enemie_first_archer, 2));
                            cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);
                        }
                    }
                    // cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);

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
                result -= 200 * this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie);

                if (curent_unit.person.damage >= (best_enemie.person.health - 5) && this.getDistanceBetweenUnits(curent_unit, best_enemie) < 7) {
                    cache_died.push(best_enemie);
                }
                first_archer = curent_unit;
                enemie_first_archer = best_enemie;
                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
            } else {
                // if (enemies_near_3.length > 0) {
                result -= 200 * enemies_near_3.length
                //     best_enemie = this.getBestEnemie(enemies_near_3, curent_unit);
                //     // console.log("cache_died fighter", curent_unit.person.damage, best_enemie.person.health, this.getDistanceBetweenUnits(curent_unit, best_enemie));
                //     if (curent_unit.person.damage >= (best_enemie.person.health - 10) && this.getDistanceBetweenUnits(curent_unit, best_enemie) < 4) {

                //         cache_died.push(best_enemie);

                //     }
                //     cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });

                //     if (this.getDistanceBetweenUnits(best_enemie, curent_unit) < 3) {
                //         result += 500;
                //     } else {
                //         /// просчитать риски, возникающие на пути к врагу
                //         // console.log("countEnemyWnenMoveToEnemy => ", this.getAllDangersEnemyBetweenUnits(curent_unit, best_enemie));
                //         result -= 200 * this.getAllDangersEnemyBetweenUnits(curent_unit, best_enemie);
                //     }
                //     if (best_enemie.person.health > curent_unit.person.health) {
                //         result -= 300;
                //     } else {
                //         result += 300;
                //     }


                // }
                result += 10 * (100 - parseInt(curent_unit.person.health));
            }

        });
        result += 10 * (5 - this.ai_units.length);
        result -= 15 * (5 - this.unit_collection.getUserCollection().length);
        console.log("Distance Agro", Math.round(result), cache);
        return { total: Math.round(result), cache: cache };
    }
    createMytantStrategy() {

    }
    choseTurnUnits(ai_units) {
        let friends, reverse = false, enemies;
        ai_units.forEach((element) => {
            if (this.isArchers(element)) {
                friends = this.getFriendsInField(element, 3);
                if (friends.length == 0) {
                    reverse = true;
                } else {
                    friends.forEach(near_friend => {
                        if (!this.isArchers(near_friend) && (near_friend.y == element.y)) {
                            reverse = true;
                        } else {
                            // friends = this.getFriendsInField(element, 3);
                            // if (friends.length == 0) {
                            //     reverse = true;
                            // }
                        }
                    });
                }


            }
        });
        // if (!reverse) {
        //     ai_units.forEach((element) => {
        //         if (this.isArchers(element)) {
        //             enemies = this.getEnemyInField(element, 4);
        //             if (enemies.length > 2) {
        //                 reverse = true;
        //             }
        //             // enemies.forEach(near_friend => {
        //             //     if (!this.isArchers(near_friend) && (near_friend.y == element.y)) {
        //             //         reverse = true;
        //             //     }
        //             // });

        //         }
        //     });
        // }
        console.log("reverse", reverse);
        return reverse ? [...ai_units].reverse() : ai_units;
    }
    startMove(cache_unit, index) {
        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie: any;
        best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
        if (!best_enemie) {
            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 4);


            if (unit.person.class != "fighter") {
                cache_enemies = this.deleteBusyEnemies(cache_enemies, this.global_cache.units_purpose);
            }

            if (cache_enemies.length > 0) {

                best_enemie = this.getBestEnemie(cache_enemies, unit);
            } else {
                best_enemie = this.findNearestEnemies(unit, this.global_cache.units_purpose);
                best_enemie = best_enemie.enemie;

            }
        } else {
            best_enemie = best_enemie.enemie;
        }

        var ChoosenStrategy;

        // сделать так , что бы двигались в сторону ближайших игроков
        if (unit.person.class == "fighter") {
            ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "SecurityArcher");
        } else {
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");
        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit,
            parent_strategy: "distanceAgro"
        });
        if (unit.person.class == "fighter") {
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
        this.global_cache = cache;
        this.ai_units = this.sortArchersFirst(this.ai_units);
        this.ai_units = this.choseTurnUnits(this.ai_units);
        this.startMove(this.ai_units, 0);
    }
}