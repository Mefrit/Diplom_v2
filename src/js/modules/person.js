define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Person = void 0;
    var Person = (function () {
        function Person(person) {
            this.person = person;
            this.x = person.x;
            this.y = person.y;
            this.moveAction = false;
            this.domPerson = undefined;
            this.animation = [];
            this.coordPrevPoint = {};
            this.image = undefined;
            this.interval_animation;
        }
        Person.prototype.initDomPerson = function (domPerson) {
            this.domPerson = domPerson;
        };
        Person.prototype.randomInteger = function (min, max) {
            var rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        };
        Person.prototype.getDoomObj = function () {
            return this.domPerson;
        };
        Person.prototype.setAnimation = function (name, animation) {
            this.animation[name] = animation;
        };
        Person.prototype.getAnimation = function (name) {
            return this.animation[name];
        };
        Person.prototype.playAnimation = function (name) {
            this.animation[name].play();
        };
        Person.prototype.stopAnimation = function (name) {
            this.animation[name].stop();
        };
        Person.prototype.initImage = function (image) {
            this.image = image;
        };
        Person.prototype.setHealth = function (value) {
            this.person.health = parseInt(value);
        };
        Person.prototype.isArchers = function (unit) {
            return this.person.class == "archer";
        };
        Person.prototype.getHealth = function () {
            return parseInt(this.person.health);
        };
        Person.prototype.getUrl = function () {
            return this.person.url;
        };
        Person.prototype.isNotDied = function () {
            return this.person.health <= 12;
        };
        Person.prototype.getId = function () {
            return this.person.id;
        };
        Person.prototype.getKind = function () {
            return this.person.evil;
        };
        Person.prototype.removePrevPoint = function () {
            this.coordPrevPoint = {};
        };
        Person.prototype.setCoord = function (x, y) {
            this.person.x = x;
            this.person.y = y;
            this.x = x;
            this.y = y;
            this.moveAction = true;
            this.coordPrevPoint = { x: x, y: y };
        };
        Person.prototype.getX = function () {
            return parseFloat(this.x);
        };
        Person.prototype.getY = function () {
            return parseFloat(this.y);
        };
        Person.prototype.getHeight = function () {
            return parseFloat(this.person.height);
        };
        Person.prototype.getWidth = function () {
            return parseFloat(this.person.width);
        };
        Person.prototype.getMoveAction = function () {
            return this.moveAction;
        };
        Person.prototype.setMoveAction = function (value) {
            this.moveAction = value;
        };
        return Person;
    }());
    exports.Person = Person;
});
