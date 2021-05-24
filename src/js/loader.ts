export class ImageDownloader {
    resourceCache: any;
    loading: any;
    readyCallbacks: any;

    constructor() {
        this.resourceCache = [];
        this.loading = [];
        this.readyCallbacks = [];
    }
    load(elemArr) {
        let obj = this;
        elemArr.getCollection().forEach(function (elem) {
            obj.loadElement(elem.person.url);
        });
    }
    loadElement(url) {
        let obj: any = this;
        if (this.resourceCache[url]) {
            return this.resourceCache[url];
        } else {
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
    }
    get(url) {
        return this.resourceCache[url];
    }
    onReady(func) {
        this.readyCallbacks.push(func);
    }
    isReady() {
        var ready = true;
        for (var k in this.resourceCache) {
            if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }
}
