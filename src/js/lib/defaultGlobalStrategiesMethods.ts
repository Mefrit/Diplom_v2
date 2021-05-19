import { DefaultMethodsStrategy } from "./defaultMethods";
export class DefaultGlobalMethodsStrategy extends DefaultMethodsStrategy {
    constructor(props) {
        super(props);
    }
    checkConnection() {
        alert("connction");
    }
    deleteBusyEnemies(cache_enemies, archers_purpose) {
        let find = false;
        return cache_enemies.filter(enemies => {

            archers_purpose.forEach(archers_enemie => {
                if (archers_enemie.enemie.person.id == enemies.person.id) {
                    find = true;
                }
            });
            if (find) {
                find = false;
                return false;
            }
            return true;
        });
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