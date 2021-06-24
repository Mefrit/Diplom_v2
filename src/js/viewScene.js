define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewScene = void 0;
    var ViewScene = (function () {
        function ViewScene(arrObjPlayers, loader) {
            var _this = this;
            this.renderPlayer = function (cnvsElem, elem, img) {
                var ctx;
                cnvsElem.style.position = "absolute";
                cnvsElem.classList.add("person");
                if (elem.evil) {
                    cnvsElem.classList.add("ai");
                }
                else {
                    cnvsElem.classList.add("players");
                }
                cnvsElem.setAttribute("data-image", elem.person.url);
                cnvsElem.setAttribute("data-id", elem.person.id);
                cnvsElem.style.top = elem.y * 120 + "px";
                cnvsElem.style.left = elem.x * 120 + "px";
                cnvsElem.style.width = 120 + "px";
                cnvsElem.style.height = 130 + "px";
                ctx = cnvsElem.getContext("2d");
                _this.drawImage(ctx, img);
                _this.changeHealth(ctx, elem);
                return cnvsElem;
            };
            this.renderElement = function (element) {
                element.domPerson.style.left = element.getX() * 120 + "px";
                element.domPerson.style.top = element.getY() * 120 + "px";
            };
            this.changeHealth = function (ctx, elem, damage) {
                if (damage === void 0) { damage = 0; }
                var obj, img;
                _this.arrObjPersons.getCollection().forEach(function (elemCollection) {
                    if (elemCollection.getId() == elem.person.id) {
                        obj = elemCollection;
                    }
                });
                if (damage > 0) {
                    if (typeof obj != "undefined") {
                        if (obj.getHealth() >= 10) {
                            obj.setHealth(obj.getHealth() - damage);
                        }
                    }
                }
            };
            this.contactPersonsView = function (canvas, img, damage) {
                if (damage === void 0) { damage = 5; }
                var ctx = canvas.getContext("2d"), id;
                ctx.beginPath();
                ctx.clearRect(0, 0, 1000, 1000);
                _this.drawImage(ctx, img);
                id = { id: canvas.getAttribute("data-id") };
                canvas.classList.add("person-atacked");
                setTimeout(function () {
                    canvas.classList.remove("person-atacked");
                }, 800);
                _this.changeHealth(ctx, { person: id }, damage);
            };
            this.arrObjPersons = arrObjPlayers;
            this.loader = loader;
        }
        ViewScene.prototype.drawImage = function (ctx, img) {
            var width, height, coef;
            if (img) {
                if (img.width > 200) {
                    coef = 150 / parseFloat(img.width);
                    width = img.width * coef;
                    height = img.height * coef;
                }
                else {
                    width = img.width;
                    height = img.height;
                }
                ctx.drawImage(img, 0, 0, width + 150, height);
                ctx.scale(-1, 1);
                ctx.restore();
            }
            else {
                console.log("fail in load image");
            }
            return ctx;
        };
        ViewScene.prototype.renderDragon = function (name) {
        };
        ViewScene.prototype.clearPrev = function (canvas, loader) {
            var ctx = canvas.getContext("2d"), img, width;
            ctx.clearRect(0, 0, 1000, 1000);
            img = loader.get(canvas.getAttribute("data-image"));
            this.drawImage(ctx, img);
        };
        ViewScene.prototype.changePersonView = function (canvas, loader) {
            var ctx = canvas.getContext("2d"), id, img;
            ctx.fillStyle = "coral";
            ctx.fillRect(0, 0, 1000, 1000);
            img = loader.get(canvas.getAttribute("data-image"));
            this.drawImage(ctx, img);
            id = { id: canvas.getAttribute("data-id") };
            this.changeHealth(ctx, { person: id });
        };
        ViewScene.prototype.showAvailabeMovies = function (canvas) {
            var posX = canvas.style.left.split("px")[0], posY = canvas.style.top.split("px")[0], arrBlocks = document.getElementsByClassName("sence__block"), radius, posXblock, posYblock;
            radius = Math.sqrt(posX * posX + posY * posY);
            arrBlocks = [].slice.call(arrBlocks);
            arrBlocks.forEach(function (element) {
                posXblock = element.style.left.split("px")[0];
                posYblock = element.style.top.split("px")[0];
            });
        };
        ViewScene.prototype.renderBlockView = function (block, posX, posY, i, j) {
            block.setAttribute("data-coord", i + ";" + j);
            block.classList.add("sence__block");
            block.style.left = posX + "px";
            block.style.top = posY + "px";
            var random = this.randomInteger(0, 40);
            block.src = "src/images/block3.png";
            block.src = "src/images/block2.png";
            if (random < 20) {
                block.src = "src/images/block3.png";
            }
            if (i == 8 && j == 1) {
                block.src = "src/images/block1.png";
            }
            if (i == 4 && j == 3) {
                block.src = "src/images/block4.png";
            }
            if (i == 4 && j == 3) {
                block.src = "src/images/block4.png";
            }
            if (i == 4 && j == 2) {
                block.src = "src/images/block4.png";
            }
            if (i == 4 && j == 1) {
                block.src = "src/images/block4.png";
            }
            if (i == 8 && j == 4) {
                block.src = "src/images/block4.png";
            }
            if (i == 8 && j == 5) {
                block.src = "src/images/block4.png";
            }
            if (i == 8 && j == 6) {
                block.src = "src/images/block4.png";
            }
            if (i == 5 && j == 7) {
                block.src = "src/images/block1.png";
            }
            if (i == 2 && j == 2) {
                block.src = "src/images/block1.png";
            }
            if (i == 7 && j == 5) {
                block.src = "src/images/block1.png";
            }
            if (i == 7 && j == 5) {
                block.src = "src/images/block1.png";
            }
            if (i == 2 && j == 5) {
                block.src = "src/images/block4.png";
            }
            return block;
        };
        ViewScene.prototype.randomInteger = function (min, max) {
            var rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        };
        ViewScene.prototype.showCurentUnit = function (domPerson) {
            domPerson.classList.add("block__free");
        };
        ViewScene.prototype.disableCurentUnit = function (domPerson) {
            domPerson.classList.remove("block__free");
        };
        return ViewScene;
    }());
    exports.ViewScene = ViewScene;
});
