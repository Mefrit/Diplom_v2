define(["require", "exports", "../viewScene", "./person_collection"], function (require, exports, viewScene_1, person_collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Scene = void 0;
    var Scene = (function () {
        function Scene(loader, arrImg, ai) {
            var _this = this;
            this.onBlock = function (event) {
                var block = event.target, posX, posY;
                if (_this.canvas != undefined) {
                    posX = Math.abs(parseInt(_this.canvas.style.left.split("px")[0]) - _this.getCoordFromStyle(block.style.left));
                    posY = Math.abs(parseInt(_this.canvas.style.top.split("px")[0]) - _this.getCoordFromStyle(block.style.top));
                    document.getElementById("block_information").innerHTML =
                        "<h1>x:" +
                            _this.getCoordFromStyle(block.style.left) / 120 +
                            " y:" +
                            _this.getCoordFromStyle(block.style.top) / 120 +
                            "</h1>";
                    if (posX < 190 && posY < 190) {
                        block.classList.add("block__free");
                    }
                    else {
                        block.classList.add("block__nonFree");
                    }
                }
            };
            this.syncUnit = function (data) {
                _this.collectionPersons = data;
            };
            this.onOutBlock = function (event) {
                event.target.classList.remove("block__free");
                event.target.classList.remove("block__nonFree");
            };
            this.onMove = function (event) {
                var posX = event.target.style.left, posY = event.target.style.top, activePerson = [];
                if (true) {
                    _this.canvas.style.left = parseInt(posX.split("px")[0]) + 18 + "px";
                    _this.canvas.style.top = posY;
                }
                activePerson = _this.collectionPersons.getCollection().filter(function (elem) {
                    if (elem.getId() == _this.canvas.getAttribute("data-id")) {
                        elem.setCoord(parseInt(posX.split("px")) / 120, parseInt(posY.split("px")) / 120);
                        elem.setMoveAction(true);
                    }
                    if (!elem.getMoveAction() && !elem.getKind()) {
                        return elem;
                    }
                });
                if (activePerson.length == 0) {
                    _this.collectionPersons.getCollection().forEach(function (elem) {
                        if (!elem.getKind()) {
                            elem.setMoveAction(false);
                        }
                    });
                    setTimeout(function () {
                        _this.ai.step();
                    }, 200);
                }
            };
            this.contactPersons = function (event) {
                var canvas = event.target, img = _this.loader.get(event.target.getAttribute("data-image"));
                _this.view.contactPersonsView(canvas, img);
            };
            this.onChangePerson = function (event) {
                var canvas = event.target;
                if (_this.canvas != undefined) {
                    _this.view.clearPrev(_this.canvas, _this.loader);
                }
                _this.chosePerson = true;
                _this.view.changePersonView(canvas, _this.loader);
                _this.canvas = canvas;
                _this.view.showAvailabeMovies(_this.canvas);
            };
            this.loader = loader;
            this.chosePerson = false;
            this.collectionPersons = new person_collection_1.Collection(arrImg);
            this.view = new viewScene_1.ViewScene(this.collectionPersons, this.loader);
            this.curentPerson = undefined;
            this.ai = ai;
            this.ai.initView(this.view);
            this.ai.initPersons(this.collectionPersons, this.syncUnit);
            this.play();
        }
        Scene.prototype.getCoordFromStyle = function (elem) {
            return parseInt(elem.split("px")[0]);
        };
        Scene.prototype.getPerson = function () {
            return this.collectionPersons;
        };
        Scene.prototype.renderElement = function (element) {
            this.view.renderElement(element);
        };
        Scene.prototype.renderArena = function () {
            var scence = document.getElementById("scene"), block, posX = 0, posY = 0;
            for (var j = 0; j < 6; j++) {
                for (var i = 0; i < 11; i++) {
                    block = document.createElement("img");
                    block.addEventListener("mouseout", this.onOutBlock);
                    block.addEventListener("mouseover", this.onBlock);
                    block.addEventListener("click", this.onMove);
                    block = this.view.renderBlockView(block, posX, posY, i, j);
                    scence.appendChild(block);
                    posX += 120;
                }
                posX = 0;
                posY += 120;
            }
        };
        Scene.prototype.setAIperson = function () { };
        Scene.prototype.play = function () {
            var _this = this;
            this.renderArena();
            this.loader.loadElement("./src/images/rip.png");
            this.loader.load(this.collectionPersons);
            this.loader.onReady(function () {
                _this.collectionPersons.collection.forEach(function (elem) {
                    var img = _this.loader.get(elem.person.url);
                    var cnvsElem = document.createElement("canvas");
                    cnvsElem = _this.view.renderPlayer(cnvsElem, elem, img);
                    if (!elem.person.evil) {
                        cnvsElem.onclick = _this.onChangePerson;
                    }
                    else {
                        cnvsElem.onclick = _this.contactPersons;
                    }
                    elem.initDomPerson(cnvsElem);
                    elem.initImage(img);
                    document.getElementById("scene").appendChild(cnvsElem);
                });
            });
        };
        Scene.prototype.renderAiPerson = function () { };
        return Scene;
    }());
    exports.Scene = Scene;
});
