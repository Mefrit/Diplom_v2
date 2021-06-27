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
    exports.ProtectArchers = void 0;
    var ProtectArchers = (function (_super) {
        __extends(ProtectArchers, _super);
        function ProtectArchers(props) {
            var _this = _super.call(this, props) || this;
            _this.ai_units = [];
            _this.global_cache = {};
            _this.unit_collection = props.unit_collection;
            _this.ai_units = props.ai_units;
            _this.scene = props.scene;
            _this.view = props.view;
            _this.local_cache = {
                cache_enemies: []
            };
            return _this;
        }
        ProtectArchers.prototype.assessment = function (cache) {
            var _this = this;
            var result = 800, cache_died = [], enemies_near_4, fighter_first = false, enemies_near_3, best_enemie, cache_enemies, first_archer, enemie_first_archer = undefined;
            this.ai_units.forEach(function (curent_unit) {
                enemies_near_4 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
                enemies_near_4.forEach(function (enemie) {
                    if (enemie.person.class == "archer") {
                        result += 400;
                    }
                    else {
                        result += 200;
                    }
                    if (curent_unit.person.class == "archer") {
                        result += 6 * Math.abs(70 - enemie.person.health);
                    }
                    else {
                        result += 4 * Math.abs(100 - enemie.person.health);
                    }
                });
                enemies_near_3 = _this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
                if (curent_unit.isArchers()) {
                    if (curent_unit.person.health < 30) {
                        result += 300;
                    }
                    if (curent_unit.person.health < 20) {
                        result += 500;
                    }
                    cache_enemies = _this.getEnemyInField({
                        x: curent_unit.person.x,
                        y: curent_unit.person.y
                    }, 8);
                    var enemy_near_archer_3 = _this.getEnemyInField({
                        x: curent_unit.person.x,
                        y: curent_unit.person.y
                    }, 3);
                    var enemy_near_archer_2 = _this.getEnemyInField({
                        x: curent_unit.person.x,
                        y: curent_unit.person.y
                    }, 2);
                    result += enemy_near_archer_2.length * 1200;
                    result += enemy_near_archer_3.length * 200;
                    if (cache_enemies.length > 0) {
                        if (enemie_first_archer) {
                            if (_this.getEnemyInField(enemie_first_archer, 2).length > 1 &&
                                (Math.abs(first_archer.x - curent_unit.x) < 2 ||
                                    Math.abs(first_archer.y - curent_unit.y) < 2)) {
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
                    if (curent_unit.person.damage >= (best_enemie.person.health - 5) && _this.getDistanceBetweenUnits(curent_unit, best_enemie) < 7) {
                        cache_died.push(best_enemie);
                    }
                    first_archer = curent_unit;
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
                    }
                    else {
                        cache.units_purpose.push({ enemie: _this.findNearestEnemies(curent_unit), id: curent_unit.person.id });
                    }
                }
            });
            console.log("Protect Arcgers", Math.round(result), cache);
            return { total: Math.round(result), cache: cache };
        };
        ProtectArchers.prototype.getEnemyFromCache = function (archer, enemies) {
            var _this = this;
            var chosen_enemime = enemies[0], min_obj = { distance: 100000, enemie: enemies[0] }, min_distance = 10000;
            enemies.forEach(function (enemie) {
                min_distance = _this.getDistanceBetweenUnits(archer, enemie);
                if (min_distance < min_obj.distance) {
                    min_obj.enemie = enemie;
                    min_obj.distance = min_distance;
                }
            });
            return min_obj.enemie;
        };
        ProtectArchers.prototype.startMove = function (cache_unit, index) {
            var _this = this;
            var unit = cache_unit[index];
            var cache_enemies = [], best_enemie = {}, enemies_3field = [], strategy_cache = {}, archers;
            best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
            if (unit.person.class == "archer") {
                cache_enemies = this.getEnemyInField({
                    x: unit.person.x,
                    y: unit.person.y
                }, 5);
                if (cache_enemies.length > 0) {
                    best_enemie = this.getBestEnemie(cache_enemies, unit);
                }
                else {
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
                }
                else {
                    best_enemie = this.findNearestEnemies(unit);
                }
            }
            var ChoosenStrategy;
            if (cache_unit[index].person.class == "fighter") {
                archers = this.unit_collection.getAiArchers();
                archers.forEach(function (elem) {
                    enemies_3field = _this.getEnemyInField({
                        x: elem.person.x,
                        y: elem.person.y
                    }, 3);
                    if (enemies_3field.length > 0) {
                        strategy_cache.most_damaged_person_3 = _this.getEnemyFromCache(elem, enemies_3field);
                        ChoosenStrategy = _this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "FightIfYouCan");
                    }
                    else {
                        ChoosenStrategy = _this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "SecurityArcher");
                    }
                });
            }
            else {
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheArcherAI, "GoAwayIfManyEnemies");
            }
            var ai = new ChoosenStrategy({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection,
                unit: unit
            });
            if (cache_unit[index].person.class == "fighter") {
                ai.start(cache_unit, best_enemie).then(function () {
                    if (index < cache_unit.length - 1) {
                        _this.startMove(cache_unit, index + 1);
                    }
                });
            }
            else {
                ai.atackeChosenUnit(cache_unit, best_enemie, true).then(function (data) {
                    if (index < cache_unit.length - 1) {
                        _this.startMove(cache_unit, index + 1);
                    }
                });
            }
        };
        ProtectArchers.prototype.start = function (cache) {
            this.global_cache = cache;
            this.startMove(this.ai_units, 0);
        };
        return ProtectArchers;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategy));
    exports.ProtectArchers = ProtectArchers;
});
