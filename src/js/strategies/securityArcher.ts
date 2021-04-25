
import { DefaultMethodsStrategey } from "../lib/defaultMethods";

export class SecurityArcher extends DefaultMethodsStrategey {
    constructor(props: any) {
        super(props);
        // console.log("\n angry", props);

        this.unit = props.unit;
        // this.coordsEvil = { x: props.result.x, y: props.result.y };
    }
    // оценка ситуации
    // при оценке учитывать, что хотябы 1н лучник жив, чем больше лучников живо, 
    // тем выше приоритет стратегии
    getInfo() {
        return "SecurityArcher";
    }
    assessment(cache) {

        var result = 1000, enemies;
        if (this.unit.health < 30) {
            result += 200;
        }
        if (this.unit.health < 20) {
            result += 300;
        }
        if (!cache.enemies_near_3) {
            enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);

            cache.enemies_near_3 = enemies;
        } else {
            enemies = cache.enemies_near_3;
        }

        if (enemies.length == 0) {
            result += 300;
        } else {
            result -= 1000 / enemies.length;
        }
        // console.log("!!!!!!!!!!\n\n\n enemies in fields AtackTheArcher", enemies);
        // enemies.forEach(elem => {
        //     result -= elem.health * 5
        // });
        // console.log("!!!!!!!!!!\n\n\n enemies in fields", enemies);
        // чем больше. тем лучше будет считаьься стратегия
        return { total: Math.round(result), cache: cache };
        // return Math.floor(Math.random() * Math.floor(100));
    }


    start(cache) {
        return new Promise((resolve, reject) => {
            var near_archers = this.unit_collection.getAiArchers(),
                near_enemy = this.findNearestEnemies(this.unit);
            var near_archer = this.findNearestArchers(this.unit);
            var pos_security = {};
            // if (near_enemy.y >= this.unit.y) {
            // if (this.unit.y + 1 < 5 ) {
            pos_security.y = near_archer.y;

            if (Math.abs(this.unit.x - near_archer.x) != 0 || Math.abs(this.unit.y - near_archer.y) != 0) {
                // console.log("near_archer=> ", near_archer, Math.abs(this.unit.x - near_archer.x) != 0, "||", Math.abs(this.unit.y - near_archer.y) != 0);

                // if (this.unit.x + 1 < 11) {
                //     pos_security.x = near_archer.x + 1;
                // } else {
                pos_security.x = near_archer.x - 1;
                // }
                if (this.unit_collection.checkFreeCoord({ x: pos_security.x, y: near_archer.y })) {
                    pos_security.y = near_archer.y;
                } else {
                    // что бы они не были все в нижней части 
                    if (this.unit.y + 1 < 7 && this.randomInteger(-2, 1) > 0) {
                        if (this.unit.y > pos_security.y) {
                            pos_security.y = near_archer.y + 1;
                        }
                    } else {
                        if (this.unit.y < pos_security.y) {
                            pos_security.y = near_archer.y - 1;
                        }
                    }
                }

                // }
                console.log("pos_security => ", pos_security);
                var res = this.moveAutoStepStupid(this.unit, pos_security, "fighter");
                if (res.findEnime == true) {
                    //атака , если лучник не далеко

                    // console.log("\n\n", Math.abs(this.unit.x - near_archer.x), this.unit);
                    if (Math.abs(this.unit.x - near_enemy.x) == 1) {
                        // запуск анимации атаки   
                        this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, this.unit.person.damage);

                        var checkArcherPosition = this.checkArcherPosition(near_enemy);
                        // только если олучник стреляет сделать то бишь на позиции
                        if (checkArcherPosition.result && !this.unit.moveAction) {
                            // console.log("checkArcherPosition", checkArcherPosition);
                            this.moveAutoStepStupid(this.unit, checkArcherPosition.point, "fighter");
                        }
                    } else {
                        // догоняем лучника
                        // this.moveAutoStepStupid(this.unit, pos_security, "fighter");
                    }

                }
            }

            setTimeout(() => { resolve("Promise2") }, 320);

        });
        // this.findNearestEnemies(this.unit)
        // мы нашли ближайшего врага и лучника, следует двигаться к позиции стрельбы лучника, 
        // либо, как можно ближе к лучнику, что бы его защитить
        // console.log("get Nearest res=> ", res);
    }
}