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
define(["require", "exports", "../lib/defaultMethods"], function (require, exports, defaultMethods_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecurityArcher = void 0;
    var SecurityArcher = (function (_super) {
        __extends(SecurityArcher, _super);
        function SecurityArcher(props) {
            var _this = _super.call(this, props) || this;
            _this.unit = props.unit;
            return _this;
        }
        SecurityArcher.prototype.getInfo = function () {
            return "SecurityArcher";
        };
        SecurityArcher.prototype.assessment = function (cache) {
            var result = 1000, enemies;
            if (this.unit.health < 30) {
                result += 200;
            }
            if (this.unit.health < 20) {
                result += 300;
            }
            if (!cache.enemies_near_3) {
                enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
                cache.enemies_near_3 = enemies;
            }
            else {
                enemies = cache.enemies_near_3;
            }
            if (enemies.length == 0) {
                result += 300;
            }
            else {
                result -= 1000 / enemies.length;
            }
            return { total: Math.round(result), cache: cache };
        };
        SecurityArcher.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var near_archers = _this.unit_collection.getAiArchers(), near_enemy = _this.findNearestEnemies(_this.unit);
                var near_archer = _this.findNearestArchers(_this.unit);
                var pos_security = {};
                pos_security.y = near_archer.y;
                if (Math.abs(_this.unit.x - near_archer.x) != 0 || Math.abs(_this.unit.y - near_archer.y) != 0) {
                    pos_security.x = near_archer.x - 1;
                    if (_this.unit_collection.checkFreeCoord({ x: pos_security.x, y: near_archer.y })) {
                        pos_security.y = near_archer.y;
                    }
                    else {
                        if (_this.unit.y + 1 < 7 && _this.randomInteger(-2, 1) > 0) {
                            if (_this.unit.y > pos_security.y) {
                                pos_security.y = near_archer.y + 1;
                            }
                        }
                        else {
                            if (_this.unit.y < pos_security.y) {
                                pos_security.y = near_archer.y - 1;
                            }
                        }
                    }
                    console.log("pos_security => ", pos_security);
                    var res = _this.moveAutoStepStupid(_this.unit, pos_security, "fighter");
                    if (res.findEnime == true) {
                        if (Math.abs(_this.unit.x - near_enemy.x) == 1) {
                            _this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, _this.unit.person.damage);
                            var checkArcherPosition = _this.checkArcherPosition(near_enemy);
                            if (checkArcherPosition.result && !_this.unit.moveAction) {
                                _this.moveAutoStepStupid(_this.unit, checkArcherPosition.point, "fighter");
                            }
                        }
                        else {
                        }
                    }
                }
                setTimeout(function () { resolve("Promise2"); }, 320);
            });
        };
        return SecurityArcher;
    }(defaultMethods_1.DefaultMethodsStrategey));
    exports.SecurityArcher = SecurityArcher;
});
