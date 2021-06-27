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
    exports.FightIfYouCan = void 0;
    var FightIfYouCan = (function (_super) {
        __extends(FightIfYouCan, _super);
        function FightIfYouCan(props) {
            var _this = _super.call(this, props) || this;
            _this.unit_collection = props.unit_collection;
            _this.unit = props.unit;
            return _this;
        }
        FightIfYouCan.prototype.getInfo = function () {
            return "FightIfYouCan";
        };
        FightIfYouCan.prototype.assessment = function (cache) {
        };
        FightIfYouCan.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var nearEnemie, coord, res, attakedEnemie, checkArcherPosition;
                nearEnemie = _this.findNearestEnemies(_this.unit);
                coord = { x: nearEnemie.person.x, y: nearEnemie.person.y };
                res = _this.moveCarefully(_this.unit, nearEnemie, "fighter", cache);
                if (res.findEnime == true) {
                    _this.unit.stopAnimation("default_fighter");
                    _this.unit.playAnimation("atacke_fighter");
                    setTimeout(function () {
                        _this.unit.stopAnimation("atacke_fighter");
                        _this.unit.playAnimation("default_fighter");
                    }, 750);
                    _this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, _this.unit.person.damage);
                    checkArcherPosition = _this.checkArcherPosition(res.enemie);
                    if (checkArcherPosition.result && !_this.unit.moveAction) {
                        _this.moveCarefully(_this.unit, checkArcherPosition.point, "fighter", cache);
                    }
                }
                setTimeout(function () {
                    resolve("Promise3");
                }, 320);
            });
        };
        FightIfYouCan.prototype.atackeChosenUnit = function (cache_unit, enemie) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var coord, res, animation, attakedEnemie, checkArcherPosition = { result: false, point: {} }, archers = _this.unit_collection.getAiArchers();
                coord = { x: enemie.person.x, y: enemie.person.y };
                if (_this.checkNearArchersPosition()) {
                    checkArcherPosition = _this.checkArcherPosition(enemie);
                }
                if (enemie.isNotDied()) {
                    enemie = _this.findNearestEnemies(_this.unit);
                }
                if (archers.length != 0 &&
                    checkArcherPosition.result &&
                    !_this.unit.moveAction &&
                    _this.getDistanceBetweenUnits(_this.unit, enemie) < 4) {
                    _this.moveTo(_this.unit, checkArcherPosition.point);
                    if (Number.parseInt(_this.getDistanceBetweenUnits(_this.unit, enemie).toFixed(0)) <= 1) {
                        _this.unit.stopAnimation("default_fighter");
                        _this.unit.playAnimation("atacke_fighter");
                        setTimeout(function () {
                            _this.unit.stopAnimation("atacke_fighter");
                            _this.unit.playAnimation("default_fighter");
                        }, 750);
                        _this.view.contactPersonsView(enemie.domPerson, enemie.image, _this.unit.person.damage);
                    }
                    else {
                        var nearest = _this.findNearestEnemies(_this.unit);
                        if (Number.parseInt(_this.getDistanceBetweenUnits(_this.unit, nearest).toFixed(0)) <= 1) {
                            _this.unit.stopAnimation("default_fighter");
                            _this.unit.playAnimation("atacke_fighter");
                            setTimeout(function () {
                                _this.unit.stopAnimation("atacke_fighter");
                                _this.unit.playAnimation("default_fighter");
                            }, 750);
                            _this.view.contactPersonsView(nearest.domPerson, nearest.image, _this.unit.person.damage);
                        }
                    }
                }
                else {
                    res = _this.moveCarefully(_this.unit, enemie, "fighter", cache_unit);
                    if (res.findEnime == true) {
                        _this.unit.stopAnimation("default_fighter");
                        _this.unit.playAnimation("atacke_fighter");
                        setTimeout(function () {
                            _this.unit.stopAnimation("atacke_fighter");
                            _this.unit.playAnimation("default_fighter");
                        }, 750);
                        _this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, _this.unit.person.damage);
                    }
                }
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise3");
                }, 300);
            });
        };
        FightIfYouCan.prototype.findEnemieForAtake = function (enemie) {
            return enemie;
        };
        FightIfYouCan.prototype.findEnemies = function () {
            var cacheEnimies = [];
            this.unit_collection.getCollection().forEach(function (element) {
                if (!element.person.evil) {
                    cacheEnimies.push(element);
                }
            });
            return cacheEnimies;
        };
        return FightIfYouCan;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.FightIfYouCan = FightIfYouCan;
});
