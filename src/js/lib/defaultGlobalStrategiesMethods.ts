import { DefaultMethodsStrategy } from "./defaultMethods";
export class DefaultGlobalMethodsStrategy extends DefaultMethodsStrategy {
    constructor(props) {
        super(props);
    }
    checkConnection() {
        alert("connction");
    }
    // chooseBestEnemie(unit, cache_enemie) {
    //     let best_enemie
    //     cache_enemie.forEach(elem => {

    //     })
    // }
    getBestEnemie(cache_enemies, unit) {

        var best_enemie = cache_enemies[this.randomInteger(0, cache_enemies.length - 1)], distance_best, tmp, res_x, res_y, find_archer = false, resCheck;

        distance_best = this.getDistanceBetweenUnits(best_enemie, unit);

        cache_enemies.forEach(elem => {


            tmp = this.getDistanceBetweenUnits(elem, unit);


            if (tmp < distance_best && !find_archer) {
                if (best_enemie.x != elem.x || best_enemie.y != elem.y && this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length < 3) {
                    if (elem.person.health < best_enemie.person.health) {
                        best_enemie = elem;
                        distance_best = tmp;
                    }
                }
            }
            if (Math.abs(tmp - distance_best) == 1 || tmp == distance_best) {
                // чтобы е врывался в толпу врагов ии
                if (this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length <= 2) {


                    if (this.isArchers(unit)) {
                        res_x = Math.abs(elem.person.x - unit.person.x);
                        res_y = Math.abs(elem.person.y - unit.person.y);
                        if (res_x > res_y) {
                            resCheck = this.checkFreeWay2Atack(elem, unit, "y");
                        } else {
                            resCheck = this.checkFreeWay2Atack(elem, unit, "x");
                        }

                        if (resCheck.free) {
                            if (this.isArchers(elem)) {

                                best_enemie = elem;
                                find_archer = true;
                                return;
                                // }
                            } else {
                                if (best_enemie.person.health < elem.person.health && !find_archer) {
                                    best_enemie = elem;
                                }
                            }
                        }
                    } else {
                        if (this.isArchers(elem)) {

                            best_enemie = elem;
                            find_archer = true;
                            return;
                            // }
                        } else {
                            if (best_enemie.person.health < elem.person.health && !find_archer) {
                                best_enemie = elem;
                            }
                        }
                    }



                }

            }
        });
        return best_enemie;
    }
    // удаляет врагов которые уже заняты в кеше и предоставляет незанятых врагов
    deleteEqualEnemyFromCache(cache_enemies, units_purpose) {
        let add;
        return cache_enemies.filter(elem => {
            add = true;
            units_purpose.forEach(purpose => {
                if (purpose.enemie.person.id == elem.person.id) {
                    add = false;
                }
            });
            if (add) {
                return elem;
            }

        })
    }
    getEnemieFromCachePurpose(cache_purpose, id) {
        let result = cache_purpose.filter(elem => {

            if (elem.id == id) {
                return cache_purpose;
            }
        })
        if (result.length == 0) {
            return false;
        }
        return result[0];
    }
    getStrategyByName(cache_ai, name) {

        let result = {};
        for (let key in cache_ai) {
            if (key == name) {
                result = cache_ai[key];
            }
        }
        return result;

    }

    sortArchersFirst(cacheAi) {
        return cacheAi.sort((prev, next) => {
            if (prev.person.class == "archer") {
                return -1;
            } else {
                return 1;
            }
        });
    }
}