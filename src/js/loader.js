define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageDownloader = (function () {
        function ImageDownloader() {
            this.resourceCache = [];
            this.loading = [];
            this.readyCallbacks = [];
        }
        ImageDownloader.prototype.load = function (elemArr) {
            var obj = this;
            elemArr.getCollection().forEach(function (elem) {
                obj.loadElement(elem.person.url);
            });
        };
        ImageDownloader.prototype.loadElement = function (url) {
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
        ImageDownloader.prototype.get = function (url) {
            return this.resourceCache[url];
        };
        ImageDownloader.prototype.onReady = function (func) {
            this.readyCallbacks.push(func);
        };
        ImageDownloader.prototype.isReady = function () {
            var ready = true;
            for (var k in this.resourceCache) {
                if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
                    ready = false;
                }
            }
            return ready;
        };
        return ImageDownloader;
    }());
    exports.ImageDownloader = ImageDownloader;
});
