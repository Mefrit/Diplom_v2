var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./defaultMethods"], function (require, exports, defaultMethods_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultGlobalMethodsStrategey = void 0;
    var DefaultGlobalMethodsStrategey = (function (_super) {
        __extends(DefaultGlobalMethodsStrategey, _super);
        function DefaultGlobalMethodsStrategey(props) {
            return _super.call(this, props) || this;
        }
        DefaultGlobalMethodsStrategey.prototype.checkConnection = function () {
            alert("connction");
        };
        DefaultGlobalMethodsStrategey.prototype.getStrategyByName = function (cache_ai, name) {
            return cache_ai.map(function (elem) {
                if (elem.getInfo(0 == name)) {
                    return elem;
                }
            });
        };
        DefaultGlobalMethodsStrategey.prototype.sortArchersFirst = function (cacheAi) {
            return cacheAi.sort(function (prev, next) {
                if (prev.person.class == "archer") {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        };
        return DefaultGlobalMethodsStrategey;
    }(defaultMethods_1.DefaultMethodsStrategey));
    exports.DefaultGlobalMethodsStrategey = DefaultGlobalMethodsStrategey;
});
