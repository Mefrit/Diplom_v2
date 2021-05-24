import { Person } from "./person";
export class Collection {
    collection: any;
    constructor(data) {
        this.collection = data.map((elem) => {
            return new Person(elem);
        });
    }
    getCollection() {
        return this.collection;
    }
    getAICollection() {
        return this.collection.filter(element => {
            if (element.person.evil && element.person.health > 12) {
                return element;
            }
        });
    }
    getUserCollection() {
        return this.collection.filter(element => {
            if (!element.person.evil && element.person.health > 12) {
                return element;
            }
        });
    }



    checkFreeCoord(coord) {
        let res = true;
        this.collection.forEach((element) => {
            if (!element.isNotDied()) {
                if (element.x == coord.x && element.y == coord.y) {
                    res = false;
                }
            }
        });
        return res;
    }

    getPersonById(id) {
        return this.collection.filter((elem) => {
            if (!elem.isNotDied() && elem.perosn.id == id) {
                return elem;
            }
        });
    }
    getAiArchers() {
        return this.collection.filter((elem) => {
            if (elem.person.evil && elem.person.class == 'archer') {
                return elem;
            }
        });
    }
    updateElement(unit) {
        this.collection = this.collection.map((elem) => {
            if (unit.getId() == elem.getId()) {
                return unit;
            } else {
                return elem;
            }
        });
    }
}
