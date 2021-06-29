define(["require", "exports", "../globalstrategies/globalSmartAgro", "../globalstrategies/globalDistanceAgro", "../globalstrategies/globalProtectArchers", "../globalstrategies/globalUndercoverArcherAttack"], function (require, exports, globalSmartAgro_1, globalDistanceAgro_1, globalProtectArchers_1, globalUndercoverArcherAttack_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cacheGlobalAI = void 0;
    exports.cacheGlobalAI = [
        globalDistanceAgro_1.DistanceAgro,
        globalProtectArchers_1.ProtectArchers,
        globalSmartAgro_1.SmartAgro,
        globalUndercoverArcherAttack_1.UndercoverArcherAttack,
    ];
});
