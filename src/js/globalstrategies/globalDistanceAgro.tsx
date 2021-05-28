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

        let result = 1000, enemies, enemies_near_6, enemies_near_3, best_enemie, cache_enemies;
        this.ai_units.forEach(curent_unit => {
            if (curent_unit.person.health > 30) {
                result += 300;
            }
            if (curent_unit.person.health > 20 && curent_unit.person.health < 30) {
                result += 100;
            }
            enemies_near_6 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
            enemies_near_6.forEach(enemie => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result -= 300;
                } else {
                    result -= 500;
                }
                if (curent_unit.person.class == "archer") {
                    result += 12 * enemie.person.health;
                } else {
                    result += 10 * enemie.person.health;
                }
            });



            if (curent_unit.isArchers()) {

                cache_enemies = enemies_near_6;

                if (cache_enemies.length > 0) {
                    console.log("cache_enemies ======>>>>>>>1", cache_enemies, JSON.stringify(cache.units_purpose));
                    cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);

                    console.log("cache_enemies ======>>>>>>>2", JSON.stringify(cache_enemies.length), cache_enemies, cache.units_purpose, curent_unit.domPerson);
                    if (cache_enemies.length > 0) {

                        best_enemie = this.getBestEnemie(cache_enemies, curent_unit);

                    } else {

                        best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
                    }

                } else {
                    best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
                }
                console.log("cache_enemies best_enemie", best_enemie, curent_unit.person.id);
                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });


            } else {

                enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);
                if (enemies_near_3.length > 0) {
                    console.log("not ARcher ", this.getBestEnemie(enemies_near_3, curent_unit), curent_unit.person.id)
                    cache.units_purpose.push({ enemie: this.getBestEnemie(enemies_near_3, curent_unit), id: curent_unit.person.id });
                }
            }


        });
        // this.global_cache = cache;
        // enemies = this.unit_collection.getUserCollection();
        // enemies.forEach(elem => {
        //     if (elem.person.health < 30) {
        //         result += 300;
        //     }
        // });
        // enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);

        // if (enemies_near_3.length > 0) {
        //     cache.units_purpose.push({ enemie: this.getBestEnemie(enemies_near_3, curent_unit), id: curent_unit.person.id });
        // }

        return { total: Math.round(result), cache: cache };
    }
    createMytantStrategy() {

    }

    startMove(cache_unit, index) {
        let unit = cache_unit[index];
        let cache_enemies = [], best_enemie: any;
        best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
        if (!best_enemie) {
            cache_enemies = this.getEnemyInField({
                x: unit.person.x,
                y: unit.person.y
            }, 4);


            if (unit.person.class != "fighter") {
                cache_enemies = this.deleteBusyEnemies(cache_enemies, this.global_cache.units_purpose);
            }

            if (cache_enemies.length > 0) {

                best_enemie = this.getBestEnemie(cache_enemies, unit);
            } else {
                best_enemie = this.findNearestEnemies(unit, this.global_cache.units_purpose);
                best_enemie = best_enemie.enemie;

            }
        } else {
            best_enemie = best_enemie.enemie;
        }

        var ChoosenStrategy;

        // сделать так , что бы двигались в сторону ближайших игроков
        if (unit.person.class == "fighter") {
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
        if (unit.person.class == "fighter") {
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