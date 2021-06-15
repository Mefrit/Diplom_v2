import { DefaultMethodsStrategy } from "../lib/defaultMethods";
export class AtackTheArcher extends DefaultMethodsStrategy {
    unit: any;
    coordsEvil: any;
    view: any;
    last_enemie: any;
    parent_strategy: string;
    constructor(props: any) {
        super(props);
        this.unit = props.unit;
        this.last_enemie;

        this.parent_strategy = props.hasOwnProperty("parent_strategy") ? props.parent_strategy : "default";
        // console.log("props", props, this.parent_strategy);
    }
    getInfo() {
        return "AtackTheArcher";
    }
    assessment(cache_assessment) {
        // start point
        var result = 1000,
            enemies;

        if (!cache_assessment.enemies_near_5) {
            enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 5);
            cache_assessment.enemies_near_5 = enemies;
        }

        if (enemies.length == 0) {
            result -= 500;
        } else {
            result += 1000 / enemies.length;
        }
        enemies.forEach((elem) => {
            result -= elem.health * 5;
        });

        return { total: result, cache: cache_assessment };
    }

    atakeArcher(enemie) {
        this.unit.stopAnimation("default_archer");
        this.unit.playAnimation("atacke_archer");

        // animation.stop();
        setTimeout(() => {
            this.unit.stopAnimation("atacke_archer");
            this.unit.playAnimation("default_archer");
        }, 800);
        this.view.contactPersonsView(enemie.domPerson, enemie.image, this.unit.person.damage);
    }
    tryAtakeArcher(resCheck, enemie) {
        let pointPosition,
            xLineCondition,
            yLineCondition,
            res = { pointPosition: [], result: true };
        if (resCheck.arrayPoit.length > 0) {
            pointPosition = resCheck.arrayPoit[resCheck.arrayPoit.length - 1];
            res.pointPosition = pointPosition;
            // враги на линии
            xLineCondition = enemie.x == this.unit.x && pointPosition.x == this.unit.x;
            yLineCondition = enemie.y == this.unit.y && pointPosition.y == this.unit.y;
        } else {
            xLineCondition = false;
            yLineCondition = false;
        }
        // console.log(yLineCondition, "||", xLineCondition, "||", resCheck.arrayPoit.length);
        if (yLineCondition || xLineCondition || resCheck.arrayPoit.length == 0) {
            // console.log(Math.abs(this.unit.x - enemie.x), Math.abs(this.unit.y - enemie.y));
            if (Math.abs(this.unit.x - enemie.x) >= Math.abs(this.unit.y - enemie.y)) {
                // поиск атаки по горизонтале
                if (Math.abs(this.unit.x - enemie.x) < 3 && !this.unit.moveAction) {
                    this.moveAutoStepStupid(this.unit, enemie, "archer");
                } else {
                    // if (Math.abs(this.unit.y - enemie.y) < 3 && this.unit.y != enemie.y && !this.unit.moveAction) {
                    if (Math.abs(this.unit.y - enemie.y) < 3 && this.unit.y != enemie.y && !this.unit.moveAction) {
                        this.moveAutoStepStupid(this.unit, enemie, "archer");
                    }
                }
                if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                    this.atakeArcher(enemie);
                } else {
                    res.result = false;
                }
            } else {
                // поиск атаки по вертикали
                let new_x, new_y;
                if (!this.unit.moveAction) {
                    if (enemie.person.y < 3) {
                        this.moveCarefully(this.unit, { x: enemie.person.x, y: 8 }, "fighter", {});
                    } else {
                        this.moveCarefully(this.unit, { x: enemie.person.x, y: 0 }, "fighter", {});
                    }
                }
                if (enemie.x == this.unit.x || enemie.y == this.unit.y) {
                    this.atakeArcher(enemie);
                } else {
                    res.result = false;
                }
            }
            // проверка на тикать от сюда
        } else {
            res.result = false;
        }
        return res;
    }
    //если на лучника атакуют, то он убегает
    runAwayArcher() {
        if (this.unit.x < 11) {
            this.moveAutoStepStupid(this.unit, { x: this.unit.x + 1, y: this.unit.y }, "archer");
        }
    }
    got2AttackePosition(enemie) {
        if (this.parent_strategy == "UndercoverArcherAttack") {
            return this.moveAutoStepStupid(
                this.unit,
                this.getCoordForAtackeForrwarArcher(this.unit, enemie, "StayForwardArcher"),
                "fighter"
            );
        }

        let res = this.checkFreeWay2Atack(enemie, this.unit, "x");

        let coord = this.getCoordForAtacke(this.unit, enemie, "default", res.free);
        if (res.free) {
            return this.moveAutoStepStupid(this.unit, coord, "archer");
        } else {
            return this.moveAutoStepStupid(this.unit, coord, "fighter");
        }
    }
    findPointAtackArcher(enemie) {
        let maxX = Math.abs(enemie.person.x - this.unit.person.x),
            maxY = Math.abs(enemie.person.y - this.unit.person.y),
            resCheck,
            res;
        if (maxY > maxX) {
            resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
        } else {
            resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
        }

        if (resCheck.free) {
            res = this.tryAtakeArcher(resCheck, enemie);
            if (!res.result) {
                this.moveCarefully(this.unit, enemie, "archer", {});
                maxX = Math.abs(enemie.person.x - this.unit.person.x);
                maxY = Math.abs(enemie.person.y - this.unit.person.y);

                if (maxY > maxX) {
                    resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
                } else {
                    resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
                }
                if (resCheck.free) {
                    this.tryAtakeArcher(resCheck, enemie);
                }
            }
        } else {
            this.got2AttackePosition(enemie);
            maxX = Math.abs(enemie.person.x - this.unit.person.x);
            maxY = Math.abs(enemie.person.y - this.unit.person.y);

            if (maxY > maxX) {
                resCheck = this.checkFreeWay2Atack(enemie, this.unit, "y");
            } else {
                resCheck = this.checkFreeWay2Atack(enemie, this.unit, "x");
            }
            if (resCheck.free) {
                this.tryAtakeArcher(resCheck, enemie);
            }
        }
    }
    start(cache) {
        return new Promise((resolve, reject) => {
            let enemie = this.findNearestEnemies(this.unit);
            this.last_enemie = enemie;

            this.findPointAtackArcher(enemie);

            setTimeout(() => {
                resolve("Promise");
            }, 520);
        });
    }
    atackeChosenUnit(cache, enemie) {
        return new Promise((resolve, reject) => {
            if (enemie.isNotDied()) {
                enemie = this.findNearestEnemies(this.unit);
            }
            this.findPointAtackArcher(enemie);
            setTimeout(() => {
                resolve("Promise5");
            }, 120);
        });
    }
}
