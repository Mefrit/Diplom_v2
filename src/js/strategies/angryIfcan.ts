import { DefaultMethodsStrategy } from "../lib/defaultMethods";

export class FightIfYouCan extends DefaultMethodsStrategy {
    unit: any;
    coordsEvil: any;
    view: any;
    constructor(props: any) {
        super(props);

        this.unit_collection = props.unit_collection;
        this.unit = props.unit;
        // this.coordsEvil = { x: props.result.x, y: props.result.y };
    }
    getInfo() {
        return "FightIfYouCan";
    }
    // оценка ситуации
    assessment(cache) {}
    start(cache) {
        // FIX ME в оценке искать того чувака, которого необходимо бить, запихивать его в  Cashe и передавать в start()
        return new Promise((resolve, reject) => {
            let nearEnemie, coord, res, attakedEnemie, checkArcherPosition;

            nearEnemie = this.findNearestEnemies(this.unit);

            coord = { x: nearEnemie.person.x, y: nearEnemie.person.y };
            res = this.moveCarefully(this.unit, nearEnemie, "fighter", cache);

            if (res.findEnime == true) {
                // attakedEnemie = this.findEnemieForAtake(res.enemie);
                this.unit.stopAnimation("default_fighter");
                this.unit.playAnimation("atacke_fighter");
                setTimeout(() => {
                    this.unit.stopAnimation("atacke_fighter");
                    this.unit.playAnimation("default_fighter");
                }, 750);
                // запуск анимации атаки
                this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, this.unit.person.damage);
                //FIX ME какая то неправильная функция
                checkArcherPosition = this.checkArcherPosition(res.enemie);
                // только если олучник стреляет сделать то бишь на позиции
                if (checkArcherPosition.result && !this.unit.moveAction) {
                    this.moveCarefully(this.unit, checkArcherPosition.point, "fighter", cache);
                }
            }
            setTimeout(() => {
                resolve("Promise3");
            }, 320);
        });
    }

    atackeChosenUnit(cache_unit, enemie) {
        return new Promise((resolve, reject) => {
            let coord,
                res,
                animation,
                attakedEnemie,
                checkArcherPosition = { result: false, point: {} },
                archers = this.unit_collection.getAiArchers();
            coord = { x: enemie.person.x, y: enemie.person.y };
            if (this.checkNearArchersPosition()) {
                checkArcherPosition = this.checkArcherPosition(enemie);
            }
            console.log("enemie checkArcherPosition", enemie, checkArcherPosition);
            if (enemie.isNotDied()) {
                enemie = this.findNearestEnemies(this.unit);
            }
            if (
                archers.length != 0 &&
                checkArcherPosition.result &&
                !this.unit.moveAction &&
                this.getDistanceBetweenUnits(this.unit, enemie) < 4
            ) {
                // this.moveTo(this.unit, checkArcherPosition.point);
                this.moveTo(this.unit, checkArcherPosition.point);
                if (Number.parseInt(this.getDistanceBetweenUnits(this.unit, enemie).toFixed(0)) <= 1.2) {
                    this.unit.stopAnimation("default_fighter");
                    this.unit.playAnimation("atacke_fighter");
                    setTimeout(() => {
                        this.unit.stopAnimation("atacke_fighter");
                        this.unit.playAnimation("default_fighter");
                    }, 750);
                    this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
                } else {
                    let nearest = this.findNearestEnemies(this.unit);

                    if (Number.parseInt(this.getDistanceBetweenUnits(this.unit, nearest).toFixed(0)) <= 1.2) {
                        this.unit.stopAnimation("default_fighter");
                        this.unit.playAnimation("atacke_fighter");

                        // animation.stop();
                        setTimeout(() => {
                            this.unit.stopAnimation("atacke_fighter");
                            this.unit.playAnimation("default_fighter");
                        }, 750);
                        this.view.contactPersonsView(nearest.domPerson, nearest.image, this.unit.person.damage);
                    }
                }

                // запуск анимации атаки
            } else {
                // console.log("moveCarefully", enemie, this.unit);
                res = this.moveCarefully(this.unit, enemie, "fighter", cache_unit);
                if (res.findEnime == true && this.getDistanceBetweenUnits(res.enemie, this.unit) <= 1.2) {
                    // attakedEnemie = res.enemie;
                    // запуск анимации атаки

                    this.unit.stopAnimation("default_fighter");
                    this.unit.playAnimation("atacke_fighter");

                    // animation.stop();
                    setTimeout(() => {
                        this.unit.stopAnimation("atacke_fighter");
                        this.unit.playAnimation("default_fighter");
                    }, 750);
                    this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, this.unit.person.damage);
                } else {
                    enemie = this.findNearestEnemies(this.unit);
                    if (this.getDistanceBetweenUnits(enemie, this.unit) <= 1.2) {
                        // attakedEnemie = res.enemie;
                        // запуск анимации атаки

                        this.unit.stopAnimation("default_fighter");
                        this.unit.playAnimation("atacke_fighter");

                        // animation.stop();
                        setTimeout(() => {
                            this.unit.stopAnimation("atacke_fighter");
                            this.unit.playAnimation("default_fighter");
                        }, 750);
                        this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
                    }
                }
            }
            this.unit.setMoveAction(false);

            setTimeout(() => {
                resolve("Promise3");
            }, 300);
        });
    }
    findEnemieForAtake(enemie) {
        return enemie;
    }

    findEnemies() {
        let cacheEnimies = [];
        this.unit_collection.getCollection().forEach((element) => {
            if (!element.person.evil) {
                cacheEnimies.push(element);
            }
        });
        return cacheEnimies;
    }
}
