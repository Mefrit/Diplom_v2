export class Person {
    person: any;
    chosePerson: boolean;
    arrImg: object[];
    canvas: any;
    moveAction: any;
    x: any;
    y: any;
    coordPrevPoint: any; // координаты предыдущей точки
    interval_animation: any;
    animation: any[];
    domPerson: any;
    image: any; // картинка персонажа
    constructor(person) {
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
    initDomPerson(domPerson) {
        this.domPerson = domPerson;
    }
    randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    getDoomObj() {
        return this.domPerson;
    }
    setAnimation(name, animation) {
        this.animation[name] = animation;
    }
    getAnimation(name) {
        return this.animation[name];
    }
    playAnimation(name) {
        this.animation[name].play();
    }
    stopAnimation(name) {
        this.animation[name].stop();
    }
    initImage(image) {
        this.image = image;
    }
    setHealth(value) {
        this.person.health = parseInt(value);
    }
    isArchers(unit) {
        return this.person.class == "archer";
    }
    getHealth() {
        return parseInt(this.person.health);
    }
    getUrl() {
        return this.person.url;
    }
    isNotDied() {
        return this.person.health <= 12;
    }
    getId() {
        return this.person.id;
    }
    getKind() {
        return this.person.evil;
    }
    removePrevPoint() {
        this.coordPrevPoint = {};
    }
    setCoord(x: number, y: number) {
        this.person.x = x;
        this.person.y = y;
        this.x = x;
        this.y = y;
        // какой ужас, но лень сделать под массивы
        this.moveAction = true;
        this.coordPrevPoint = { x: x, y: y };
    }
    getX() {
        return parseFloat(this.x);
    }
    getY() {
        return parseFloat(this.y);
    }
    getHeight() {
        return parseFloat(this.person.height);
    }
    getWidth() {
        return parseFloat(this.person.width);
    }
    getMoveAction() {
        return this.moveAction;
    }
    setMoveAction(value) {
        this.moveAction = value;
    }
}
