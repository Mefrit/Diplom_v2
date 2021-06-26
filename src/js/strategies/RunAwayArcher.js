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
    exports.RunAwayArcher = void 0;
    var RunAwayArcher = (function (_super) {
        __extends(RunAwayArcher, _super);
        function RunAwayArcher(props) {
            var _this = _super.call(this, props) || this;
            _this.unit = props.unit;
            _this.last_enemie;
            _this.parent_strategy = props.hasOwnProperty("parent_strategy") ? props.parent_strategy : "default";
            return _this;
        }
        RunAwayArcher.prototype.getInfo = function () {
            return "AtackTheArcher";
        };
        RunAwayArcher.prototype.assessment = function (cache_assessment) {
            var result = 1000, enemies;
            if (!cache_assessment.enemies_near_5) {
                enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 5);
                cache_assessment.enemies_near_5 = enemies;
            }
            if (enemies.length == 0) {
                result -= 500;
            }
            else {
                result += 1000 / enemies.length;
            }
            enemies.forEach(function (elem) {
                result -= elem.health * 5;
            });
            return { total: result, cache: cache_assessment };
        };
        RunAwayArcher.prototype.atakeArcher = function (enemie) {
            var _this = this;
            this.unit.stopAnimation("default_archer");
            this.unit.playAnimation("atacke_archer");
            setTimeout(function () {
                _this.unit.stopAnimation("atacke_archer");
                _this.unit.playAnimation("default_archer");
            }, 800);
            this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
        };
        RunAwayArcher.prototype.tryAtakeArcher = function (resCheck, enemie) {
            var pointPosition, xLineCondition, yLineCondition, res = { pointPosition: [], result: true };
            if (resCheck.arrayPoit.length > 0) {
                pointPosition = resCheck.arrayPoit[resCheck.arrayPoit.length - 1];
                res.pointPosition = pointPosition;
                xLineCondition = enemie.x == this.unit.x && pointPosition.x == this.unit.x;
                yLineCondition = enemie.y == this.unit.y && pointPosition.y == this.unit.y;
            }
            else {
                xLineCondition = false;
                yLineCondition = false;
            }
            if (yLineCondition || xLineCondition || resCheck.arrayPoit.length == 0) {
                if (Math.abs(this.unit.x - enemie.x) >= Math.abs(this.unit.y - enemie.y)) {
                    if (Math.abs(this.unit.x - enemie.x) < 3 && !this.unit.moveAction) {
                        this.moveAutoStepStupid(this.unit, enemie, "archer");
                    }
                    else {
                        if (Math.abs(this.unit.y - enemie.y) < 3 && this.unit.y != enemie.y && !this.unit.moveAction) {
                            this.moveAutoStepStupid(this.unit, enemie, "archer");
                        }
                    }
                    if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                        this.atakeArcher(enemie);
                    }
                    else {
                        res.result = false;
                    }
                }
                else {
                    var new_x = void 0, new_y = void 0;
                    if (!this.unit.moveAction) {
                        if (enemie.person.y < 3) {
                            this.moveCarefully(this.unit, { x: enemie.person.x, y: 8 }, "fighter", {});
                        }
                        else {
                            this.moveCarefully(this.unit, { x: enemie.person.x, y: 0 }, "fighter", {});
                        }
                    }
                    if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                        this.atakeArcher(enemie);
                    }
                    else {
                        res.result = false;
                    }
                }
            }
            else {
                res.result = false;
            }
            return res;
        };
        RunAwayArcher.prototype.runAwayArcher = function (enemy) {
            if (this.unit.x < 11) {
                this.moveAutoStepStupid(this.unit, point, "archer");
            }
        };
        RunAwayArcher.prototype.got2AttackePosition = function (enemie) {
            if (enemie == undefined) {
                enemie = this.findNearestEnemies(this.unit);
            }
            if (this.parent_strategy == "UndercoverArcherAttack") {
                return this.moveAutoStepStupid(this.unit, this.getCoordForAtackeForrwarArcher(this.unit, enemie, "StayForwardArcher"), "fighter");
            }
            var res = this.checkFreeWay2Atack(enemie, this.unit, "x"), coord;
            if (this.getDistanceBetweenUnits(enemie, this.unit) > 6) {
                return this.moveAutoStepStupid(this.unit, enemie, "archer");
            }
            coord = this.getCoordForAtacke(this.unit, enemie, "default", res.free);
            if (coord) {
                return this.moveAutoStepStupid(this.unit, coord, "stupid");
            }
            else {
                return this.moveAutoStepStupid(this.unit, coord, "fighter");
            }
        };
        RunAwayArcher.prototype.findPointAtackArcher = function (enemie) {
            var maxX = Math.abs(enemie.person.x - this.unit.person.x), maxY = Math.abs(enemie.person.y - this.unit.person.y), resCheck, res;
            if (maxY > maxX) {
                resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
            }
            else {
                resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
            }
            if (resCheck.free) {
                this.got2AttackePosition(enemie);
                res = this.tryAtakeArcher(resCheck, enemie);
                if (!res.result) {
                    if (!this.unit.moveAction) {
                        this.got2AttackePosition(enemie);
                    }
                    maxX = Math.abs(enemie.person.x - this.unit.person.x);
                    maxY = Math.abs(enemie.person.y - this.unit.person.y);
                    if (maxY > maxX) {
                        resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
                    }
                    else {
                        resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
                    }
                    if (resCheck.free) {
                        this.tryAtakeArcher(resCheck, enemie);
                    }
                }
            }
            else {
                if (!this.unit.moveAction) {
                    this.got2AttackePosition(enemie);
                }
                maxX = Math.abs(enemie.person.x - this.unit.person.x);
                maxY = Math.abs(enemie.person.y - this.unit.person.y);
                if (maxY > maxX) {
                    resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
                }
                else {
                    resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
                }
                if (resCheck.free) {
                    this.tryAtakeArcher(resCheck, enemie);
                }
            }
        };
        RunAwayArcher.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var enemie = _this.findNearestEnemies(_this.unit);
                _this.last_enemie = enemie;
                _this.findPointAtackArcher(enemie);
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise");
                }, 520);
            });
        };
        RunAwayArcher.prototype.atackeChosenUnit = function (cache, enemie) {
            var _this = this;
            console.log(enemie);
            return new Promise(function (resolve, reject) {
                if (enemie.isNotDied()) {
                    enemie = _this.findNearestEnemies(_this.unit);
                }
                _this.runAwayArcher(enemie);
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise5");
                }, 320);
            });
        };
        return RunAwayArcher;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.RunAwayArcher = RunAwayArcher;
});
