var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./defaultMethods"], function (require, exports, defaultMethods_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultGlobalMethodsStrategy = void 0;
    var DefaultGlobalMethodsStrategy = (function (_super) {
        __extends(DefaultGlobalMethodsStrategy, _super);
        function DefaultGlobalMethodsStrategy(props) {
            return _super.call(this, props) || this;
        }
        DefaultGlobalMethodsStrategy.prototype.checkConnection = function () {
            alert("connction");
        };
        DefaultGlobalMethodsStrategy.prototype.getBestEnemie = function (cache_enemies, unit) {
            var _this = this;
            var best_enemie = cache_enemies[0], distance_best, tmp, have_best_choise = false;
            if (cache_enemies.length > 0) {
                distance_best = Math.round(this.getDistanceBetweenUnits(best_enemie, unit));
            }
            else {
                distance_best = 1000;
                best_enemie = this.findNearestEnemies(unit);
            }
            cache_enemies.forEach(function (elem) {
                tmp = Math.round(_this.getDistanceBetweenUnits(elem, unit));
                if (!have_best_choise) {
                    if (tmp <= distance_best) {
                        if (best_enemie.x != elem.x ||
                            (best_enemie.y != elem.y && _this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length < 3)) {
                            if (Math.abs(tmp - distance_best) < 2) {
                                if (best_enemie.person.health > elem.person.health) {
                                    best_enemie = elem;
                                    if ((elem.x == unit.x || elem.y == unit.y) && unit.person.class == "archer") {
                                        have_best_choise = true;
                                    }
                                }
                            }
                            else {
                            }
                        }
                    }
                    if (tmp == distance_best && !have_best_choise) {
                        if (_this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length <= 2) {
                            if (_this.isArchers(elem)) {
                                best_enemie = elem;
                            }
                            else {
                                if (unit.person.damage > elem.person.health + 10) {
                                    best_enemie = elem;
                                    have_best_choise = true;
                                }
                            }
                        }
                        if (Math.abs(tmp - distance_best) < 2) {
                            if (best_enemie.person.health > elem.person.health && !_this.isArchers(unit)) {
                                best_enemie = elem;
                            }
                            if (_this.isArchers(elem)) {
                                best_enemie = elem;
                                have_best_choise = true;
                            }
                        }
                        if ((elem.x == unit.x || elem.y == unit.y) && unit.person.class == "archer") {
                            best_enemie = elem;
                            have_best_choise = true;
                        }
                        else {
                            if ((Math.abs(elem.y - unit.y) <= 1 || Math.abs(elem.x - unit.x) <= 1) &&
                                unit.person.class == "archer") {
                                best_enemie = elem;
                                have_best_choise = true;
                            }
                        }
                    }
                    else {
                        if (Math.abs(tmp - distance_best) < 2) {
                            if ((best_enemie.x == unit.x ||
                                best_enemie.y == unit.y ||
                                Math.abs(elem.y - unit.y) == 1 ||
                                Math.abs(elem.x - unit.x) == 1) &&
                                elem.person.health - unit.person.damage < 10 &&
                                _this.getEnemyInField(elem, 2) < 2) {
                                best_enemie = elem;
                                have_best_choise = true;
                            }
                            if (best_enemie.person.health > elem.person.health &&
                                !have_best_choise &&
                                best_enemie.person.health < 50) {
                                if (!(best_enemie.x == unit.x || best_enemie.y == unit.y) &&
                                    best_enemie.person.class != "archer") {
                                    best_enemie = elem;
                                }
                            }
                        }
                    }
                }
                else {
                    if (tmp < distance_best) {
                        if ((elem.x == unit.x ||
                            elem.y == unit.y ||
                            Math.abs(elem.y - unit.y) == 1 ||
                            Math.abs(elem.x - unit.x) == 1) &&
                            unit.person.class == "archer") {
                            best_enemie = elem;
                        }
                        else {
                            if ((elem.x == unit.x || elem.y == unit.y) && unit.person.class == "archer") {
                                best_enemie = elem;
                            }
                        }
                    }
                }
            });
            return best_enemie;
        };
        DefaultGlobalMethodsStrategy.prototype.deleteEqualEnemyFromCache = function (cache_enemies, units_purpose) {
            var add;
            if (units_purpose.length == 0) {
                return cache_enemies;
            }
            return cache_enemies.filter(function (elem) {
                add = true;
                units_purpose.forEach(function (purpose) {
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
        };
        DefaultGlobalMethodsStrategy.prototype.getAllDangersEnemyBetweenUnits = function (unit1, unit2) {
            var start = { x: unit1.x, y: unit1.y }, end = { x: unit2.x, y: unit2.y };
            var step_x, step_y, i = 0, enemy = 0;
            if (unit2.x < unit1.x && unit2.y < unit1.y) {
                (start = { x: unit2.x, y: unit2.y }), (end = { x: unit1.x, y: unit1.y });
            }
            step_x = parseInt(start.x);
            step_y = parseInt(start.y);
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
        };
        DefaultGlobalMethodsStrategy.prototype.countEnemyWnenMoveToEnemy = function (unit, enemy) {
            var start = { x: unit.x, y: unit.y }, step_x, step_y;
            if (this.getDistanceBetweenUnits(start, enemy) < 3) {
                return this.getEnemyInField(start, 3).length;
            }
            if (enemy.x < unit.x) {
                step_x += unit.x - 2;
            }
            else {
                step_x += unit.x - 2;
            }
            if (enemy.y < unit.y) {
                step_y += unit.y - 2;
            }
            else {
                step_y += unit.y + 2;
            }
            return this.getEnemyInField({ x: step_x, y: step_y }, 3).length;
        };
        DefaultGlobalMethodsStrategy.prototype.getEnemieFromCachePurpose = function (cache_purpose, id) {
            var result = cache_purpose.filter(function (elem) {
                if (elem.id == id) {
                    return elem.enemie;
                }
            });
            if (result.length == 0) {
                return false;
            }
            return result[0];
        };
        DefaultGlobalMethodsStrategy.prototype.getStrategyByName = function (cache_ai, name) {
            var result = {};
            for (var key in cache_ai) {
                if (key == name) {
                    result = cache_ai[key];
                }
            }
            return result;
        };
        DefaultGlobalMethodsStrategy.prototype.sortArchersFirst = function (cacheAi) {
            var res = cacheAi.sort(function (prev, next) {
                if (prev.person.class == "archer") {
                    return -1;
                }
                else {
                    return 1;
                }
            }), tmp;
            if (cacheAi.length < 2) {
                return res;
            }
            if (this.getEnemyInField(res[1], 5) >= this.getEnemyInField(res[0], 5)) {
                tmp = res[1];
                res[1] = res[0];
                res[0] = tmp;
            }
            return res;
        };
        return DefaultGlobalMethodsStrategy;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.DefaultGlobalMethodsStrategy = DefaultGlobalMethodsStrategy;
});
