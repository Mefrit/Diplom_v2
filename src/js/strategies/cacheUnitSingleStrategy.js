define(["require", "exports", "./angryIfcan", "./stayForwardArcher", "./securityArcher", "./goAvayIfManyEnemies", "./atackTheArcher", "./RunAwayArcher"], function (require, exports, angryIfcan_1, stayForwardArcher_1, securityArcher_1, goAvayIfManyEnemies_1, atackTheArcher_1, RunAwayArcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cacheArcherAI = exports.cacheFighterAI = void 0;
    exports.cacheFighterAI = {
        SecurityArcher: securityArcher_1.SecurityArcher,
        StayForwardArcher: stayForwardArcher_1.StayForwardArcher,
        FightIfYouCan: angryIfcan_1.FightIfYouCan,
        GoAwayIfManyEnemies: goAvayIfManyEnemies_1.GoAwayIfManyEnemies,
    };
    exports.cacheArcherAI = {
        AtackTheArcher: atackTheArcher_1.AtackTheArcher,
        RunAwayArcher: RunAwayArcher_1.RunAwayArcher,
        GoAwayIfManyEnemies: goAvayIfManyEnemies_1.GoAwayIfManyEnemies,
    };
});
