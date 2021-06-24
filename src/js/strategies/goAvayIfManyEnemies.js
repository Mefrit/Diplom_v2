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
        GoAwayIfManyEnemies.prototype.go2friendsSafety = function (nearest_friend) {
            var _this = this;
            var near_enemies, points_near, best_point;
            near_enemies = this.getEnemyInField({
                x: this.unit.x,
                y: this.unit.y,
            }, 4);
            console.log("near_enemies", near_enemies);
            points_near = this.getNeighbors({ x: this.unit.x, y: this.unit.y });
            console.log("go2friendsSafety s", this.getNeighbors({ x: this.unit.x, y: this.unit.y }));
            points_near = this.deleteExcessCoord(points_near);
            points_near.forEach(function (elem, index, arr) {
                elem.priority = _this.heuristicSave(elem, near_enemies, nearest_friend);
            });
            best_point = points_near[0];
            points_near.forEach(function (element) {
                if (element.priority <= best_point.priority) {
                    best_point = element;
                }
            });
            console.log(" tbest_point);", best_point);
            if (points_near.length > 0) {
                console.log(" tbest_point);", best_point);
                this.moveTo(this.unit, best_point);
            }
        };
        GoAwayIfManyEnemies.prototype.start = function (cache) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var near_friends = _this.unit_collection.getAICollection(), nearest_friend;
                if (near_friends.length == 0) {
                }
                else {
                    nearest_friend = _this.getNearFriendsUnit(_this.unit, near_friends);
                    _this.go2friendsSafety(nearest_friend);
                }
                _this.unit.setMoveAction(false);
                console.log("nearest_friend", nearest_friend);
                setTimeout(function () {
                    resolve("Promise4");
                }, 320);
            });
        };
        return GoAwayIfManyEnemies;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.GoAwayIfManyEnemies = GoAwayIfManyEnemies;
});
