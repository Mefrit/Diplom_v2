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
define(["require", "exports", "../lib/defaultGlobalStrategiesMethods", "../strategies/cacheFighterStrategy"], function (require, exports, defaultGlobalStrategiesMethods_1, cacheFighterStrategy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmartAgro = void 0;
    var SmartAgro = (function (_super) {
        __extends(SmartAgro, _super);
        function SmartAgro(props) {
            var _this = this;
            console.log("SmartAgro", props);
            _this = _super.call(this, props) || this;
            _this.ai_units = [];
            _this.ai_units = props.ai_units;
            _this.scene = props.scene;
            _this.view = props.view;
            return _this;
        }
        SmartAgro.prototype.assessment = function (cache) {
            return { total: Math.round(1000), cache: cache };
        };
        SmartAgro.prototype.getBestEnemie = function (cache_enemies, unit) {
            var best_enemie = cache_enemies[0], distance_best = 0;
            cache_enemies.forEach(function (elem) {
                distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
                if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                    best_enemie = elem;
                }
            });
            return best_enemie;
        };
        SmartAgro.prototype.startMove = function (cache_unit, index) {
            var _this = this;
            var unit = cache_unit[index];
            var cache_enemies = [], best_enemie = {};
            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 4);
            console.log("cache_enemies", cache_enemies);
            if (cache_enemies.length > 0) {
                best_enemie = this.getBestEnemie(cache_enemies, unit);
            }
            else {
                best_enemie = this.findNearestEnemies(unit);
            }
            var FightIfYouCan = this.getStrategyByName(cacheFighterStrategy_1.cacheFighterAI, "FightIfYouCan");
            var ai = new FightIfYouCan({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection,
                unit: unit
            });
            ai.atackeChosenUnit(cache_unit, best_enemie).then(function () {
                if (index < cache_unit.length - 1) {
                    _this.startMove(cache_unit, index + 1);
                }
            });
        };
        SmartAgro.prototype.start = function (cache) {
            this.ai_units = this.sortArchersFirst(this.ai_units);
            this.startMove(this.ai_units, 0);
        };
        return SmartAgro;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategey));
    exports.SmartAgro = SmartAgro;
});
