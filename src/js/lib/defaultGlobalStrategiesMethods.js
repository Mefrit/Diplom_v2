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
            var best_enemie = cache_enemies[0], distance_best, tmp, res_x, res_y, find_archer = false;
            distance_best = this.getDistanceBetweenUnits(best_enemie, unit);
            cache_enemies.forEach(function (elem) {
                tmp = _this.getDistanceBetweenUnits(elem, unit);
                if (tmp < distance_best && !find_archer) {
                    if (best_enemie.x != elem.x || best_enemie.y != elem.y && _this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length < 3) {
                        if (elem.person.health < best_enemie.person.health) {
                            best_enemie = elem;
                            distance_best = tmp;
                        }
                    }
                }
                if (Math.abs(tmp - distance_best) == 1 || tmp == distance_best) {
                    if (_this.getEnemyInField({ x: elem.x, y: elem.y }, 2).length <= 1) {
                        if (_this.isArchers(elem)) {
                            best_enemie = elem;
                            find_archer = true;
                            return;
                        }
                        else {
                            if (best_enemie.person.health < elem.person.health && !find_archer) {
                                best_enemie = elem;
                            }
                        }
                    }
                }
            });
            return best_enemie;
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
