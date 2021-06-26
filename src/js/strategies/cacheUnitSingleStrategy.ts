import { FightIfYouCan } from "./angryIfcan";
import { StayForwardArcher } from "./stayForwardArcher";
import { SecurityArcher } from "./securityArcher";
import { GoAwayIfManyEnemies } from "./goAvayIfManyEnemies";
import { AtackTheArcher } from "./atackTheArcher";
import { RunAwayArcher } from "./RunAwayArcher";
// идеи для стратегий
// -если чувак остался 1 а по близости много врагов
// спасение чувака из ситуации выше
export const cacheFighterAI = {
    SecurityArcher: SecurityArcher,
    StayForwardArcher: StayForwardArcher,
    FightIfYouCan: FightIfYouCan,
    GoAwayIfManyEnemies: GoAwayIfManyEnemies,
};
export const cacheArcherAI = {
    AtackTheArcher: AtackTheArcher,
    RunAwayArcher: RunAwayArcher,
    GoAwayIfManyEnemies: GoAwayIfManyEnemies,
};
