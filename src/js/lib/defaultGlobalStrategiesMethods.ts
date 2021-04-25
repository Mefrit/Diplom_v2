import { DefaultMethodsStrategey } from "./defaultMethods";
export class DefaultGlobalMethodsStrategey extends DefaultMethodsStrategey {
    constructor(props) {
        super(props);
    }
    checkConnection() {
        alert("connction");
    }
    getStrategyByName(cache_ai, name) {
        return cache_ai.map(elem => {
            if (elem.getInfo(0 == name)) {
                return elem;
            }
        })
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