import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy"
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class DistanceAgro extends DefaultGlobalMethodsStrategy {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {

        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = props.ai_units;
        this.scene = props.scene;
        this.view = props.view;
        this.global_cache = {};
    }
    assessment(cache) {
        // тут нужно выбрать кто куда будет ходить
        let result = 1000, cache_died = [], enemies_near_4, fighter_first = false, enemies_near_3, best_enemie, cache_enemies, first_archer, enemie_first_archer = undefined;
        // ввести кеш, тех мест где приблизительно будут находиться друзья,
        // ..когда пойжут мочить врагов
        // надо что бы они вместе длержались, те выбор врагов и напрввление удара по количеству союзников рядом

        this.ai_units.forEach(curent_unit => {
            if (curent_unit.person.health < 30) {
                result -= 400;
            }
            if (curent_unit.person.health < 20) {
                result -= 700;
            }
            result -= (5 - this.unit_collection.getCountEnemy()) * 300;
            enemies_near_4 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 6);
            enemies_near_4.forEach(enemie => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result += 500;
                } else {
                    result += 300;
                }
                if (curent_unit.person.class == "archer") {
                    result += 12 * Math.abs(70 - enemie.person.health);
                } else {
                    result += 10 * Math.abs(100 - enemie.person.health);
                }
            });
            enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);

            if (curent_unit.isArchers()) {
                cache_enemies = this.getEnemyInField({
                    x: curent_unit.person.x,
                    y: curent_unit.person.y
                }, 8);

                if (cache_enemies.length > 0) {

                    // вопрос, когда лучше удалять этих чуваков?
                    if (enemie_first_archer) {
                        if (this.getEnemyInField(enemie_first_archer, 2).length > 1 &&
                            (Math.abs(first_archer.x - curent_unit.x) < 2 ||
                                Math.abs(first_archer.y - curent_unit.y) < 2)) {
                            // console.log("deleteEqualEnemyFromCache", curent_unit, this.getEnemyInField(enemie_first_archer, 2));
                            cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);
                        }
                    }
                    // cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);

                    cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache_died);
                    if (cache_enemies.length > 0) {
                        best_enemie = this.getBestEnemie(cache_enemies, curent_unit);
                    } else {
                        best_enemie = this.findNearestEnemies(curent_unit);
                    }
                } else {
                    best_enemie = this.findNearestEnemies(curent_unit);
                }
                // console.log("countEnemyWnenMoveToEnemy => ", this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie));
                result -= 200 * this.countEnemyWnenMoveToEnemy(curent_unit, best_enemie);

                if (curent_unit.person.damage >= (best_enemie.person.health - 5) && this.getDistanceBetweenUnits(curent_unit, best_enemie) < 7) {
                    cache_died.push(best_enemie);
                }
                first_archer = curent_unit;
                enemie_first_archer = best_enemie;
                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
            } else {
                result -= 300 * enemies_near_3.length
                result += 10 * (100 - parseInt(curent_unit.person.health));
            }

        });
        result += 10 * (5 - this.ai_units.length);
        result -= 15 * (5 - this.unit_collection.getUserCollection().length);
        result -= (2 - this.unit_collection.getAiArchers().length) * 1000;
        console.log("Distance Agro", Math.round(result), cache);
        return { total: Math.round(result), cache: cache };
    }
    createMytantStrategy() {

    }
    choseTurnUnits(ai_units) {
        let friends, reverse = false, enemies;
        ai_units.forEach((element) => {
            if (this.isArchers(element)) {
                friends = this.getFriendsInField(element, 2);
                if (friends.length == 0) {
                    reverse = true;
                }


            }
        });

        return reverse ? [...ai_units].reverse() : ai_units;
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
            unit: unit,
            parent_strategy: "distanceAgro"
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
        this.ai_units = this.sortArchersFirst(this.ai_units);
        this.ai_units = this.choseTurnUnits(this.ai_units);
        this.startMove(this.ai_units, 0);
    }
}