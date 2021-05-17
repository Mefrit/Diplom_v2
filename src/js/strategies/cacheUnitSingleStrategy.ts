import { FightIfYouCan } from "./angryIfcan";
import { SecurityArcher } from "./securityArcher";
import { GoAwayIfManyEnemies } from "./goAvayIfManyEnemies"
import { AtackTheArcher } from "./atackTheArcher"

// идеи для стратегий
// -если чувак остался 1 а по близости много врагов 
// спасение чувака из ситуации выше
export const cacheFighterAI = {
    "SecurityArcher": SecurityArcher,
    "FightIfYouCan": FightIfYouCan,
    "GoAwayIfManyEnemies": GoAwayIfManyEnemies
};
export const cacheArcherAI = {
    "AtackTheArcher": AtackTheArcher
};
