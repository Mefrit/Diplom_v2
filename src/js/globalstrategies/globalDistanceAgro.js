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
    exports.DistanceAgro = void 0;
    var DistanceAgro = (function (_super) {
        __extends(DistanceAgro, _super);
        function DistanceAgro(props) {
            var _this = _super.call(this, props) || this;
            _this.ai_units = [];
            _this.unit_collection = props.unit_collection;
            _this.ai_units = props.ai_units;
            _this.scene = props.scene;
            _this.view = props.view;
            _this.global_cache = {};
            return _this;
        }
        DistanceAgro.prototype.assessment = function (cache) {
            var _this = this;
            var result = 1000, cache_died = [], enemies_near_4, fighter_first = false, enemies_near_3, best_enemie, cache_enemies, enemie_first_archer = undefined;
            this.ai_units.forEach(function (curent_unit) {
                if (curent_unit.person.health < 30) {
                    result -= 400;
                }
                if (curent_unit.person.health < 20) {
                    result -= 700;
                }
                result += (5 - _this.unit_collection.getCountEnemy()) * 300;
                enemies_near_4 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
                enemies_near_4.forEach(function (enemie) {
                    if (enemie.person.class == "archer") {
                        result += 500;
                    }
                    else {
                        result += 300;
                    }
                    if (curent_unit.person.class == "archer") {
                        result += 10 * Math.abs(80 - enemie.person.health);
                    }
                    else {
                        result += 8 * Math.abs(80 - enemie.person.health);
                    }
                });
                enemies_near_3 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
                if (curent_unit.isArchers()) {
                    cache_enemies = _this.getEnemyInField({
                        x: curent_unit.person.x,
                        y: curent_unit.person.y
                    }, 8);
                    if (cache_enemies.length > 0) {
                        console.log("units_purpose=======>>> ", cache_died, cache.units_purpose);
                        if (enemie_first_archer) {
                            if (_this.getEnemyInField(enemie_first_archer, 3) != 0) {
                                cache_enemies = _this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);
                            }
                        }
                        cache_enemies = _this.deleteEqualEnemyFromCache(cache_enemies, cache_died);
                        if (cache_enemies.length > 0) {
                            best_enemie = _this.getBestEnemie(cache_enemies, curent_unit);
                        }
                        else {
                            best_enemie = _this.findNearestEnemies(curent_unit);
                        }
                    }
                    else {
                        best_enemie = _this.findNearestEnemies(curent_unit);
                    }
                    result += 200 * _this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie);
                    if (curent_unit.person.damage >= (best_enemie.person.health - 5) && _this.getDistanceBetweenUnits(curent_unit, best_enemie) < 7) {
                        cache_died.push(best_enemie);
                    }
                    enemie_first_archer = best_enemie;
                    cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
                }
                else {
                    if (enemies_near_3.length > 0) {
                        enemies_near_3 = _this.deleteEqualEnemyFromCache(enemies_near_3, cache_died);
                        best_enemie = _this.getBestEnemie(enemies_near_3, curent_unit);
                        if (curent_unit.person.damage >= (best_enemie.person.health - 10) && _this.getDistanceBetweenUnits(curent_unit, best_enemie) < 4) {
                            cache_died.push(best_enemie);
                        }
                        cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
                        if (_this.getDistanceBetweenUnits(best_enemie, curent_unit) < 3) {
                            result += 500;
                        }
                        else {
                            result -= 200 * _this.getAllDangersEnemyBetweenUnits(curent_unit, best_enemie);
                        }
                        if (best_enemie.person.health > curent_unit.person.health) {
                            result -= 300;
                        }
                        else {
                            result += 300;
                        }
                    }
                }
            });
            console.log("Smart Agro", Math.round(result), cache);
            return { total: Math.round(result), cache: cache };
        };
        DistanceAgro.prototype.createMytantStrategy = function () {
        };
        DistanceAgro.prototype.startMove = function (cache_unit, index) {
            var _this = this;
            var unit = cache_unit[index];
            var cache_enemies = [], best_enemie;
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
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "SecurityArcher");
            }
            else {
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheArcherAI, "AtackTheArcher");
            }
            var ai = new ChoosenStrategy({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection,
                unit: unit,
                parent_strategy: "distanceAgro"
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
        DistanceAgro.prototype.start = function (cache) {
            this.global_cache = cache;
            this.startMove(this.ai_units, 0);
        };
        return DistanceAgro;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategy));
    exports.DistanceAgro = DistanceAgro;
});
