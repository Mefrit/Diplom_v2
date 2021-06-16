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
            var best_enemie = cache_enemies[0], distance_best, tmp, res_x, res_y, find_archer = false, resCheck, have_best_choise = false;
            distance_best = this.getDistanceBetweenUnits(best_enemie, unit);
            cache_enemies.forEach(function (elem) {
                if (!have_best_choise) {
                    tmp = _this.getDistanceBetweenUnits(elem, unit).toFixed(0);
                    if (tmp < distance_best) {
                        if (best_enemie.x != elem.x ||
                            (best_enemie.y != elem.y && _this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length < 3)) {
                            best_enemie = elem;
                            distance_best = tmp;
                        }
                    }
                    if (Math.abs(tmp - distance_best) == 1 || tmp == distance_best) {
                        if (_this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length <= 2) {
                            if (_this.isArchers(elem)) {
                                best_enemie = elem;
                                find_archer = true;
                            }
                            else {
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
            var arr_step_points = [], step_x, step_y, i = 0, enemy = 0;
            if (unit2.x < unit1.x && unit2.y < unit1.y) {
                start = { x: unit2.x, y: unit2.y }, end = { x: unit1.x, y: unit1.y };
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
                    return cache_purpose;
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
            return cacheAi.sort(function (prev, next) {
                if (prev.person.class == "archer") {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        };
        return DefaultGlobalMethodsStrategy;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.DefaultGlobalMethodsStrategy = DefaultGlobalMethodsStrategy;
});
