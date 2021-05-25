define(["require", "exports", "../globalstrategies/globalSmartAgro", "../globalstrategies/globalDistanceAgro", "../globalstrategies/globalProtectArchers"], function (require, exports, globalSmartAgro_1, globalDistanceAgro_1, globalProtectArchers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cacheGlobalAI = void 0;
    exports.cacheGlobalAI = [globalProtectArchers_1.ProtectArchers, globalDistanceAgro_1.DistanceAgro, globalSmartAgro_1.SmartAgro];
});
