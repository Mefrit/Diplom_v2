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
            _this.unit = props.unit;
            return _this;
        }
        FightIfYouCan.prototype.getInfo = function () {
            return "FightIfYouCan";
        };
        FightIfYouCan.prototype.assessment = function (cache) {
            var result = 1000, enemies, damaged_person = {}, min_health = 200;
            if (this.unit.health < 30) {
                result -= 400;
            }
            if (this.unit.health < 20) {
                result -= 700;
            }
            if (!cache.enemies_near_3) {
                enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
                cache.enemies_near_3 = enemies;
            }
            else {
                enemies = cache.enemies_near_3;
            }
            if (enemies.length == 0) {
                result -= 500;
                damaged_person = {};
            }
            else {
                damaged_person = enemies[0];
                min_health = damaged_person.person.health;
                result += 1000 / enemies.length;
            }
            enemies.forEach(function (elem) {
                if (elem.person.health < min_health) {
                    damaged_person = elem;
                }
                result -= elem.person.health * 5;
            });
            cache.most_damaged_person_3 = damaged_person;
            console.log("!!!!!!!!!!\n\n\n enemies in fields FightIfYouCan", enemies, "damaged", damaged_person);
            return { total: Math.round(result), cache: cache };
        };
        FightIfYouCan.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var nearEnemie, coord, res, attakedEnemie, checkArcherPosition;
                if (cache.hasOwnProperty("most_damaged_person_3")) {
                    if (cache.most_damaged_person_3.length > 0) {
                        nearEnemie = cache.most_damaged_person_3;
                    }
                    else {
                        nearEnemie = _this.findNearestEnemies(_this.unit);
                    }
                }
                else {
                    nearEnemie = _this.findNearestEnemies(_this.unit);
                }
                console.log("start ", cache);
                coord = { x: nearEnemie.person.x, y: nearEnemie.person.y };
                res = _this.moveCarefully(_this.unit, nearEnemie, "fighter", cache);
                if (res.findEnime == true) {
                    attakedEnemie = _this.findEnemieForAtake(res.enemie);
                    _this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, _this.unit.person.damage);
                    checkArcherPosition = _this.checkArcherPosition(res.enemie);
                    if (checkArcherPosition.result && !_this.unit.moveAction) {
                        _this.moveCarefully(_this.unit, checkArcherPosition.point, "fighter", cache);
                    }
                }
                setTimeout(function () { resolve("Promise3"); }, 320);
            });
        };
        FightIfYouCan.prototype.atackeChosenUnit = function (cache, unit) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var nearEnemie = unit, coord, res, attakedEnemie, checkArcherPosition;
                console.log("start cahce", cache);
                console.log("start ", cache);
                coord = { x: nearEnemie.person.x, y: nearEnemie.person.y };
                res = _this.moveCarefully(_this.unit, nearEnemie, "fighter", cache);
                if (res.findEnime == true) {
                    attakedEnemie = _this.findEnemieForAtake(res.enemie);
                    _this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, _this.unit.person.damage);
                    checkArcherPosition = _this.checkArcherPosition(res.enemie);
                    if (checkArcherPosition.result && !_this.unit.moveAction) {
                        console.log("checkArcherPosition", checkArcherPosition);
                        _this.moveCarefully(_this.unit, checkArcherPosition.point, "fighter", cache);
                    }
                }
                setTimeout(function () { resolve("Promise3"); }, 320);
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
    }(defaultMethods_1.DefaultMethodsStrategey));
    exports.FightIfYouCan = FightIfYouCan;
});
