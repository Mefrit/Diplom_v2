import { DefaultMethodsStrategy } from "../lib/defaultMethods";

export class FightIfYouCan extends DefaultMethodsStrategy {
    unit: any;
    coordsEvil: any;
    view: any
    constructor(props: any) {
        super(props);
        // console.log("\n angry", props);
        this.unit_collection = props.unit_collection;
        this.unit = props.unit;
        // this.coordsEvil = { x: props.result.x, y: props.result.y };
    }
    getInfo() {
        return "FightIfYouCan";
    }
    // оценка ситуации
    assessment(cache) {
        // FIX ME возможно стоит завести 2 поля, самый слабый по здорровью юнит или вдруг, самый отдаленный от корешей
        var result = 1000, enemies, damaged_person: any = {}, min_health = 200;
        if (this.unit.health < 30) {
            result -= 400;
        }
        if (this.unit.health < 20) {
            result -= 700;
        }
        if (!cache.enemies_near_3) {
            enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
            cache.enemies_near_3 = enemies
        } else {
            enemies = cache.enemies_near_3;
        }
        if (enemies.length == 0) {
            result -= 500;
            damaged_person = {};
        } else {
            damaged_person = enemies[0];
            min_health = damaged_person.person.health
            result += 1000 / enemies.length;
        }
        // min_health = 150;
        // как вариант выбирать еще и самого дальнего
        enemies.forEach(elem => {
            // console.log(elem);
            if (elem.person.health < min_health) {
                damaged_person = elem;
            }
            result -= elem.person.health * 5;
        });
        cache.most_damaged_person_3 = damaged_person;

        return { total: Math.round(result), cache: cache };
    }
    start(cache) {

        // FIX ME в оценке искать того чувака, которого необходимо бить, запихивать его в  Cashe и передавать в start()

        // если с переди стоят лучники то выбирать более агрессивную стратегию
        return new Promise((resolve, reject) => {
            let nearEnemie, coord, res, attakedEnemie, checkArcherPosition;
            console.log("FightIfYouCan cache ", cache);
            nearEnemie = this.findNearestEnemies(this.unit);
            // if (cache.hasOwnProperty("most_damaged_person_3")) {
            //     if (cache.most_damaged_person_3.length > 0) {
            //         nearEnemie = cache.most_damaged_person_3;
            //     } else {
            //         nearEnemie = this.findNearestEnemies(this.unit);
            //     }
            // } else {
            //     nearEnemie = this.findNearestEnemies(this.unit);
            // }

            coord = { x: nearEnemie.person.x, y: nearEnemie.person.y };
            res = this.moveCarefully(this.unit, nearEnemie, "fighter", cache);

            if (res.findEnime == true) {
                attakedEnemie = this.findEnemieForAtake(res.enemie);
                // запуск анимации атаки
                this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, this.unit.person.damage);
                //FIX ME какая то неправильная функция
                checkArcherPosition = this.checkArcherPosition(res.enemie);
                // только если олучник стреляет сделать то бишь на позиции
                if (checkArcherPosition.result && !this.unit.moveAction) {
                    this.moveCarefully(this.unit, checkArcherPosition.point, "fighter", cache);
                }
            }
            setTimeout(() => { resolve("Promise3") }, 320);

        });
    }

    atackeChosenUnit(cache_unit, enemie) {
        console.log("FightIfYouCan cache1111111 ", cache_unit, enemie);

        return new Promise((resolve, reject) => {
            let coord, res, attakedEnemie, checkArcherPosition, archers = this.unit_collection.getAiArchers();



            coord = { x: enemie.person.x, y: enemie.person.y };
            // this.unit_collection.getAiArchers()
            // checkArcherPosition = this.checkUnitNotStatyOnArhcersAtacke(this.unit, this.global_cache.units_purpose, archers);

            checkArcherPosition = this.checkArcherPosition(enemie);
            console.log("checkArcherPosition", checkArcherPosition);
            if (checkArcherPosition.result && !this.unit.moveAction && this.getDistanceBetweenUnits(this.unit, enemie) < 3) {
                console.log("checkArcherPosition poinr", this.unit, checkArcherPosition.point);
                // this.moveCarefully(this.unit, checkArcherPosition.point, "fighter", cache_unit);
                this.moveTo(this.unit, checkArcherPosition.point);

                // console.log("\n\n\ this.getDistanceBetweenUnits(this.unit, enemie) ", this.getDistanceBetweenUnits(this.unit, enemie).toFixed(0), enemie)

                if (Number.parseInt(this.getDistanceBetweenUnits(this.unit, enemie).toFixed(0)) <= 1) {

                    this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
                }

                // запуск анимации атаки
            } else {
                res = this.moveCarefully(this.unit, enemie, "fighter", cache_unit);

                if (res.findEnime == true) {


                    attakedEnemie = res.enemie;
                    // запуск анимации атаки
                    this.view.contactPersonsView(res.enemie.domPerson, res.enemie.image, this.unit.person.damage);
                    // console.log(" this.global_cache ", this.global_cache);

                    // только если олучник стреляет сделать то бишь на позиции


                    // console.log(res.enemie, this.view);


                }

            }
            this.unit.setMoveAction(false);

            setTimeout(() => { resolve("Promise3") }, 320);

        });
    }
    findEnemieForAtake(enemie) {
        // !!! можно тут прописать на проверку более круттого выбора кого бить
        // this.unit_collection.getCollection().forEach((element) => {
        // }
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
