import { DefaultMethodsStrategey } from "../lib/defaultMethods";
export class AtackTheArcher extends DefaultMethodsStrategey {
    unit: any;
    coordsEvil: any;
    view: any
    constructor(props: any) {
        super(props);
        this.unit = props.unit;

    }
    getInfo() {
        return "AtackTheArcher";
    }
    assessment(cache_assessment) {
        // start point
        var result = 1000, enemies;

        if (!cache_assessment.enemies_near_5) {
            enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 5);
            cache_assessment.enemies_near_5 = enemies
        }


        if (enemies.length == 0) {
            result -= 500;
        } else {
            result += 1000 / enemies.length;
        }
        enemies.forEach(elem => {
            result -= elem.health * 5
        });

        return { total: result, cache: cache_assessment };
    }
    checkFreeWay2Atack(enemie, direction) {
        let arrayPoit = [], sgn = enemie[direction] < this.unit[direction] ? -1 : 1, tmp, res = { free: false, arrayPoit: [], direction: direction, runAway: false }, coefI;
        tmp = Math.abs(enemie[direction] - this.unit[direction]);
        if (tmp <= 4) {
            coefI = tmp;
        } else {
            // coefI = 4;
            return res;
            // coefI = Math.abs(enemie[direction] + 4);
        }
        // console.log("coefI", coefI, "direction", direction, enemie[direction], "-", this.unit[direction]);
        for (let i = 1; i <= coefI; i++) {
            if (arrayPoit.length < 6) {
                tmp = direction == "x" ? { x: enemie.x - sgn * i, y: enemie.y } : { x: enemie.x, y: enemie.y - sgn * i };

                if (tmp.x >= 0 && tmp.y >= 0) {
                    if (tmp.x != this.unit.x && tmp.y != this.unit.y) {

                        arrayPoit.push(tmp);
                    }
                }

            } else {
                break;
            }
        }
        tmp = this.checkFreePointsArcher(arrayPoit, "archer");
        res.free = tmp.free
        if (tmp.deleteLastPoint) {
            arrayPoit.splice(arrayPoit.length - 1, 1);
        }
        res.arrayPoit = arrayPoit;

        return res;
    }
    atakeArcher(enemie) {
        this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
    }
    tryAtakeArcher(resCheck, enemie) {
        let pointPosition, xLineCondition, yLineCondition, res = { pointPosition: [], result: true }
        if (resCheck.arrayPoit.length > 0) {
            pointPosition = resCheck.arrayPoit[resCheck.arrayPoit.length - 1];
            res.pointPosition = pointPosition;

            xLineCondition = enemie.x == this.unit.x && pointPosition.x == this.unit.x;
            yLineCondition = enemie.y == this.unit.y && pointPosition.y == this.unit.y;
        } else {
            xLineCondition = false;
            yLineCondition = false;
        }
        if (yLineCondition || xLineCondition || resCheck.arrayPoit.length == 0) {
            // console.log("Math.abs(this.unit.x - enemie.x)", Math.abs(this.unit.x - enemie.x), Math.abs(this.unit.x - enemie.x) < 5);
            if (Math.abs(this.unit.x - enemie.x) < 6) {
                if (Math.abs(this.unit.x - enemie.x) < 3 && !this.unit.moveAction) {

                    this.moveAutoStepStupid(this.unit, enemie, "archer");
                } else
                    if (Math.abs(this.unit.y - enemie.y) < 2 && this.unit.y != enemie.y && !this.unit.moveAction) {
                        this.moveAutoStepStupid(this.unit, enemie, "archer");
                    }
                this.atakeArcher(enemie);
            } else {
                console.log("\n\n FIX ME!!! moveAutoStepStupid pointPosition", pointPosition)
                // this.moveAutoStepStupid(this.unit, pointPosition, "archer");
            }

            // проверка на тикать от сюда

        } else { res.result = false }
        // console.log("tryAtakeArcherRes", res);
        return res;
    }
    //если на лучника атакуют, то он убегает
    runAwayArcher() {
        if (this.unit.x < 8) {
            this.moveAutoStepStupid(this.unit, { x: this.unit.x + 1, y: this.unit.y }, "archer");
        }
    }
    got2AttackePosition(enemie) {
        // console.log(" moveAutoStepStupid got2AttackePosition", enemie);
        this.moveAutoStepStupid(this.unit, { x: enemie.x, y: enemie.y }, "archer");
    }
    findPointAtackArcher(enemie) {
        let maxX = Math.abs(enemie.person.x - this.unit.person.x),
            maxY = Math.abs(enemie.person.y - this.unit.person.y), resCheck, res;

        if (maxY > maxX) {
            resCheck = this.checkFreeWay2Atack(enemie, "y");
            if (!resCheck.free) {
                // resCheck = this.checkFreeWay2Atack(enemie, "x");
            }
        } else {
            resCheck = this.checkFreeWay2Atack(enemie, "x");
            if (!resCheck.free) {
                // resCheck = this.checkFreeWay2Atack(enemie, "y");
            }
        }
        // console.log(resCheck.free);
        if (resCheck.free) {

            res = this.tryAtakeArcher(resCheck, enemie);
            if (!res.result) {

                this.moveAutoStepStupid(this.unit, enemie, "archer");
                this.tryAtakeArcher(resCheck, enemie);
            }
        } else {
            this.got2AttackePosition(enemie);
        }
    }
    start(cache) {
        return new Promise((resolve, reject) => {

            let enemie = this.findNearestEnemies(this.unit);
            this.findPointAtackArcher(enemie);

            setTimeout(() => { resolve("Promise") }, 320);

        });
    }
}