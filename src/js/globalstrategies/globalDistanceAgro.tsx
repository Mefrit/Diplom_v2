import { DefaultGlobalMethodsStrategey } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class DistanceAgro extends DefaultGlobalMethodsStrategey {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {
        // console.log("DistanceAgro", props);
        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
    }
    assessment(cache) {

        var result = 1100, enemies;
        this.ai_units.forEach(elem => {
            if (elem.person.health > 30) {
                result += 300;
            }
            if (elem.person.health > 20 && elem.person.health < 30) {
                result += 100;
            }
        });

        // if (!cache.enemies_near_3) {
        //     enemies = this.getEnemyInField({ x: this.unit.x, y: this.unit.y }, 3);
        //     cache.enemies_near_3 = enemies;
        // } else {
        //     enemies = cache.enemies_near_3;
        // }
        enemies = this.unit_collection.getUserCollection();
        enemies.forEach(elem => {
            if (elem.person.health < 30) {
                result += 300;
            }
            // if (elem.person.health > 20 && elem.person.health < 30) {
            //     result += 100;
            // }
        });
        // if (enemies.length == 0) {
        //     result += 300;
        // } else {
        //     result -= 1000 / enemies.length;
        // }
        // console.log("!!!!!!!!!!\n\n\n enemies in fields AtackTheArcher", enemies);
        // enemies.forEach(elem => {
        //     result -= elem.health * 5
        // });
        // console.log("!!!!!!!!!!\n\n\n enemies in fields", enemies);
        // чем больше. тем лучше будет считаьься стратегия
        return { total: Math.round(result), cache: cache };
        // return Math.floor(Math.random() * Math.floor(100));
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
        if (cache_enemies.length > 0) {
            best_enemie = this.getBestEnemie(cache_enemies, unit);
        } else {
            best_enemie = this.findNearestEnemies(unit);
        }
        var ChoosenStrategy;
        // сделать так , что бы двигались в сторону ближайших игроков
        if (cache_unit[index].person.class == "fighter") {
            ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "SecurityArcher");
        } else {
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");
        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit
        });
        if (cache_unit[index].person.class == "fighter") {
            ai.start(cache_unit).then(() => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });
        } else {
            ai.atackeChosenUnit(cache_unit, best_enemie).then((data) => {
                if (index < cache_unit.length - 1) {
                    this.startMove(cache_unit, index + 1);
                }

            });

        }
    }
    start(cache) {
        this.startMove(this.ai_units, 0);
        // console.log("start Distance", cache);
    }
}