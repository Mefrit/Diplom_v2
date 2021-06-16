define(["require", "exports", "../viewScene", "./person_collection", "../lib/dragon"], function (require, exports, viewScene_1, person_collection_1, dragon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scene = (function () {
        function Scene(loader, arrImg, config_skins, ai) {
            var _this = this;
            this.onBlock = function (event) {
                var block = event.target, posX, posY;
                if (_this.canvas != undefined) {
                    posX = Math.abs(parseInt(_this.canvas.style.left.split("px")[0]) - _this.getCoordFromStyle(block.style.left));
                    posY = Math.abs(parseInt(_this.canvas.style.top.split("px")[0]) - _this.getCoordFromStyle(block.style.top));
                    if (posX < 290 && posY < 290) {
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
            this.skins = {};
            this.config_skins = config_skins;
            this.collectionPersons = new person_collection_1.Collection(arrImg);
            this.wall_blocks = [];
            this.view = new viewScene_1.ViewScene(this.collectionPersons, this.loader);
            this.curentPerson = undefined;
            this.water_blocks = [];
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
        Scene.prototype.get = function (name) {
            return this[name];
        };
        Scene.prototype.renderArena = function () {
            var scence = document.getElementById("scene"), block, posX = 0, posY = 0, position_block;
            for (var j = 0; j < 8; j++) {
                for (var i = 0; i < 12; i++) {
                    block = document.createElement("img");
                    block.addEventListener("mouseout", this.onOutBlock);
                    block.addEventListener("mouseover", this.onBlock);
                    block.addEventListener("click", this.onMove);
                    block = this.view.renderBlockView(block, posX, posY, i, j);
                    if (block.src.indexOf("block1.png") != -1) {
                        position_block = block.getAttribute("data-coord").split(";");
                        this.wall_blocks.push({ x: position_block[0], y: position_block[1] });
                    }
                    if (block.src.indexOf("block4.png") != -1) {
                        position_block = block.getAttribute("data-coord").split(";");
                        this.water_blocks.push({ x: position_block[0], y: position_block[1] });
                    }
                    scence.appendChild(block);
                    posX += 120;
                }
                posX = 0;
                posY += 120;
            }
        };
        Scene.prototype.setAIperson = function () { };
        Scene.prototype.loadDragon = function () {
            var _this = this;
            var obj = this, image_domcache = [];
            this.config_skins.forEach(function (skin) {
                image_domcache = [];
                skin.children.forEach(function (elem) {
                    _this.loader.loadJSON(elem.src_json);
                    elem.src_images.forEach(function (img) {
                        if (typeof obj.loader.get(img.path) == "undefined") {
                            obj.loader.loadElement(img.path);
                        }
                    });
                });
            });
        };
        Scene.prototype.play = function () {
            var _this = this;
            this.renderArena();
            var cache_skins = [], tmp = {};
            this.loader.loadElement("./src/images/rip.png");
            this.loader.load(this.collectionPersons);
            this.loadDragon();
            this.loader.onReady(function () {
                _this.config_skins.forEach(function (skin) {
                    skin.children.forEach(function (elem) {
                        tmp.cahce_image = [];
                        tmp.name = elem.name;
                        tmp.src_json = elem.src_json;
                        tmp.class = elem.class;
                        elem.src_images.forEach(function (img) {
                            tmp.cahce_image[img.name] = { node: _this.loader.get(img.path) };
                        });
                        cache_skins.push(tmp);
                        tmp = {};
                    });
                });
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
                    cache_skins.forEach(function (skin) {
                        if (elem.person.evil) {
                            if (skin.class == "evil_fighter" && elem.person.class == "fighter") {
                                var dragon = new dragon_1.DragonAnimationUpdate(_this.loader.get(skin.src_json), skin.cahce_image, skin.name, elem);
                                dragon.updateCanvas(elem.domPerson);
                                if (skin.name == "default_fighter") {
                                    dragon.play();
                                }
                                elem.setAnimation(skin.name, dragon);
                            }
                            if (skin.class == "evil_archer" && elem.person.class == "archer") {
                                var dragon = new dragon_1.DragonAnimationUpdate(_this.loader.get(skin.src_json), skin.cahce_image, skin.name, elem);
                                dragon.updateCanvas(elem.domPerson);
                                if (skin.name == "default_archer") {
                                    dragon.play();
                                }
                                elem.setAnimation(skin.name, dragon);
                            }
                        }
                        else {
                            if (skin.class == "elf_fighter" && elem.person.class == "fighter") {
                                var dragon = new dragon_1.DragonAnimationUpdate(_this.loader.get(skin.src_json), skin.cahce_image, skin.name, elem);
                                dragon.updateCanvas(elem.domPerson);
                                if (skin.name == "elf_fighter_default") {
                                    dragon.play();
                                }
                                elem.setAnimation(skin.name, dragon);
                            }
                            if (skin.class == "elf_archer" && elem.person.class == "archer") {
                                var dragon = new dragon_1.DragonAnimationUpdate(_this.loader.get(skin.src_json), skin.cahce_image, skin.name, elem);
                                dragon.updateCanvas(elem.domPerson);
                                if (skin.name == "elf_archer_default") {
                                    dragon.play();
                                }
                                elem.setAnimation(skin.name, dragon);
                            }
                        }
                    });
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
