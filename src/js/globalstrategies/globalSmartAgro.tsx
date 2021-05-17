import { DefaultGlobalMethodsStrategey } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class SmartAgro extends DefaultGlobalMethodsStrategey {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {
        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
    }
    assessment(cache = {}) {
        var result = 1000, enemies, damaged_person = {}, min_health = 200;
        console.log("assessment SmartAgro", this.ai_units, cache)
        this.ai_units.forEach(elem => {
            if (elem.person.health < 30) {
                result -= 400;
            }
            if (elem.person.health < 20) {
                result -= 700;
            }
        });
        enemies = this.unit_collection.getUserCollection();
        enemies.forEach(elem => {
            if (elem.person.health > 30) {
                result -= 200;
            }
            if (elem.person.health < 30) {
                result += 400;
            }
            if (elem.person.health < 20) {
                result += 700;
            }
            // if (elem.person.health > 20 && elem.person.health < 30) {
            //     result += 100;
            // }
        });
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
        return { total: Math.round(result), cache: cache };
    }
    getBestEnemie(cache_enemies, unit) {
        var best_enemie = cache_enemies[0], distance_best = 0;
        cache_enemies.forEach(elem => {
            distance_best = Math.sqrt(best_enemie.x * unit.x + best_enemie.y * unit.y);
            if (Math.sqrt(elem.x * unit.x + elem.y * unit.y) < distance_best) {
                best_enemie = elem;
            }
        });
        return best_enemie;
    }
    startMove(cache_unit, index) {

        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie = {};

        cache_enemies = this.getEnemyInField({
            x: unit.person.x,
            y: unit.person.y
        }, 4);
        console.log("cache_enemies", cache_enemies, cache_unit[index]);

        if (cache_enemies.length > 0) {
            best_enemie = this.getBestEnemie(cache_enemies, unit);
        } else {
            best_enemie = this.findNearestEnemies(unit);
        }
        // сделать так , что бы двигались в сторону ближайших игроков

        // alert(cache_unit[index].person.type);


        if (cache_unit[index].person.class == "fighter") {
            const ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "FightIfYouCan");
        } else {
            const ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");

        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit
        });

        ai.atackeChosenUnit(cache_unit, best_enemie).then(() => {
            if (index < cache_unit.length - 1) {
                this.startMove(cache_unit, index + 1);
            }

        });
    }
    start(cache) {
        // console.log("SmartAgro start", cache, cacheFighterAI);
        this.ai_units = this.sortArchersFirst(this.ai_units);
        // var cache_enemies = [], best_enemie = {}, distance_best = 0;
        this.startMove(this.ai_units, 0);
        // console.log(this.ai_units);
        // this.ai_units.map(unit => {


        //     // console.log("\cacheFighterAI", FightIfYouCan);
        // });

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