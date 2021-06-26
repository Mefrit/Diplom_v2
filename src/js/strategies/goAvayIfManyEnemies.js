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
    exports.GoAwayIfManyEnemies = void 0;
    var GoAwayIfManyEnemies = (function (_super) {
        __extends(GoAwayIfManyEnemies, _super);
        function GoAwayIfManyEnemies(props) {
            var _this = _super.call(this, props) || this;
            _this.unit = props.unit;
            return _this;
        }
        GoAwayIfManyEnemies.prototype.getInfo = function () {
            return "GoAwayIfManyEnemies";
        };
        GoAwayIfManyEnemies.prototype.assessment = function (cache) {
            var result = 200, enemies;
            if (!cache.enemies_near_5) {
                enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 5);
                cache.enemies_near_5 = enemies;
            }
            result += 150 * cache.enemies_near_5.length;
            console.log("result\n \n \n", Math.round(result));
            return { total: Math.round(result), cache: cache };
        };
        GoAwayIfManyEnemies.prototype.heuristicSave = function (point, near_enemies, nearest_friend) {
            var _this = this;
            var priority = 0;
            near_enemies.forEach(function (elem, index, arr) {
                priority += Math.pow(Math.abs(point.x - elem.x), 2) + Math.pow(Math.abs(point.y - elem.y), 2);
                if (Math.abs(point.x - elem.x) < 3 && point.y == elem.y) {
                    priority += 10;
                }
                if (Math.abs(point.x - elem.x) < 3 && Math.abs(point.y - elem.y) < 3) {
                    priority += 40;
                }
                if (Math.abs(point.x - elem.x) < 2 && Math.abs(point.y - elem.y) < 2) {
                    priority += 50;
                }
                if (Math.abs(point.y - elem.y) < 2 && point.x == elem.x) {
                    priority += 30;
                }
                if (Math.abs(point.x - _this.unit.x) < 2 && Math.abs(point.y - _this.unit.y) < 2) {
                    priority += 10;
                }
            });
            if (point.x == nearest_friend.x && point.y == nearest_friend.y) {
                priority -= 2000;
            }
            if (Math.abs(point.x - nearest_friend.x) == 0) {
                priority -= 1000;
            }
            if (Math.abs(point.y - nearest_friend.y) == 1 && Math.abs(point.x - nearest_friend.x) == 0) {
                priority -= 100;
            }
            priority +=
                Math.pow(Math.abs(point.x - nearest_friend.x), 2) + Math.pow(Math.abs(point.y - nearest_friend.y), 3) + 10;
            priority += Math.abs(point.x - nearest_friend.x) * 10;
            return priority;
        };
        GoAwayIfManyEnemies.prototype.go2friendsSafety = function (nearest_friend, is_protect_arher) {
            var _this = this;
            if (is_protect_arher === void 0) { is_protect_arher = false; }
            var near_enemies, points_near, best_point;
            near_enemies = this.getEnemyInField({
                x: this.unit.x,
                y: this.unit.y,
            }, 4);
            points_near = this.getNeighbors({ x: this.unit.x, y: this.unit.y });
            points_near = this.deleteExcessCoord(points_near);
            if (is_protect_arher &&
                this.getDistanceBetweenUnits(this.unit, { x: nearest_friend.x, y: nearest_friend.y }) < 3) {
                points_near.push({ x: nearest_friend.x, y: nearest_friend.y });
            }
            points_near.forEach(function (elem, index, arr) {
                elem.priority = _this.heuristicSave(elem, near_enemies, nearest_friend);
            });
            points_near = this.deleteExcessCoord(points_near);
            best_point = points_near[0];
            points_near.forEach(function (element) {
                if (element.priority <= best_point.priority) {
                    best_point = element;
                }
            });
            if (points_near.length > 0) {
                this.moveTo(this.unit, best_point);
            }
        };
        GoAwayIfManyEnemies.prototype.got2AttackePosition = function (enemie) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var near_friends = _this.unit_collection.getAICollection(), nearest_friend;
                if (near_friends.length == 0) {
                }
                else {
                    nearest_friend = _this.getNearFriendsUnit(_this.unit, near_friends);
                    _this.go2friendsSafety(nearest_friend, false);
                }
                _this.unit.setMoveAction(false);
                console.log("nearest_friend", nearest_friend, enemie);
                setTimeout(function () {
                    resolve("Promise4");
                }, 320);
            });
        };
        GoAwayIfManyEnemies.prototype.atackeChosenUnit = function (cache, enemie, is_protect_arcger) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var near_friends = _this.unit_collection.getAICollection(), nearest_friend;
                enemie = _this.findNearestEnemies(_this.unit);
                var point;
                if (near_friends.length == 0) {
                    point = _this.getGetPointFarFromEnemie(_this.unit, enemie);
                    _this.go2friendsSafety(point, is_protect_arcger);
                }
                else {
                    if (is_protect_arcger) {
                        point = _this.getGetPointFarFromEnemie(_this.unit, enemie);
                    }
                    else {
                        point = _this.getNearFriendsUnit(_this.unit, near_friends);
                    }
                }
                _this.go2friendsSafety(point, is_protect_arcger);
                var maxX = Math.abs(enemie.person.x - _this.unit.person.x), resCheck, maxY = Math.abs(enemie.person.y - _this.unit.person.y);
                if (maxY > maxX) {
                    resCheck = _this.checkFreeWay2Atack(enemie, _this.unit, "y");
                }
                else {
                    resCheck = _this.checkFreeWay2Atack(enemie, _this.unit, "x");
                }
                if (resCheck.free) {
                    _this.tryAtakeArcher(resCheck, enemie);
                }
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise4");
                }, 320);
            });
        };
        GoAwayIfManyEnemies.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var near_friends = _this.unit_collection.getAICollection(), nearest_friend;
                if (near_friends.length == 0) {
                }
                else {
                    nearest_friend = _this.getNearFriendsUnit(_this.unit, near_friends);
                    _this.go2friendsSafety(nearest_friend, false);
                }
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise4");
                }, 320);
            });
        };
        return GoAwayIfManyEnemies;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.GoAwayIfManyEnemies = GoAwayIfManyEnemies;
});
