import { DefaultMethodsStrategy } from "../lib/defaultMethods";

export class SecurityArcher extends DefaultMethodsStrategy {
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

    start(cache, near_enemy = undefined) {
        return new Promise((resolve, reject) => {
            var near_archer = this.findNearestArchers(this.unit);
            var pos_security: any = {};
            var near_enemies = [],
                atake = false;
            // console.log(
            //     "getFriendsInField",
            //     this.getFriendsInField(near_archer, 2),
            //     near_archer,
            //     this.getFriendsInField(near_archer, 2) >= 3
            // );
            if (typeof near_enemy == "undefined") {
                near_enemy = this.findNearestEnemies(this.unit);
            }

            if (Math.abs(this.unit.x - near_enemy.x) <= 1 && Math.abs(this.unit.y - near_enemy.y) <= 1) {
                // запуск анимации атаки
                this.unit.stopAnimation("default_fighter");
                this.unit.playAnimation("atacke_fighter");
                atake = true;
                // animation.stop();
                setTimeout(() => {
                    this.unit.stopAnimation("atacke_fighter");
                    this.unit.playAnimation("default_fighter");
                }, 750);
                this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, this.unit.person.damage);

                // только если олучник стреляет сделать то бишь на позиции
            } else {
                let local_near_enemy = this.findNearestEnemies(this.unit);
                if (
                    Math.abs(this.unit.x - local_near_enemy.x) <= 1 &&
                    Math.abs(this.unit.y - local_near_enemy.y) <= 1
                ) {
                    // запуск анимации атаки
                    this.unit.stopAnimation("default_fighter");
                    this.unit.playAnimation("atacke_fighter");
                    atake = true;
                    // animation.stop();
                    setTimeout(() => {
                        this.unit.stopAnimation("atacke_fighter");
                        this.unit.playAnimation("default_fighter");
                    }, 750);
                    this.view.contactPersonsView(
                        local_near_enemy.domPerson,
                        local_near_enemy.image,
                        this.unit.person.damage
                    );

                    // только если олучник стреляет сделать то бишь на позиции
                }
            }

            let ai_archers = this.unit_collection.getAiArchers(),
                end = false;
            if (ai_archers.length > 1) {
                ai_archers.forEach((elem) => {
                    // if (near_archer.person.id != elem.person.id && !end) {
                    //     console.log("change!!!!!!", near_archer, elem);
                    //     near_archer = elem;

                    //     end = true;
                    // }
                    if (this.getFriendsInField(elem, 2).length == 0 && !end) {
                        near_archer = elem;
                        end = true;
                    }
                });
            }
            near_enemies = this.getEnemyInField(near_archer, 6);
            // if (near_enemies.length == 0) {
            //     pos_security.x = near_archer.x - 1;
            // } else {
            //     let nearest_enemy = this.findNearestEnemies(near_archer);
            //     console.log("nearest_enemy", nearest_enemy, near_archer);
            //     if (nearest_enemy.x > near_archer.x) {
            //         pos_security.x = near_archer.x + 1;
            //     } else {
            //         pos_security.x = near_archer.x - 1;
            //         // pos_security.x = near_archer.x;
            //     }
            // }
            let nearest_enemy = this.findNearestEnemies(near_archer);
            // console.log("nearest_enemy", nearest_enemy, near_archer);
            if (nearest_enemy.x > near_archer.x) {
                pos_security.x = near_archer.x + 1;
            } else {
                pos_security.x = near_archer.x - 1;
                // pos_security.x = near_archer.x;
            }

            pos_security.y = near_archer.y;
            let wall_blocks = this.scene.get("wall_blocks"),
                water_blocks = this.scene.get("water_blocks");
            // if (Math.abs(this.unit.x - near_archer.x) != 0 || Math.abs(this.unit.y - near_archer.y) != 0) {
            near_enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 6);
            if (
                this.unit_collection.checkFreeCoord({ x: pos_security.x, y: near_archer.y + 1 }) &&
                !this.checkFreeCoordWalls(wall_blocks, { x: pos_security.x, y: near_archer.y + 1 }) &&
                !this.checkFreeCoordWalls(water_blocks, { x: pos_security.x, y: near_archer.y + 1 })
            ) {
                pos_security.y = near_archer.y + 1;
            } else {
                pos_security.y = near_archer.y - 1;
            }

            if (typeof near_enemy == "undefined" || atake) {
                near_enemy = this.findNearestEnemies(this.unit);
            }
            pos_security.near_archer = near_archer;
            console.log("pos_security", pos_security, near_archer.domPerson);
            var res = this.moveCarefully(this.unit, pos_security, "securityArcher");

            //атака , если лучник не далеко
            var checkArcherPosition = this.checkArcherPosition(near_enemy);

            if (Math.abs(this.unit.x - near_enemy.x) <= 1 && Math.abs(this.unit.y - near_enemy.y) <= 1 && !atake) {
                // запуск анимации атаки
                this.unit.stopAnimation("default_fighter");
                this.unit.playAnimation("atacke_fighter");

                // animation.stop();
                setTimeout(() => {
                    this.unit.stopAnimation("atacke_fighter");
                    this.unit.playAnimation("default_fighter");
                }, 750);
                this.view.contactPersonsView(near_enemy.domPerson, near_enemy.image, this.unit.person.damage);

                // только если олучник стреляет сделать то бишь на позиции
            } else {
                let local_near_enemy = this.findNearestEnemies(this.unit);
                if (
                    Math.abs(this.unit.x - local_near_enemy.x) <= 1 &&
                    Math.abs(this.unit.y - local_near_enemy.y) <= 1
                ) {
                    // запуск анимации атаки
                    this.unit.stopAnimation("default_fighter");
                    this.unit.playAnimation("atacke_fighter");
                    atake = true;
                    // animation.stop();
                    setTimeout(() => {
                        this.unit.stopAnimation("atacke_fighter");
                        this.unit.playAnimation("default_fighter");
                    }, 750);
                    this.view.contactPersonsView(
                        local_near_enemy.domPerson,
                        local_near_enemy.image,
                        this.unit.person.damage
                    );

                    // только если олучник стреляет сделать то бишь на позиции
                }
            }
            if (checkArcherPosition.result && !this.unit.moveAction) {
                // console.log("checkArcherPosition", checkArcherPosition);
                this.moveAutoStepStupid(this.unit, checkArcherPosition.point, "securityArcher");
            }
            // }

            if (this.checkFreeCoordWalls(this.unit_collection.getAICollection(), pos_security)) {
                pos_security.x = near_archer.x - 1;
            } else {
                pos_security.x = near_archer.x + 1;
            }

            this.unit.setMoveAction(false);
            setTimeout(() => {
                resolve("Promise2");
            }, 320);
        });
        // this.findNearestEnemies(this.unit)
        // мы нашли ближайшего врага и лучника, следует двигаться к позиции стрельбы лучника,
        // либо, как можно ближе к лучнику, что бы его защитить
        // console.log("get Nearest res=> ", res);
    }
}
