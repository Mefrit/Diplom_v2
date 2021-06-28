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
                _this.person_collection = data;
            };
            this.onOutBlock = function (event) {
                event.target.classList.remove("block__free");
                event.target.classList.remove("block__nonFree");
            };
            this.onMove = function (event) {
                var posX = event.target.style.left, posY = event.target.style.top, coord = {}, activePerson = [];
                activePerson = _this.person_collection.getCollection().filter(function (elem) {
                    if (elem.getId() == _this.canvas.getAttribute("data-id")) {
                        coord = { x: parseInt(posX.split("px")) / 120, y: parseInt(posY.split("px")) / 120 };
                        console.log(_this.getDistanceBetweenUnits(elem, coord));
                        if (_this.checkFreeCoordWalls(_this.wall_blocks, coord) ||
                            _this.checkFreeCoordWalls(_this.water_blocks, coord) ||
                            !_this.person_collection.checkFreeCoord(coord)) {
                            alert("Перемещение на данную позицию невозможно.");
                        }
                        else {
                            if (_this.getDistanceBetweenUnits(elem, coord) > 2.9) {
                                alert("Юниты могут передвигаться в радиусе 2 клеток.");
                            }
                            else {
                                if (_this.checkUnitAction(_this.cache_moved_units, elem)) {
                                    alert("На текущем ходу вы уже переместились.");
                                }
                                else {
                                    _this.cache_moved_units.push(elem);
                                    elem.setCoord(coord.x, coord.y);
                                    _this.canvas.style.left = parseInt(posX.split("px")[0]) + 18 + "px";
                                    _this.canvas.style.top = posY;
                                    elem.setMoveAction(true);
                                }
                            }
                        }
                    }
                    if (!elem.getMoveAction() && !elem.getKind()) {
                        return elem;
                    }
                });
                if (activePerson.length == 0) {
                    _this.person_collection.getCollection().forEach(function (elem) {
                        if (!elem.getKind()) {
                            elem.setMoveAction(false);
                        }
                    });
                    setTimeout(function () {
                    }, 200);
                }
            };
            this.contactPersons = function (event) {
                var canvas_enemy = event.target, img = _this.loader.get(event.target.getAttribute("data-image"));
                if (typeof _this.canvas != "undefined") {
                    var id_person = parseInt(_this.canvas.getAttribute("data-id")), id_enemy = parseInt(canvas_enemy.getAttribute("data-id")), unit_1 = _this.person_collection.getPersonById(id_person)[0], enemy = _this.person_collection.getPersonById(id_enemy)[0];
                    if (_this.getDistanceBetweenUnits(unit_1, enemy) > 2 && unit_1.person.class == "fighter") {
                        alert("Бойцы ближнего боя могут атаковать только по прямойв радиусе 2х клеток");
                        return;
                    }
                    if (_this.getDistanceBetweenUnits(unit_1, enemy) > 4) {
                        alert("Режим Леголаса отменен. Лучники могут атаковать только в радиусе 4х клеток");
                        return;
                    }
                    else {
                        if (unit_1.person.class == "archer" && !(unit_1.x == enemy.x || enemy.y == unit_1.y)) {
                            alert("Лучники могут атаковать только по прямой");
                            return;
                        }
                    }
                    if (_this.checkUnitAction(_this.cache_set_atacke_units, unit_1)) {
                        alert("За этот ход вы уже кого-то побили.");
                        return;
                    }
                    _this.cache_set_atacke_units.push(unit_1);
                    if (unit_1.person.class == "fighter") {
                        unit_1.stopAnimation("elf_fighter_default");
                        unit_1.playAnimation("elf_fighter_atacke");
                        setTimeout(function () {
                            unit_1.stopAnimation("elf_fighter_atacke");
                            unit_1.playAnimation("elf_fighter_default");
                        }, 750);
                    }
                    if (unit_1.person.class == "archer") {
                        unit_1.stopAnimation("elf_archer_default");
                        unit_1.playAnimation("elf_archer_atacke");
                        setTimeout(function () {
                            unit_1.stopAnimation("elf_archer_atacke");
                            unit_1.playAnimation("elf_archer_default");
                        }, 750);
                    }
                    _this.view.contactPersonsView(canvas_enemy, img, unit_1.person.damage);
                }
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
            this.person_collection = new person_collection_1.Collection(arrImg);
            this.wall_blocks = [];
            this.cache_moved_units = [];
            this.cache_set_atacke_units = [];
            this.view = new viewScene_1.ViewScene(this.person_collection, this.loader);
            this.curentPerson = undefined;
            this.water_blocks = [];
            this.ai = ai;
            this.ai.initView(this.view);
            this.ai.initPersons(this.person_collection, this.syncUnit);
            this.play();
        }
        Scene.prototype.getCoordFromStyle = function (elem) {
            return parseInt(elem.split("px")[0]);
        };
        Scene.prototype.checkUnitAction = function (cache, unit) {
            var find = false;
            cache.forEach(function (elem) {
                if (unit.person) {
                    if (elem.person.id == unit.person.id) {
                        find = true;
                    }
                }
                else {
                    if (elem.x == unit.x && elem.y == unit.y) {
                        find = true;
                    }
                }
            });
            return find;
        };
        Scene.prototype.getPerson = function () {
            return this.person_collection;
        };
        Scene.prototype.removeCacheUnits = function () {
            this.cache_moved_units = [];
            this.cache_set_atacke_units = [];
        };
        Scene.prototype.checkFreeCoordWalls = function (cache, unit) {
            var result = false;
            cache.forEach(function (element) {
                if (parseInt(element.x) == parseInt(unit.x) && parseInt(element.y) == parseInt(unit.y)) {
                    result = true;
                }
            });
            return result;
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
        Scene.prototype.getDistanceBetweenUnits = function (unit1, unit2) {
            var tmp_x, tmp_y;
            tmp_x = unit1.x - unit2.x;
            tmp_y = unit1.y - unit2.y;
            return Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
        };
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
            this.loader.load(this.person_collection);
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
                _this.person_collection.collection.forEach(function (elem) {
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
