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
   
        var best_enemie = cache_enemies[0], distance_best, tmp, res_x = false, res_y = false, find_archer = false;
        distance_best = this.getDistanceBetweenUnits(best_enemie, unit);
        // console.log("getBestEnemie cache_enemies", cache_enemies);
        cache_enemies.forEach(elem => {
            // if (find_archer) {
            //     if () {
            //         find_archer = false;
            //     }

            tmp = this.getDistanceBetweenUnits(elem, unit);
            // console.log("tmp", tmp, elem);

            if (tmp < distance_best && !find_archer) {
                if (best_enemie.x != elem.x || best_enemie.y != elem.y) {
                    if (elem.person.health < best_enemie.person.health) {
                        best_enemie = elem;
                        distance_best = tmp;
                    }
                }
            }



            if (Math.abs(tmp - distance_best) == 1 || tmp == distance_best) {
                // console.log("this.getEnemyInField({ x: elem.x, y: elem.y }, 1).length", { x: elem.x, y: elem.y }, this.getFriendsInField({ x: elem.x, y: elem.y }, 1).length);
                if (this.getFriendsInField({ x: elem.x, y: elem.y }, 1).length < 1) {
                    if (this.isArchers(elem)) {
                        if (res_x.free || res_y.free) {
                            best_enemie = elem;
                            find_archer = true;
                            return;
                        }
                    }
                    if (!this.isArchers(elem) && best_enemie.person.health < elem.person.health && !find_archer) {
                        best_enemie = elem;
                    }

                }

            }
        });
        return best_enemie;
    }
    deleteBusyEnemies(cache_enemies, units_purpose) {
        let find = false;
        return cache_enemies.filter(enemies => {

            units_purpose.forEach(archers_enemie => {
                if (archers_enemie.enemie.person.id == enemies.person.id) {
                    find = true;
                }
            });
            if (find) {
                find = false;
                return false;
            }
            return true;
        });
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