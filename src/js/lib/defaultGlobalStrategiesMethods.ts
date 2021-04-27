import { DefaultMethodsStrategey } from "./defaultMethods";
export class DefaultGlobalMethodsStrategey extends DefaultMethodsStrategey {
    constructor(props) {
        super(props);
    }
    checkConnection() {
        alert("connction");
    }
    getStrategyByName(cache_ai, name) {

        let result = {};
        for (let key in cache_ai) {
            if (key == name) {
                result = cache_ai[key];
            }
        }
        return result;
        // return cache_ai.map(elem => {
        //     // console.log(elem);
        //     if (elem.getInfo() == name) {
        //         return elem;
        //     }
        // })
    }
    sortArchersFirst(cacheAi) {
        return cacheAi.sort((prev, next) => {
            if (prev.person.class == "archer") {
                return -1;
            } else {
                return 1;
            }
        });
    }
}