import { DefaultMethodsStrategy } from "../lib/defaultMethods";
export class AtackTheArcher extends DefaultMethodsStrategy {
    unit: any;
    coordsEvil: any;
    view: any;
    last_enemie: any;
    parent_strategy: string;
    is_protect_strategy: boolean;
    constructor(props: any) {
        super(props);
        this.unit = props.unit;
        this.last_enemie;
        this.is_protect_strategy = false;
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

    //если на лучника атакуют, то он убегает
    runAwayArcher() {
        if (this.unit.x < 11) {
            this.moveAutoStepStupid(this.unit, { x: this.unit.x + 1, y: this.unit.y }, "archer");
        }
    }
    got2AttackePosition(enemie) {
        // console.log("got2AttackePosition", enemie.domPerson, this.unit.domPerson);
        if (enemie == undefined) {
            enemie = this.findNearestEnemies(this.unit);
        }
        if (this.parent_strategy == "UndercoverArcherAttack") {
            return this.moveAutoStepStupid(
                this.unit,
                this.getCoordForAtackeForrwarArcher(this.unit, enemie, "StayForwardArcher"),
                "fighter"
            );
        }
        let res = this.checkFreeWay2Atack(enemie, this.unit, "x"),
            coord;

        if (this.getDistanceBetweenUnits(enemie, this.unit) > 6) {
            return this.moveAutoStepStupid(this.unit, enemie, "archer");
        }
        coord = this.getCoordForAtacke(this.unit, enemie, "default", res.free);

        if (this.is_protect_strategy) {
            let near_friend = this.getNearFriendsUnit(this.unit, this.unit_collection.getAiArchers());
            if (this.getDistanceBetweenUnits(near_friend, coord) < 3) {
                return this.moveAutoStepStupid(this.unit, enemie, "archer");
            }
        }
        // console.log("coord11111111111111", coord);
        if (coord) {
            // return this.moveAutoStepStupid(this.unit, coord, "archer");
            // console.log("coord2", coord);
            if (
                this.getEnemyInField(coord, 3).length > 4 &&
                this.getFriendsInField(coord, 3).length < 2 &&
                this.unit_collection.getAICollection().length > 3
            ) {
                let near_friend = this.getNearFriendsUnit(this.unit, this.unit_collection.getAICollection()),
                    obj2go = { x: near_friend.x, y: near_friend.y };
                if (near_friend.x > 2) {
                    obj2go.x = near_friend.x - 2;
                    obj2go.y = near_friend.y;
                } else {
                    if (near_friend.y > 2) {
                        obj2go.y = near_friend.y - 2;
                        obj2go.x = near_friend.x;
                    }
                }
                // console.log("HERE STUPId");
                return this.moveAutoStepStupid(this.unit, obj2go, "fighter");
            }
            // if (this.getDistanceBetweenUnits(coord, this.unit) <= 1) {
            //     return this.moveAutoStepStupid(this.unit, enemie, "archer");
            // }
            // console.log("coord", coord);
            return this.moveAutoStepStupid(this.unit, coord, "stupid");
        } else {
            return this.moveAutoStepStupid(this.unit, enemie, "archer");
        }
    }
    findPointAtackArcher(enemie, is_protect_strategy = false) {
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
            this.got2AttackePosition(enemie);
            res = this.tryAtakeArcher(resCheck, enemie);
            if (!res.result) {
                // this.moveCarefully(this.unit, enemie, "archer", {});

                if (!this.unit.moveAction) {
                    this.got2AttackePosition(enemie);
                }
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
            if (!this.unit.moveAction) {
                this.got2AttackePosition(enemie);
            }
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
            this.unit.setMoveAction(false);
            setTimeout(() => {
                resolve("Promise");
            }, 520);
        });
    }
    atackeChosenUnit(cache, enemie, is_protect_strategy = false) {
        this.is_protect_strategy = is_protect_strategy;
        return new Promise((resolve, reject) => {
            if (enemie.isNotDied()) {
                enemie = this.findNearestEnemies(this.unit);
            }
            this.findPointAtackArcher(enemie, is_protect_strategy);
            this.unit.setMoveAction(false);
            setTimeout(() => {
                resolve("Promise5");
            }, 320);
        });
    }
}
