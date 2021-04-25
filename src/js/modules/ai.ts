// import { MoveRandomPerson } from "../strategies/move";

import { AtackTheArcher } from "../strategies/atackTheArcher";
// import { SecurityArcher } from "../strategies/sucurityArcher";

import { cacheGlobalAI } from "../strategies/cacheGlobalStrategy"
// FightIfYouCan
export class Ai {
    arrOwnPerson: any;
    arrAllPersons: any;
    unit_collection: any;
    syncUnit: any;
    cache_coord_bots: any;
    view: any;
    // обьект для рендера элементов
    scene: any;
    constructor(arrAllPersons) {
        this.CACHE = {};
        this.scene = {};
        //тут храняться занятые координаты( то бишь, что бы не на 1 клетку ходили )\
        this.cache_coord_bots = [];
        this.syncUnit = function () {
            console.log("default");
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
        console.log("initScene", scene);
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
    // //DELETE IT
    // changeLocation(element, x = -1, y = -1) {
    //     let posDifX = x,
    //         posDifY = y,
    //         elemX = element.getX() * 120,
    //         elemY = element.getY() * 120,
    //         unit;
    //
    //     if (x == -1 && y == -1) {
    //         while (true) {
    //             posDifX = this.randomInteger(-2, 2);
    //             posDifY = this.randomInteger(-2, 2);
    //
    //             if (elemX + posDifX * 120 < 1080 && elemY + posDifY * 120 < 600) {
    //                 if (elemY + posDifY * 120 >= 0 && elemX + posDifX * 120 >= 0) {
    //                     posDifX = elemX / 120 + posDifX;
    //                     posDifY = elemY / 120 + posDifY;
    //                     // console.log("old position => ", element, "to new pos ", posDifX, posDifY);
    //                     if (this.checkFreeLocation(posDifX, posDifY)) {
    //                         element.setCoord(posDifX, posDifY);
    //                         this.unit_collection.updateElement(element);
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         unit = this.getUnitObj(element.getAttribute("data-id"));
    //         x = elemX / 120 + x;
    //         y = elemY / 120 + y;
    //         unit.setCoord(x, y);
    //     }
    //
    //     posDifX *= 120;
    //     posDifY *= 120;
    //     console.log("Find enemies move", posDifX, posDifY);
    //     this.scene.renderElement(element);
    //     // element.style.left = posDifX + "px";
    //     // element.style.top = posDifY + "px";
    // }
    // //DELETE IT
    // checkFreeLocation(posDifX, posDifY) {
    //     let arr = this.unit_collection.getCollection(),
    //         res = true;

    //     arr.forEach((elem) => {
    //         if (elem.getX() == posDifX && elem.getY() == posDifY) {
    //             // console.log("checkFreeLocation false", arr, posDifX, posDifY);
    //             console.log("checkFreeLocation elem", elem.getX(), "=", posDifX, elem.getY(), "=", posDifY);
    //             res = false;
    //         }
    //     });
    //     console.log("checkFreeLocation true", posDifX, posDifY, arr);
    //     return res;
    // }

    // exploreArea = (enemieAi) => {
    //     let x = enemieAi.getY(),
    //         y = enemieAi.getY();
    //     let arrX = [x - 2, x - 1, x, x + 1, x + 2],
    //         arrY = [y - 2, y - 1, y, y + 1, y + 2],
    //         user_persons = this.unit_collection.getUserCollection(),
    //         enemieCoordX = -1,
    //         enemieCoordY = -1,
    //         result = { result: false, x: -1, y: -1 },
    //         cacheEvil = [];
    //     user_persons.forEach((elem) => {
    //         enemieCoordX = arrX.indexOf(elem.getX());
    //         enemieCoordY = arrY.indexOf(elem.getY());

    //         // console.log("exploreArea", enemieCoordX != -1 && enemieCoordY != -1, elem.person.id != enemieAi.person.id);

    //         if (enemieCoordX != -1 && enemieCoordY != -1) {
    //             if (elem.person.id != enemieAi.person.id) {
    //                 // console.log("return find enemies!!!", arrX, arrY, elem);
    //                 cacheEvil.push(elem);
    //                 result = { result: true, x: enemieCoordX, y: enemieCoordY };
    //             }
    //         }
    //     });
    //     return result;
    // };
    choseGlobalStr(ai_units) {
        // тут будет выбор между стратегиями 
        // var global_strategy = new GlobalSTRMaxAgro({
        //     scene: this.scene,
        //     unit_collection: this.unit_collection,
        //     // view: this.view
        // });
        // return global_strategy;
        let tmp_ai = {}, assessment, max = -1, best_ai = {};
        let result_assessment = cacheGlobalAI.map(AI => {
            tmp_ai = new AI({
                scene: this.scene,
                ai_units: ai_units,
                view: this.view,
                unit_collection: this.unit_collection
            })
            assessment = tmp_ai.assessment(this.CACHE)
            this.CACHE = assessment.cache;
            // console.log("ai ", tmp_ai.getInfo(), "total ", assessment.total);
            return { assessment: assessment.total, ai: tmp_ai };
        });
        result_assessment.forEach(elem => {
            if (max == -1) {
                max = elem.assessment;
                best_ai = elem.ai;
            }
            if (elem.assessment > max) {
                max = elem.assessment;
                best_ai = elem.ai;
            }
        });
        // console.log(this.CACHE);
        return best_ai;
    }
    // choseStrategy(cacheGlobalAI = [], unit) {
    //     // ..как вариант в assessment будет выбираться тип атакиЮ путь к врагу.который будет потом учитывать ся самой стратегии
    //     var result_assessment, tmp_ai, max = -1, best_ai, assessment;
    //     result_assessment = cacheGlobalAI.map(AI => {
    //         tmp_ai = new AI({
    //             unit: unit,
    //             scene: this.scene,
    //             unit_collection: this.unit_collection,
    //             view: this.view
    //         })
    //         assessment = tmp_ai.assessment(this.CACHE)
    //         this.CACHE = assessment.cache;
    //         // console.log("ai ", tmp_ai.getInfo(), "total ", assessment.total);
    //         return { assessment: assessment.total, ai: tmp_ai };
    //     });
    //     // console.log("result_assessment", result_assessment);
    //     result_assessment.forEach(elem => {
    //         if (max == -1) {
    //             max = elem.assessment;
    //             best_ai = elem.ai;
    //         }
    //         if (elem.assessment > max) {
    //             max = elem.assessment;
    //             best_ai = elem.ai;
    //         }
    //     });
    //     // console.log(this.CACHE);
    //     return best_ai;
    // }
    stepAi(ai_units, index = 0) {
        // вообщем я сделал стратегии длоя 1го персонажа, теперь нужно сделать надстройку, которая будет управлять этими персонажами
        // ..сходили 1м чуваком, и нужно заного искать стратегию...
        // var global_strategy = this.choseGlobalStr();
        // global_strategy.start();
        // this.cacheAiUnits
        // var unit = cacheAi[index];
        // this.view.showCurentUnit(unit.domPerson);
        // var best_ai;
        // unit.moveAction = false; 
        const best_strategy = this.choseGlobalStr(ai_units);
        best_strategy.start(this.CACHE);
        // if (unit.person.class == "fighter") {
        //     best_ai = this.choseStrategy(cacheGlobalAI, unit);
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
        this.CACHE = {};
        this.syncUnit(this.unit_collection);
    };
}
