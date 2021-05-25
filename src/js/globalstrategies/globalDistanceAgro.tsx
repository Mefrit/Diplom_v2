import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class DistanceAgro extends DefaultGlobalMethodsStrategy {
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
        this.global_cache = {};
    }
    assessment(cache) {
        // тут нужно выбрать кто куда будет ходить
        var result = 1100, enemies;
        this.ai_units.forEach(elem => {
            if (elem.person.health > 30) {
                result += 300;
            }
            if (elem.person.health > 20 && elem.person.health < 30) {
                result += 100;
            }
        });
        this.global_cache = cache;
        enemies = this.unit_collection.getUserCollection();
        enemies.forEach(elem => {
            if (elem.person.health < 30) {
                result += 300;
            }
        });

        // чем больше. тем лучше будет считаьься стратегия
        return { total: Math.round(result), cache: cache };
    }
    createMytantStrategy() {

    }

    startMove(cache_unit, index) {
        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie = {};
        cache_enemies = this.getEnemyInField({
            x: unit.person.x,
            y: unit.person.y
        }, 4);

        cache_enemies = this.deleteBusyEnemies(cache_enemies, this.global_cache.units_purpose);
        console.log("cache_enemies", cache_enemies, this.global_cache.units_purpose);
        if (cache_enemies.length > 0) {

            best_enemie = this.getBestEnemie(cache_enemies, unit);
        } else {
            best_enemie = this.findNearestEnemies(unit, this.global_cache.units_purpose);
        }
        // if (this.unit_collection.getUserCollection().length > 1) {

        //     this.global_cache.units_purpose.push({ enemie: best_enemie, id: unit.person.id });

        // } else {
        //     // атаковать по другой траектории
        // }

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
        this.global_cache = cache;
        this.startMove(this.ai_units, 0);
    }
}