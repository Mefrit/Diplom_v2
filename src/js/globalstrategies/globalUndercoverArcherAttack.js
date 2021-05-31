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
define(["require", "exports", "../lib/defaultGlobalStrategiesMethods", "../strategies/cacheUnitSingleStrategy"], function (require, exports, defaultGlobalStrategiesMethods_1, cacheUnitSingleStrategy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UndercoverArcherAttack = void 0;
    var UndercoverArcherAttack = (function (_super) {
        __extends(UndercoverArcherAttack, _super);
        function UndercoverArcherAttack(props) {
            var _this = _super.call(this, props) || this;
            _this.ai_units = [];
            _this.unit_collection = props.unit_collection;
            _this.ai_units = _this.choseTurnUnits(props.ai_units);
            _this.scene = props.scene;
            _this.view = props.view;
            _this.global_cache = {};
            return _this;
        }
        UndercoverArcherAttack.prototype.choseTurnUnits = function (ai_units) {
            var _this = this;
            var res_1 = { cache: [], have_archer: false }, res_2 = { cache: [], have_archer: false };
            ai_units.forEach(function (element) {
                if (_this.isArchers(element)) {
                    if (!res_1.have_archer) {
                        res_1.have_archer = true;
                        res_1.cache.push(element);
                    }
                    else {
                        res_2.have_archer = true;
                        res_2.cache.push(element);
                    }
                }
                else {
                    if (res_1.cache.length < 2) {
                        res_1.cache.push(element);
                    }
                    else {
                        res_2.cache.push(element);
                    }
                }
            });
            return res_1.cache.concat(res_2.cache);
        };
        UndercoverArcherAttack.prototype.assessment = function (cache) {
            var _this = this;
            var result = 1000, enemies, enemies_near_6, enemies_near_3, best_enemie, cache_enemies;
            this.ai_units.forEach(function (curent_unit) {
                if (curent_unit.person.health > 30) {
                    result += 300;
                }
                if (curent_unit.person.health > 20 && curent_unit.person.health < 30) {
                    result += 100;
                }
                enemies_near_6 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 5);
                enemies = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);
                if (enemies_near_6.length > 0 && enemies.length == 0) {
                    result += 500 * enemies_near_6.length;
                }
                enemies_near_6.forEach(function (enemie) {
                    if (enemie.person.class == "archer") {
                        result -= 300;
                    }
                    else {
                        result -= 500;
                    }
                    if (curent_unit.person.class == "archer") {
                        result += 5 * Math.abs(80 - enemie.person.health);
                    }
                    else {
                        result += 3 * Math.abs(80 - enemie.person.health);
                    }
                });
                if (curent_unit.isArchers()) {
                    cache_enemies = enemies_near_6;
                    if (cache_enemies.length > 0) {
                        cache_enemies = _this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);
                        if (cache_enemies.length > 0) {
                            best_enemie = _this.getBestEnemie(cache_enemies, curent_unit);
                        }
                        else {
                            best_enemie = _this.findNearestEnemies(curent_unit, cache.units_purpose);
                            if (best_enemie.hasOwnProperty("enemie")) {
                                best_enemie = best_enemie.enemie;
                            }
                        }
                    }
                    else {
                        best_enemie = _this.findNearestEnemies(curent_unit, cache.units_purpose);
                        if (best_enemie.hasOwnProperty("enemie")) {
                            best_enemie = best_enemie.enemie;
                        }
                    }
                    cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
                }
                else {
                    enemies_near_3 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);
                    if (enemies_near_3.length > 0) {
                        cache.units_purpose.push({
                            enemie: _this.getBestEnemie(enemies_near_3, curent_unit),
                            id: curent_unit.person.id,
                        });
                    }
                }
            });
            console.log("UndercoverArcherAttack", Math.round(result));
            return { total: Math.round(result), cache: cache };
        };
        UndercoverArcherAttack.prototype.createMytantStrategy = function () { };
        UndercoverArcherAttack.prototype.startMove = function (cache_unit, index) {
            var _this = this;
            var unit = cache_unit[index];
            var cache_enemies = [], best_enemie;
            best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
            if (!best_enemie) {
                cache_enemies = this.getEnemyInField({
                    x: unit.person.x,
                    y: unit.person.y,
                }, 4);
                if (unit.person.class != "fighter") {
                    cache_enemies = this.deleteBusyEnemies(cache_enemies, this.global_cache.units_purpose);
                }
                if (cache_enemies.length > 0) {
                    best_enemie = this.getBestEnemie(cache_enemies, unit);
                }
                else {
                    best_enemie = this.findNearestEnemies(unit, this.global_cache.units_purpose);
                    best_enemie = best_enemie.enemie;
                }
            }
            else {
                best_enemie = best_enemie.enemie;
            }
            var ChoosenStrategy;
            if (unit.person.class == "fighter") {
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "StayForwardArcher");
            }
            else {
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheArcherAI, "AtackTheArcher");
            }
            var ai = new ChoosenStrategy({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection,
                unit: unit,
                parent_strategy: "UndercoverArcherAttack",
            });
            if (unit.person.class == "fighter") {
                ai.start(cache_unit).then(function () {
                    if (index < cache_unit.length - 1) {
                        _this.startMove(cache_unit, index + 1);
                    }
                });
            }
            else {
                ai.atackeChosenUnit(cache_unit, best_enemie).then(function (data) {
                    if (index < cache_unit.length - 1) {
                        _this.startMove(cache_unit, index + 1);
                    }
                });
            }
        };
        UndercoverArcherAttack.prototype.start = function (cache) {
            this.global_cache = cache;
            this.startMove(this.ai_units, 0);
        };
        return UndercoverArcherAttack;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategy));
    exports.UndercoverArcherAttack = UndercoverArcherAttack;
});
