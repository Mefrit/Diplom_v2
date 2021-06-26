// import { MoveRandomPerson } from "../strategies/move";

import { AtackTheArcher } from "../strategies/atackTheArcher";
// import { SecurityArcher } from "../strategies/sucurityArcher";

import { cacheGlobalAI } from "../strategies/cacheGlobalStrategy";
// FightIfYouCan
export class Ai {
    arrOwnPerson: any;
    arrAllPersons: any;
    unit_collection: any;
    syncUnit: any;
    cache_coord_bots: any;
    view: any;
    CACHE: any;
    // обьект для рендера элементов
    scene: any;
    constructor(arrAllPersons) {
        this.CACHE = this.initEmptyGlobalCache();
        this.scene = {};
        //тут храняться занятые координаты( то бишь, что бы не на 1 клетку ходили )\
        this.cache_coord_bots = [];
        this.syncUnit = function() {
            console.log("default");
        };
    }
    initEmptyGlobalCache() {
        return {
            units_purpose: [],
            most_damaged_person_3: {},
        };
    }
    initPersons = (unit_collection, syncUnit) => {
        this.unit_collection = unit_collection;
        this.syncUnit = syncUnit;
    };
    initView(view) {
        this.view = view;
    }
    initScene = (scene) => {
        this.scene = scene;
    };
    getCoord(coord) {
        return parseInt(coord.split("px")[0]);
    }
    randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    getUnitObj(id) {
        let unit,
            data = this.unit_collection.getCollection();

        for (let i = 0; i < data.length; i++) {
            if (data[i].person.id == id) {
                unit = data[i];
                break;
            }
        }
        return unit;
    }

    choseGlobalStr(ai_units) {
        // тут будет выбор между стратегиями
        // var global_strategy = new GlobalSTRMaxAgro({
        //     scene: this.scene,
        //     unit_collection: this.unit_collection,
        //     // view: this.view
        // });
        // return global_strategy;
        let tmp_ai: any = {},
            assessment,
            max = -1,
            best_ai = {};
        let result_assessment = cacheGlobalAI.map((AI) => {
            tmp_ai = new AI({
                scene: this.scene,
                ai_units: ai_units,
                view: this.view,
                unit_collection: this.unit_collection,
            });

            assessment = tmp_ai.assessment(this.CACHE);
            this.CACHE = assessment.cache;
            // console.log("ai ", tmp_ai.getInfo(), "total ", assessment.total);
            return { assessment: assessment.total, ai: tmp_ai };
        });
        console.log("-----------------");
        result_assessment.forEach((elem) => {
            if (max == -1) {
                max = elem.assessment;
                best_ai = elem.ai;
            }
            if (elem.assessment > max) {
                max = elem.assessment;
                best_ai = elem.ai;
            }
        });

        return best_ai;
    }

    stepAi(ai_units, index = 0) {
        // вообщем я сделал стратегии длоя 1го персонажа, теперь нужно сделать надстройку, которая будет управлять этими персонажами
        // ..сходили 1м чуваком, и нужно заного искать стратегию...
        // var global_strategy = this.choseGlobalStr();

        const best_strategy: any = this.choseGlobalStr(ai_units);
        best_strategy.start(this.CACHE);
    }
    choseTurnUnit(cacheAi) {
        return cacheAi.sort((prev, next) => {
            if (prev.person.class == "archer") {
                return -1;
            } else {
                return 1;
            }
        });
    }
    step = () => {
        let ai_units = this.unit_collection.getAICollection();

        // нужно решить в какой посследовательности следует ходить юнитам, давай пока сделаем рандомно
        // cacheAi = this.choseTurnUnit(cacheAi);
        this.stepAi(ai_units, 0);
        //очистка кеша
        this.CACHE = this.initEmptyGlobalCache();
        this.syncUnit(this.unit_collection);
    };
}
