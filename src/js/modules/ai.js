define(["require", "exports", "../strategies/cacheGlobalStrategy"], function (require, exports, cacheGlobalStrategy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ai = void 0;
    var Ai = (function () {
        function Ai(arrAllPersons) {
            var _this = this;
            this.initPersons = function (unit_collection, syncUnit) {
                _this.unit_collection = unit_collection;
                _this.syncUnit = syncUnit;
            };
            this.initScene = function (scene) {
                _this.scene = scene;
            };
            this.step = function () {
                var ai_units = _this.unit_collection.getAICollection();
                _this.stepAi(ai_units, 0);
                _this.CACHE = _this.initEmptyGlobalCache();
                _this.syncUnit(_this.unit_collection);
            };
            this.CACHE = this.initEmptyGlobalCache();
            this.scene = {};
            this.cache_coord_bots = [];
            this.syncUnit = function () {
                console.log("default");
            };
        }
        Ai.prototype.initEmptyGlobalCache = function () {
            return {
                units_purpose: [],
                most_damaged_person_3: {},
            };
        };
        Ai.prototype.initView = function (view) {
            this.view = view;
        };
        Ai.prototype.getCoord = function (coord) {
            return parseInt(coord.split("px")[0]);
        };
        Ai.prototype.randomInteger = function (min, max) {
            var rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        };
        Ai.prototype.getUnitObj = function (id) {
            var unit, data = this.unit_collection.getCollection();
            for (var i = 0; i < data.length; i++) {
                if (data[i].person.id == id) {
                    unit = data[i];
                    break;
                }
            }
            return unit;
        };
        Ai.prototype.choseGlobalStr = function (ai_units) {
            var _this = this;
            var tmp_ai = {}, assessment, max = -1, best_ai = {};
            var result_assessment = cacheGlobalStrategy_1.cacheGlobalAI.map(function (AI) {
                tmp_ai = new AI({
                    scene: _this.scene,
                    ai_units: ai_units,
                    view: _this.view,
                    unit_collection: _this.unit_collection,
                });
                assessment = tmp_ai.assessment(_this.CACHE);
                _this.CACHE = assessment.cache;
                return { assessment: assessment.total, ai: tmp_ai };
            });
            console.log("-----------------");
            result_assessment.forEach(function (elem) {
                if (max == -1) {
                    max = elem.assessment;
                    best_ai = elem.ai;
                }
                if (elem.assessment > max) {
                    max = elem.assessment;
                    best_ai = elem.ai;
                }
            });
            return best_ai;
        };
        Ai.prototype.stepAi = function (ai_units, index) {
            if (index === void 0) { index = 0; }
            var best_strategy = this.choseGlobalStr(ai_units);
            best_strategy.start(this.CACHE);
        };
        Ai.prototype.choseTurnUnit = function (cacheAi) {
            return cacheAi.sort(function (prev, next) {
                if (prev.person.class == "archer") {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        };
        return Ai;
    }());
    exports.Ai = Ai;
});
