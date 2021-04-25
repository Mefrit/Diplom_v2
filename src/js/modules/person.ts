export class Person {
    person: any;
    chosePerson: boolean;
    arrImg: object[];
    canvas: any;
    moveAction: any;
    x: any;
    y: any;
    coordPrevPoint: any;// координаты предыдущей точки


    domPerson: any;
    image: any; // картинка персонажа
    constructor(person) {
        this.person = person;
        this.x = person.x;
        this.y = person.y;
        this.moveAction = false;
        this.domPerson = undefined;

        this.coordPrevPoint = {};
        this.image = undefined
    }
    initDomPerson(domPerson) {
        this.domPerson = domPerson;
    }
    initImage(image) {
        this.image = image;
    }
    setHealth(value) {
        this.person.health = parseInt(value);
    }
    getHealth() {
        return parseInt(this.person.health);
    }
    getUrl() {
        return this.person.url;
    }
    isNotDied() {
        return this.person.health <= 10;
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
        this.use = false;
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
