define(["require", "exports", "../strategies/angryIfcan", "./securityArcher", "./goAvayIfManyEnemies"], function (require, exports, angryIfcan_1, securityArcher_1, goAvayIfManyEnemies_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cacheFighterAI = void 0;
    exports.cacheFighterAI = [securityArcher_1.SecurityArcher, angryIfcan_1.FightIfYouCan, goAvayIfManyEnemies_1.GoAwayIfManyEnemies];
});
