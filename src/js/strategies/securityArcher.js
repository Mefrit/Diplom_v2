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
        SecurityArcher.prototype.start = function (cache, near_enemy) {
            var _this = this;
            if (near_enemy === void 0) { near_enemy = undefined; }
            return new Promise(function (resolve, reject) {
                var near_archer = _this.findNearestArchers(_this.unit);
                var pos_security = {};
                var near_enemies = [], atake = false;
                if (typeof near_enemy == "undefined") {
                    near_enemy = _this.findNearestEnemies(_this.unit);
                }
                if (Math.abs(_this.unit.x - near_enemy.x) <= 1 && Math.abs(_this.unit.y - near_enemy.y) <= 1) {
                    _this.unit.stopAnimation("default_fighter");
                    _this.unit.playAnimation("atacke_fighter");
                    atake = true;
                    setTimeout(function () {
                        _this.unit.stopAnimation("atacke_fighter");
                        _this.unit.playAnimation("default_fighter");
                    }, 750);
                    _this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, _this.unit.person.damage);
                }
                else {
                    var local_near_enemy = _this.findNearestEnemies(_this.unit);
                    if (Math.abs(_this.unit.x - local_near_enemy.x) <= 1 &&
                        Math.abs(_this.unit.y - local_near_enemy.y) <= 1) {
                        _this.unit.stopAnimation("default_fighter");
                        _this.unit.playAnimation("atacke_fighter");
                        atake = true;
                        setTimeout(function () {
                            _this.unit.stopAnimation("atacke_fighter");
                            _this.unit.playAnimation("default_fighter");
                        }, 750);
                        _this.view.contactPersonsView(local_near_enemy.domPerson, local_near_enemy.image, _this.unit.person.damage);
                    }
                }
                var ai_archers = _this.unit_collection.getAiArchers(), end = false;
                if (ai_archers.length > 1) {
                    ai_archers.forEach(function (elem) {
                        if (_this.getFriendsInField(elem, 2).length == 0 && !end) {
                            near_archer = elem;
                            end = true;
                        }
                    });
                }
                near_enemies = _this.getEnemyInField(near_archer, 6);
                var nearest_enemy = _this.findNearestEnemies(near_archer);
                if (nearest_enemy.x > near_archer.x) {
                    pos_security.x = near_archer.x + 1;
                }
                else {
                    pos_security.x = near_archer.x - 1;
                }
                pos_security.y = near_archer.y;
                var wall_blocks = _this.scene.get("wall_blocks"), water_blocks = _this.scene.get("water_blocks");
                near_enemies = _this.getEnemyInField({ x: _this.unit.x, y: _this.unit.y }, 6);
                if (_this.unit_collection.checkFreeCoord({ x: pos_security.x, y: near_archer.y + 1 }) &&
                    !_this.checkFreeCoordWalls(wall_blocks, { x: pos_security.x, y: near_archer.y + 1 }) &&
                    !_this.checkFreeCoordWalls(water_blocks, { x: pos_security.x, y: near_archer.y + 1 })) {
                    pos_security.y = near_archer.y + 1;
                }
                else {
                    pos_security.y = near_archer.y - 1;
                }
                if (typeof near_enemy == "undefined" || atake) {
                    near_enemy = _this.findNearestEnemies(_this.unit);
                }
                pos_security.near_archer = near_archer;
                console.log("pos_security", pos_security, near_archer.domPerson);
                var res = _this.moveCarefully(_this.unit, pos_security, "securityArcher");
                var checkArcherPosition = _this.checkArcherPosition(near_enemy);
                if (Math.abs(_this.unit.x - near_enemy.x) <= 1 && Math.abs(_this.unit.y - near_enemy.y) <= 1 && !atake) {
                    _this.unit.stopAnimation("default_fighter");
                    _this.unit.playAnimation("atacke_fighter");
                    setTimeout(function () {
                        _this.unit.stopAnimation("atacke_fighter");
                        _this.unit.playAnimation("default_fighter");
                    }, 750);
                    _this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, _this.unit.person.damage);
                }
                else {
                    var local_near_enemy = _this.findNearestEnemies(_this.unit);
                    if (Math.abs(_this.unit.x - local_near_enemy.x) <= 1 &&
                        Math.abs(_this.unit.y - local_near_enemy.y) <= 1) {
                        _this.unit.stopAnimation("default_fighter");
                        _this.unit.playAnimation("atacke_fighter");
                        atake = true;
                        setTimeout(function () {
                            _this.unit.stopAnimation("atacke_fighter");
                            _this.unit.playAnimation("default_fighter");
                        }, 750);
                        _this.view.contactPersonsView(local_near_enemy.domPerson, local_near_enemy.image, _this.unit.person.damage);
                    }
                }
                if (checkArcherPosition.result && !_this.unit.moveAction) {
                    _this.moveAutoStepStupid(_this.unit, checkArcherPosition.point, "securityArcher");
                }
                if (_this.checkFreeCoordWalls(_this.unit_collection.getAICollection(), pos_security)) {
                    pos_security.x = near_archer.x - 1;
                }
                else {
                    pos_security.x = near_archer.x + 1;
                }
                _this.unit.setMoveAction(false);
                setTimeout(function () {
                    resolve("Promise2");
                }, 320);
            });
        };
        return SecurityArcher;
    }(defaultMethods_1.DefaultMethodsStrategy));
    exports.SecurityArcher = SecurityArcher;
});
