import { DefaultGlobalMethodsStrategy } from "../lib/defaultGlobalStrategiesMethods";
import { cacheFighterAI, cacheArcherAI } from "../strategies/cacheUnitSingleStrategy";
// import { } from "../strategies/"
//идея стратегия перегруппировки юнитов, юниты становятся ближе друг к другу и если это возможно - то атакуют
export class UndercoverArcherAttack extends DefaultGlobalMethodsStrategy {
    ai_units = []; // пулл оставшейся команды
    scene;
    view;
    constructor(props: any) {
        super(props);
        this.unit_collection = props.unit_collection;
        this.ai_units = this.choseTurnUnits(props.ai_units);

        this.scene = props.scene;
        this.view = props.view;
        this.global_cache = {};
    }
    choseTurnUnits(ai_units) {
        let res_1: any = { cache: [], have_archer: false },
            res_2: any = { cache: [], have_archer: false };

        ai_units.forEach((element) => {
            // console.log(element);
            if (this.isArchers(element)) {
                if (!res_1.have_archer) {
                    res_1.have_archer = true;
                    res_1.cache.push(element);
                } else {
                    res_2.have_archer = true;
                    res_2.cache.push(element);
                }
            } else {
                if (res_1.cache.length < 2) {
                    res_1.cache.push(element);
                } else {
                    res_2.cache.push(element);
                }
            }
        });

        return res_1.cache.concat(res_2.cache);
    }
    assessment(cache) {
        // тут нужно выбрать кто куда будет ходить
        let result = 1000,
            enemies,
            enemies_near_6,
            enemies_near_3,
            best_enemie,
            cache_enemies;
        this.ai_units.forEach((curent_unit) => {
            if (curent_unit.person.health > 30) {
                result += 300;
            }
            if (curent_unit.person.health > 20 && curent_unit.person.health < 30) {
                result += 100;
            }
            enemies_near_6 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 5);
            enemies = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 4);
            if (enemies_near_6.length > 0 && enemies.length == 0) {
                result += 500 * enemies_near_6.length;
            }

            enemies_near_6.forEach((enemie) => {
                // учет возможных атак
                if (enemie.person.class == "archer") {
                    result -= 300;
                } else {
                    result -= 500;
                }
                if (curent_unit.person.class == "archer") {
                    result += 5 * Math.abs(80 - enemie.person.health);
                } else {
                    result += 3 * Math.abs(80 - enemie.person.health);
                }
            });

            if (curent_unit.isArchers()) {
                cache_enemies = enemies_near_6;

                if (cache_enemies.length > 0) {
                    cache_enemies = this.deleteEqualEnemyFromCache(cache_enemies, cache.units_purpose);

                    if (cache_enemies.length > 0) {
                        best_enemie = this.getBestEnemie(cache_enemies, curent_unit);
                    } else {
                        best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
                        // какой то баг с этим свойством
                        if (best_enemie.hasOwnProperty("enemie")) {
                            best_enemie = best_enemie.enemie;
                        }
                    }
                } else {
                    best_enemie = this.findNearestEnemies(curent_unit, cache.units_purpose);
                    if (best_enemie.hasOwnProperty("enemie")) {
                        best_enemie = best_enemie.enemie;
                    }
                }

                cache.units_purpose.push({ enemie: best_enemie, id: curent_unit.person.id });
            } else {
                enemies_near_3 = this.getEnemyInField({ x: curent_unit.x, y: curent_unit.y }, 3);

                if (enemies_near_3.length > 0) {
                    cache.units_purpose.push({
                        enemie: this.getBestEnemie(enemies_near_3, curent_unit),
                        id: curent_unit.person.id,
                    });
                }
            }
        });
        console.log("UndercoverArcherAttack", Math.round(result));
        return { total: Math.round(result), cache: cache };
    }
    createMytantStrategy() {}

    startMove(cache_unit, index) {
        let unit = cache_unit[index];
        let cache_enemies = [],
            best_enemie: any;
        best_enemie = this.getEnemieFromCachePurpose(this.global_cache.units_purpose, unit.person.id);
        if (!best_enemie) {
            cache_enemies = this.getEnemyInField(
                {
                    x: unit.person.x,
                    y: unit.person.y,
                },
                4
            );

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
            ChoosenStrategy = this.getStrategyByName(cacheFighterAI, "StayForwardArcher");
        } else {
            ChoosenStrategy = this.getStrategyByName(cacheArcherAI, "AtackTheArcher");
        }
        var ai = new ChoosenStrategy({
            scene: this.scene,
            view: this.view,
            unit_collection: this.unit_collection,
            unit: unit,
            parent_strategy: "UndercoverArcherAttack",
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
