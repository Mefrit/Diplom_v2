import { DefaultMethodsStrategy } from "./defaultMethods";
export class DefaultGlobalMethodsStrategy extends DefaultMethodsStrategy {
    constructor(props) {
        super(props);
    }
    checkConnection() {
        alert("connction");
    }

    getBestEnemie(cache_enemies, unit) {
        var best_enemie = cache_enemies[0],
            distance_best,
            tmp,
            res_x,
            res_y,
            find_archer = false,
            resCheck,
            have_best_choise = false;

        distance_best = this.getDistanceBetweenUnits(best_enemie, unit);

        cache_enemies.forEach((elem) => {
            if (!have_best_choise) {
                tmp = this.getDistanceBetweenUnits(elem, unit).toFixed(0);

                // && !find_archer
                if (tmp < distance_best) {
                    if (
                        best_enemie.x != elem.x ||
                        (best_enemie.y != elem.y && this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length < 3)
                    ) {
                        // if (elem.person.health < best_enemie.person.health) {
                        best_enemie = elem;
                        distance_best = tmp;
                        // }
                    }
                }
                // console.log("tmp",tmp,distance_best,elem.domPerson);
                if (Math.abs(tmp - distance_best) == 1 || tmp == distance_best) {
                    // чтобы не врывался в толпу врагов ии
                    if (this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length <= 2) {
                        if (this.isArchers(elem)) {
                            best_enemie = elem;
                            find_archer = true;
                        } else {
                            // if (best_enemie.person.health > elem.person.health) {
                            if (unit.person.damage > elem.person.health) {
                                best_enemie = elem;
                                have_best_choise = true;
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
        if (units_purpose.length == 0) {
            return cache_enemies;
        }
        return cache_enemies.filter((elem) => {
            add = true;
            units_purpose.forEach((purpose) => {
                if (typeof purpose.enemie != "undefined") {
                    if (purpose.enemie.person.id == elem.person.id) {
                        add = false;
                    }
                }
            });
            if (add) {
                return elem;
            }
        });
    }
    // примерное количесвто опасных врагов
    getAllDangersEnemyBetweenUnits(unit1, unit2) {
        let start = { x: unit1.x, y: unit1.y }, end = { x: unit2.x, y: unit2.y };
        // getDistanceBetweenUnits
        // getPointsField
        let arr_step_points = [], step_x, step_y, i = 0, enemy = 0;
        if (unit2.x < unit1.x && unit2.y < unit1.y) {
            start = { x: unit2.x, y: unit2.y }, end = { x: unit1.x, y: unit1.y };
        }
        step_x = parseInt(start.x);
        step_y = parseInt(start.y);
        // console.log(start, step_y, step_x);
        while (true) {
            if (this.getDistanceBetweenUnits({ x: step_x, y: step_y }, end) < 3 || i == 50) {
                break;
            }
            if (step_x < end.x) {
                step_x++;
            }
            if (step_y < end.y) {
                step_y++;
            }
            i++;
            enemy += this.getEnemyInField({ x: step_x, y: step_y }, 3).length;

        }
        enemy += this.getEnemyInField(end, 3).length;

        return enemy;

    }
    countEnemyWnenMoveToEnemy(unit, enemy) {
        let start = { x: unit.x, y: unit.y }, step_x, step_y;
        if (this.getDistanceBetweenUnits(start, enemy) < 3) {
            return this.getEnemyInField(start, 3).length;
        }
        if (enemy.x < unit.x) {
            step_x += unit.x - 2;
        } else {
            step_x += unit.x - 2;
        }
        if (enemy.y < unit.y) {
            step_y += unit.y - 2;
        } else {
            step_y += unit.y + 2;
        }
        return this.getEnemyInField({ x: step_x, y: step_y }, 3).length;
    }
    getEnemieFromCachePurpose(cache_purpose, id) {
        let result = cache_purpose.filter((elem) => {
            if (elem.id == id) {
                return cache_purpose;
            }
        });
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
