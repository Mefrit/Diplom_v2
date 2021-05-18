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
    exports.AtackTheArcher = void 0;
    var AtackTheArcher = (function (_super) {
        __extends(AtackTheArcher, _super);
        function AtackTheArcher(props) {
            var _this = _super.call(this, props) || this;
            _this.unit = props.unit;
            _this.last_enemie;
            return _this;
        }
        AtackTheArcher.prototype.getInfo = function () {
            return "AtackTheArcher";
        };
        AtackTheArcher.prototype.assessment = function (cache_assessment) {
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
        AtackTheArcher.prototype.checkFreeWay2Atack = function (enemie, direction) {
            var arrayPoit = [], sgn = enemie[direction] < this.unit[direction] ? -1 : 1, tmp, res = { free: false, arrayPoit: [], direction: direction, runAway: false }, coefI;
            tmp = Math.abs(enemie[direction] - this.unit[direction]);
            if (tmp <= 4) {
                coefI = tmp;
            }
            else {
                return res;
            }
            for (var i = 1; i <= coefI; i++) {
                if (arrayPoit.length < 6) {
                    tmp = direction == "x" ? { x: enemie.x - sgn * i, y: enemie.y } : { x: enemie.x, y: enemie.y - sgn * i };
                    if (tmp.x >= 0 && tmp.y >= 0) {
                        if (tmp.x != this.unit.x && tmp.y != this.unit.y) {
                            arrayPoit.push(tmp);
                        }
                    }
                }
                else {
                    break;
                }
            }
            tmp = this.checkFreePointsArcher(arrayPoit, "archer");
            res.free = tmp.free;
            if (tmp.deleteLastPoint) {
                arrayPoit.splice(arrayPoit.length - 1, 1);
            }
            res.arrayPoit = arrayPoit;
            return res;
        };
        AtackTheArcher.prototype.atakeArcher = function (enemie) {
            this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
        };
        AtackTheArcher.prototype.tryAtakeArcher = function (resCheck, enemie) {
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
                if (Math.abs(this.unit.x - enemie.x) < Math.abs(this.unit.y - enemie.y)) {
                    if (Math.abs(this.unit.x - enemie.x) < 3 && !this.unit.moveAction) {
                        this.moveAutoStepStupid(this.unit, enemie, "archer");
                    }
                    else {
                        if (Math.abs(this.unit.y - enemie.y) < 2 && this.unit.y != enemie.y && !this.unit.moveAction) {
                            this.moveAutoStepStupid(this.unit, enemie, "archer");
                        }
                    }
                    this.atakeArcher(enemie);
                }
                else {
                    console.log("\n\n FIX ME!!! moveAutoStepStupid pointPosition YYYYYYYYYYYYY", pointPosition);
                }
            }
            else {
                res.result = false;
            }
            return res;
        };
        AtackTheArcher.prototype.runAwayArcher = function () {
            if (this.unit.x < 8) {
                this.moveAutoStepStupid(this.unit, { x: this.unit.x + 1, y: this.unit.y }, "archer");
            }
        };
        AtackTheArcher.prototype.got2AttackePosition = function (enemie) {
            this.moveAutoStepStupid(this.unit, { x: enemie.x, y: enemie.y }, "archer");
        };
        AtackTheArcher.prototype.findPointAtackArcher = function (enemie) {
            var maxX = Math.abs(enemie.person.x - this.unit.person.x), maxY = Math.abs(enemie.person.y - this.unit.person.y), resCheck, res;
            console.log(enemie);
            if (maxY > maxX) {
                resCheck = this.checkFreeWay2Atack(enemie, "y");
                if (!resCheck.free) {
                }
            }
            else {
                resCheck = this.checkFreeWay2Atack(enemie, "x");
                if (!resCheck.free) {
                }
            }
            if (resCheck.free) {
                res = this.tryAtakeArcher(resCheck, enemie);
                if (!res.result) {
                    this.moveAutoStepStupid(this.unit, enemie, "archer");
                    this.tryAtakeArcher(resCheck, enemie);
                }
            }
            else {
                this.got2AttackePosition(enemie);
            }
        };
        AtackTheArcher.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var enemie = _this.findNearestEnemies(_this.unit);
                _this.last_enemie = enemie;
                console.log("getDistanceBetweenUnits== > ", _this.getDistanceBetweenUnits(_this.last_enemie, enemie));
                _this.findPointAtackArcher(enemie);
                setTimeout(function () { resolve("Promise"); }, 320);
            });
        };
        AtackTheArcher.prototype.atackeChosenUnit = function (cache, enemie) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.findPointAtackArcher(enemie);
                setTimeout(function () { resolve("Promise"); }, 320);
            });
        };
        return AtackTheArcher;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.AtackTheArcher = AtackTheArcher;
});
