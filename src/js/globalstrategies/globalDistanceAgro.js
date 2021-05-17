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
            return _this;
        }
        DistanceAgro.prototype.assessment = function (cache) {
            var result = 1100, enemies;
            this.ai_units.forEach(function (elem) {
                if (elem.person.health > 30) {
                    result += 300;
                }
                if (elem.person.health > 20 && elem.person.health < 30) {
                    result += 100;
                }
            });
            enemies = this.unit_collection.getUserCollection();
            enemies.forEach(function (elem) {
                if (elem.person.health < 30) {
                    result += 300;
                }
            });
            return { total: Math.round(result), cache: cache };
        };
        DistanceAgro.prototype.getBestEnemie = function (cache_enemies, unit) {
            var best_enemie = cache_enemies[0], distance_best = 0;
            cache_enemies.forEach(function (elem) {
                distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
                if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                    best_enemie = elem;
                }
            });
            return best_enemie;
        };
        DistanceAgro.prototype.startMove = function (cache_unit, index) {
            var _this = this;
            var unit = cache_unit[index];
            var cache_enemies = [], best_enemie = {};
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
                ChoosenStrategy = this.getStrategyByName(cacheUnitSingleStrategy_1.cacheFighterAI, "SecurityArcher");
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
        DistanceAgro.prototype.start = function (cache) {
            this.startMove(this.ai_units, 0);
        };
        return DistanceAgro;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategey));
    exports.DistanceAgro = DistanceAgro;
});
