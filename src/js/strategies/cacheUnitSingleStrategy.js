define(["require", "exports", "./angryIfcan", "./securityArcher", "./goAvayIfManyEnemies", "./atackTheArcher"], function (require, exports, angryIfcan_1, securityArcher_1, goAvayIfManyEnemies_1, atackTheArcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cacheFighterAI = {
        "SecurityArcher": securityArcher_1.SecurityArcher,
        "FightIfYouCan": angryIfcan_1.FightIfYouCan,
        "GoAwayIfManyEnemies": goAvayIfManyEnemies_1.GoAwayIfManyEnemies
    };
    exports.cacheArcherAI = {
        "AtackTheArcher": atackTheArcher_1.AtackTheArcher
    };
});
