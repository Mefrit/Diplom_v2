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
        SmartAgro.prototype.start = function (cache) {
            var _this = this;
            console.log("SmartAgro start", cache);
            this.ai_units = this.sortArchersFirst(this.ai_units);
            var cache_enemies = [], best_enemie = {}, distance_best = 0;
            this.ai_units.map(function (unit) {
                console.log(unit);
                cache_enemies = _this.getEnemyInField({
                    x: unit.person.x,
                    y: unit.person.y
                }, 4);
                best_enemie = cache_enemies[0];
                cache_enemies.forEach(function (elem) {
                    distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
                    if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                        best_enemie = elem;
                    }
                });
                var FightIfYouCan = _this.getStrategyByName(cacheFighterStrategy_1.cacheFighterAI, FightIfYouCan);
                var ai = new FightIfYouCan({
                    scene: _this.scene,
                    view: _this.view,
                    unit_collection: _this.unit_collection
                });
                ai.atackeChosenUnit(cache, best_enemie);
                console.log("\cacheFighterAI", FightIfYouCan);
            });
        };
        return SmartAgro;
    }(defaultGlobalStrategiesMethods_1.DefaultGlobalMethodsStrategey));
    exports.SmartAgro = SmartAgro;
});
