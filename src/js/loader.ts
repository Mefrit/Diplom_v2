export class Downloader {
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
    loadJSON(path) {
        let obj: any = this;
        obj.resourceCache[path] = false;
        return fetch(path)
            .then((r) => r.json())
            .then((data) => {
                var resource = {
                    data: null,
                    loaded: false,
                    type: "json",

                    path: path,
                };

                resource.data = data;
                // resource.loaded = true;
                obj.resourceCache[path] = data;
                if (obj.isReady()) {
                    obj.readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
                return resource;
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
            // console.log(k, this.resourceCache[k]);
            if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }
}
