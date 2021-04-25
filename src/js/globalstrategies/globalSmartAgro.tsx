import { DefaultGlobalMethodsStrategey } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI } from "../strategies/cacheFighterStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class SmartAgro extends DefaultGlobalMethodsStrategey {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {
        console.log("SmartAgro", props);
        super(props);
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
    }
    assessment(cache) {
        // FIX ME возможно стоит завести 2 поля, самый слабый по здорровью юнит или вдруг, самый отдаленный от корешей
        // var result = 1000, enemies, damaged_person = {}, min_health = 200;
        // if (this.unit.health < 30) {
        //     result -= 400;
        // }
        // if (this.unit.health < 20) {
        //     result -= 700;
        // }
        // if (!cache.enemies_near_3) {
        //     enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
        //     cache.enemies_near_3 = enemies
        // } else {
        //     enemies = cache.enemies_near_3;
        // }
        // if (enemies.length == 0) {
        //     result -= 500;
        //     damaged_person = {};
        // } else {
        //     damaged_person = enemies[0];
        //     min_health = damaged_person.person.health
        //     result += 1000 / enemies.length;
        // }
        // // min_health = 150;
        // // как вариант выбирать еще и самого дальнего
        // enemies.forEach(elem => {
        //     // console.log(elem);
        //     if (elem.person.health < min_health) {
        //         damaged_person = elem;
        //     }
        //     result -= elem.person.health * 5;
        // });
        // cache.most_damaged_person_3 = damaged_person;
        // console.log("!!!!!!!!!!\n\n\n enemies in fields FightIfYouCan", enemies, "damaged", damaged_person);
        // return { total: Math.round(result), cache: cache };
        return { total: Math.round(1000), cache: cache };
    }

    start(cache) {
        console.log("SmartAgro start", cache);
        this.ai_units = this.sortArchersFirst(this.ai_units); \
        var cache_enemies = [], best_enemie = {}, distance_best = 0;
        // console.log(this.ai_units);
        this.ai_units.map(unit => {
            // console.log("findNearestArchers ", this.getEnemyInField({
            //     x: unit.person.x,
            //     y: unit.person.y
            // }, 4));
            console.log(unit);
            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 4);
            // сделать так , что бы двигались в сторону ближайших игроков
            best_enemie = cache_enemies[0];
            cache_enemies.forEach(elem => {
                distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
                if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                    best_enemie = elem;
                }
            });


            var FightIfYouCan = this.getStrategyByName(cacheFighterAI, FightIfYouCan);
            var ai = new FightIfYouCan({
                scene: this.scene,
                view: this.view,
                unit_collection: this.unit_collection
            });
            ai.atackeChosenUnit(cache, best_enemie);
            console.log("\cacheFighterAI", FightIfYouCan);
        });

        // this.checkConnection();
        // var unit = cacheAi[index];
        // this.view.showCurentUnit(unit.domPerson);
        // var best_ai;
        // unit.moveAction = false;

        // if (unit.person.class == "fighter") {
        //     best_ai = this.choseStrategy(cacheFighterAI, unit);
        //     best_ai.start(this.CACHE).then(res => {
        //         // alert(res);

        //         this.view.disableCurentUnit(unit.domPerson);
        //         if (index < cacheAi.length - 1) {
        //             index++;
        //             this.stepAi(cacheAi, index);
        //         }
        //     });

        // } else {
        //     best_ai = new AtackTheArcher({
        //         unit: unit,
        //         scene: this.scene,
        //         unit_collection: this.unit_collection,
        //         view: this.view
        //     });
        //     best_ai.start().then(res => {

        //         this.view.disableCurentUnit(unit.domPerson);

        //         if (index < cacheAi.length - 1) {
        //             index++;
        //             this.stepAi(cacheAi, index);
        //         }
        //     });
        // }
    }
}