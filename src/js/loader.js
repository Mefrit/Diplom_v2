define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Downloader = void 0;
    var Downloader = (function () {
        function Downloader() {
            this.resourceCache = [];
            this.loading = [];
            this.readyCallbacks = [];
        }
        Downloader.prototype.load = function (elemArr) {
            var obj = this;
            elemArr.getCollection().forEach(function (elem) {
                obj.loadElement(elem.person.url);
            });
        };
        Downloader.prototype.loadJSON = function (path) {
            var obj = this;
            obj.resourceCache[path] = false;
            return fetch(path)
                .then(function (r) { return r.json(); })
                .then(function (data) {
                var resource = {
                    data: null,
                    loaded: false,
                    type: "json",
                    path: path,
                };
                resource.data = data;
                obj.resourceCache[path] = data;
                if (obj.isReady()) {
                    obj.readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
                return resource;
            });
        };
        Downloader.prototype.loadElement = function (url) {
            var obj = this;
            if (this.resourceCache[url]) {
                return this.resourceCache[url];
            }
            else {
                var img = new Image();
                img.onload = function () {
                    obj.resourceCache[url] = img;
                    if (obj.isReady()) {
                        obj.readyCallbacks.forEach(function (func) {
                            func();
                        });
                    }
                };
                this.resourceCache[url] = false;
                img.src = url;
            }
        };
        Downloader.prototype.get = function (url) {
            return this.resourceCache[url];
        };
        Downloader.prototype.onReady = function (func) {
            this.readyCallbacks.push(func);
        };
        Downloader.prototype.isReady = function () {
            var ready = true;
            for (var k in this.resourceCache) {
                if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
                    ready = false;
                }
            }
            return ready;
        };
        return Downloader;
    }());
    exports.Downloader = Downloader;
});
