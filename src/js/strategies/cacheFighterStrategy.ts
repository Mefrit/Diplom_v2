import { FightIfYouCan } from "../strategies/angryIfcan";
import { SecurityArcher } from "./securityArcher";
import { GoAwayIfManyEnemies } from "./goAvayIfManyEnemies"

//идеи для стратегий,
// -если чувак остался 1 а по близости много врагов 
// спасение чувака из ситуации выше
export const cacheFighterAI = [SecurityArcher, FightIfYouCan, GoAwayIfManyEnemies];
