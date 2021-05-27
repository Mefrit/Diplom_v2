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
            var result = 1100, enemies_near_archers, archers;
            archers = this.unit_collection.getAiArchers();
            archers.forEach(function (elem) {
                enemies_near_archers = _this.getEnemyInField({
                    x: elem.person.x,
                    y: elem.person.y
                }, 3);
                result += enemies_near_archers.length * 1000;
                result += elem.person.health * 5;
            });
            console.log("ProtectArchers ==> ", Math.round(result));
            return { total: Math.round(result), cache: cache };
        };
        ProtectArchers.prototype.getBestEnemie = function (cache_enemies, unit) {
            var best_enemie = cache_enemies[0], distance_best = 0;
            cache_enemies.forEach(function (elem) {
                distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
                if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                    best_enemie = elem;
                }
            });
            return best_enemie;
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
            var cache_enemies = [], best_enemie = {}, enemies_2field = [], strategy_cache = {}, archers;
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
            var ChoosenStrategy;
            if (cache_unit[index].person.class == "fighter") {
                archers = this.unit_collection.getAiArchers();
                archers.forEach(function (elem) {
                    enemies_2field = _this.getEnemyInField({
                        x: elem.person.x,
                        y: elem.person.y
                    }, 2);
                    if (enemies_2field.length > 0) {
                        strategy_cache.most_damaged_person_3 = _this.getEnemyFromCache(elem, enemies_2field);
                        ChoosenStrategy = _this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "FightIfYouCan");
                    }
                    else {
                        ChoosenStrategy = _this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "SecurityArcher");
                    }
                });
            }
            else {
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheArcherAI, "AtackTheArcher");
            }
            var ai = new ChoosenStrategy({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection,
                unit: unit
            });
            if (cache_unit[index].person.class == "fighter") {
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
        ProtectArchers.prototype.start = function (cache) {
            this.startMove(this.ai_units, 0);
        };
        return ProtectArchers;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategy));
    exports.ProtectArchers = ProtectArchers;
});
