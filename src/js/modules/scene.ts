import { Person } from "./person";
import { ViewScene } from "../viewScene";
import { Collection } from "./person_collection";
import { DragonAnimationUpdate } from "../lib/dragon";
export class Scene {
    loader: any;
    canvas: any;
    ai: any;
    arrImg: object[];
    person_collection: any;
    chosePerson: boolean;
    curentPerson: any;
    view: any;
    config_skins: any;
    skins: any;
    water_blocks: any[];
    wall_blocks: any[]; // кеш стен
    cache_moved_units: any[];
    cache_set_atacke_units: any[];
    constructor(loader, arrImg, config_skins, ai) {
        this.loader = loader;
        this.chosePerson = false;
        this.skins = {};
        this.config_skins = config_skins;
        this.person_collection = new Collection(arrImg);
        this.wall_blocks = [];
        //  arrImg.map(elem => {
        //     return new Person(elem);
        // });
        this.cache_moved_units = [];
        this.cache_set_atacke_units = [];
        this.view = new ViewScene(this.person_collection, this.loader);
        this.curentPerson = undefined;
        this.water_blocks = [];
        this.ai = ai;
        this.ai.initView(this.view);
        this.ai.initPersons(this.person_collection, this.syncUnit);
        this.play();
    }
    getCoordFromStyle(elem) {
        return parseInt(elem.split("px")[0]);
    }
    checkUnitAction(cache, unit) {
        let find = false;

        cache.forEach((elem) => {
            console.log(elem);
            if (unit.person) {
                if (elem.person.id == unit.person.id) {
                    find = true;
                }
            } else {
                if (elem.x == unit.x && elem.y == unit.y) {
                    find = true;
                }
            }
        });
        console.log(cache, unit, find);
        return find;
    }
    getPerson() {
        return this.person_collection;
    }
    removeCacheUnits() {
        this.cache_moved_units = [];
        this.cache_set_atacke_units = [];
    }
    onBlock = (event) => {
        let block = event.target,
            posX,
            posY;
        if (this.canvas != undefined) {
            posX = Math.abs(parseInt(this.canvas.style.left.split("px")[0]) - this.getCoordFromStyle(block.style.left));
            posY = Math.abs(parseInt(this.canvas.style.top.split("px")[0]) - this.getCoordFromStyle(block.style.top));
            // let coord_block = document.createElement("h1");
            // coord_block.innerText = "x:" + block.style.left + " y:" + block.style.top;
            // document.getElementById("block_information").innerHTML =
            //     "<h1>x:" +
            //     this.getCoordFromStyle(block.style.left) / 120 +
            //     " y:" +
            //     this.getCoordFromStyle(block.style.top) / 120 +
            //     "</h1>";

            if (posX < 290 && posY < 290) {
                block.classList.add("block__free");
            } else {
                block.classList.add("block__nonFree");
            }
        }
    };
    syncUnit = (data) => {
        this.person_collection = data;
    };
    onOutBlock = (event) => {
        event.target.classList.remove("block__free");
        event.target.classList.remove("block__nonFree");
    };
    onMove = (event) => {
        let posX = event.target.style.left,
            posY = event.target.style.top,
            coord: any = {},
            activePerson = [];
        //условие что можно ходить в область

        activePerson = this.person_collection.getCollection().filter((elem: any) => {
            if (elem.getId() == this.canvas.getAttribute("data-id")) {
                coord = { x: parseInt(posX.split("px")) / 120, y: parseInt(posY.split("px")) / 120 };
                console.log(this.getDistanceBetweenUnits(elem, coord));
                if (
                    this.checkFreeCoordWalls(this.wall_blocks, coord) ||
                    this.checkFreeCoordWalls(this.water_blocks, coord) ||
                    this.person_collection.checkFreeCoord(elem)
                ) {
                    alert("Перемещение на данную позицию невозможно.");
                } else {
                    if (this.getDistanceBetweenUnits(elem, coord) > 2.9) {
                        alert("Юниты могут передвигаться в радиусе 2 клеток.");
                    } else {
                        if (this.checkUnitAction(this.cache_moved_units, elem)) {
                            alert("На текущем ходу вы уже переместились.");
                        } else {
                            console.log(" this.cache_moved_units", this.cache_moved_units);
                            this.cache_moved_units.push(elem);
                            elem.setCoord(coord.x, coord.y);
                            this.canvas.style.left = parseInt(posX.split("px")[0]) + 18 + "px";
                            this.canvas.style.top = posY;
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
            // optimizase
            this.person_collection.getCollection().forEach((elem: any) => {
                if (!elem.getKind()) {
                    elem.setMoveAction(false);
                }
            });
            setTimeout(() => {
                // this.ai.step();
            }, 200);
        }
    };
    checkFreeCoordWalls(cache, unit) {
        let result = false;

        cache.forEach((element) => {
            if (parseInt(element.x) == parseInt(unit.x) && parseInt(element.y) == parseInt(unit.y)) {
                result = true;
            }
        });
        return result;
    }
    renderElement(element) {
        this.view.renderElement(element);
    }
    get(name) {
        return this[name];
    }
    renderArena() {
        let scence = document.getElementById("scene"),
            block,
            posX = 0,
            posY = 0,
            position_block;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 12; i++) {
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
                } // console.log(block.src);
                scence.appendChild(block);
                posX += 120;
            }
            posX = 0;
            posY += 120;
        }
    }
    setAIperson() {}
    getDistanceBetweenUnits(unit1, unit2) {
        // }
        let tmp_x, tmp_y;
        tmp_x = unit1.x - unit2.x;
        tmp_y = unit1.y - unit2.y;
        return Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y);
    }
    loadDragon() {
        let obj = this,
            image_domcache = [];
        this.config_skins.forEach((skin) => {
            image_domcache = [];
            skin.children.forEach((elem) => {
                this.loader.loadJSON(elem.src_json);

                elem.src_images.forEach((img) => {
                    if (typeof obj.loader.get(img.path) == "undefined") {
                        obj.loader.loadElement(img.path);
                    }
                });
            });
        });
    }
    play() {
        this.renderArena();
        let cache_skins = [],
            tmp: any = {};
        // this.loader.loadElement("./src/images/rip.png");
        this.loader.load(this.person_collection);
        this.loadDragon();

        this.loader.onReady(() => {
            this.config_skins.forEach((skin) => {
                skin.children.forEach((elem) => {
                    // this.loader.loadJSON(elem.src_json);

                    tmp.cahce_image = [];
                    tmp.name = elem.name;
                    tmp.src_json = elem.src_json;
                    tmp.class = elem.class;
                    elem.src_images.forEach((img) => {
                        tmp.cahce_image[img.name] = { node: this.loader.get(img.path) };
                    });

                    cache_skins.push(tmp);
                    tmp = {};
                });
            });

            this.person_collection.collection.forEach((elem: any) => {
                let img = this.loader.get(elem.person.url);
                let cnvsElem = document.createElement("canvas");
                cnvsElem = this.view.renderPlayer(cnvsElem, elem, img);

                if (!elem.person.evil) {
                    cnvsElem.onclick = this.onChangePerson;
                } else {
                    cnvsElem.onclick = this.contactPersons;
                }
                elem.initDomPerson(cnvsElem);
                // когда будем делать графику будет сложнее, тк от этого аподхода придется избавиться
                cache_skins.forEach((skin) => {
                    if (elem.person.evil) {
                        if (skin.class == "evil_fighter" && elem.person.class == "fighter") {
                            var dragon = new DragonAnimationUpdate(
                                this.loader.get(skin.src_json),
                                skin.cahce_image,
                                skin.name,
                                elem
                            );
                            dragon.updateCanvas(elem.domPerson);
                            if (skin.name == "default_fighter") {
                                dragon.play();
                            }
                            // setTimeout(() => {
                            //     elem.stopAnimation("default_fighter");
                            //     elem.playAnimation("atacke_fighter");
                            //     setTimeout(() => {
                            //         elem.stopAnimation("atacke_fighter");
                            //         elem.playAnimation("die_fighter");
                            //         setTimeout(() => {
                            //             elem.stopAnimation("die_fighter");
                            //         }, 800);
                            //     }, 4000);
                            // }, 8000);
                            elem.setAnimation(skin.name, dragon);
                        }
                        if (skin.class == "evil_archer" && elem.person.class == "archer") {
                            var dragon = new DragonAnimationUpdate(
                                this.loader.get(skin.src_json),
                                skin.cahce_image,
                                skin.name,
                                elem
                            );
                            dragon.updateCanvas(elem.domPerson);
                            if (skin.name == "default_archer") {
                                dragon.play();
                            }
                            // setTimeout(() => {
                            //     elem.stopAnimation("default_archer");
                            //     elem.playAnimation("atacke_archer");
                            //     setTimeout(() => {
                            //         elem.stopAnimation("atacke_archer");
                            //         elem.playAnimation("evil_archer_die");
                            //         setTimeout(() => {
                            //             elem.stopAnimation("evil_archer_die");
                            //         }, 750);
                            //     }, 4000);
                            // }, 8000);
                            elem.setAnimation(skin.name, dragon);
                        }
                    } else {
                        if (skin.class == "elf_fighter" && elem.person.class == "fighter") {
                            var dragon = new DragonAnimationUpdate(
                                this.loader.get(skin.src_json),
                                skin.cahce_image,
                                skin.name,
                                elem
                            );
                            dragon.updateCanvas(elem.domPerson);
                            if (skin.name == "elf_fighter_default") {
                                dragon.play();
                            }
                            elem.setAnimation(skin.name, dragon);
                        }
                        if (skin.class == "elf_archer" && elem.person.class == "archer") {
                            var dragon = new DragonAnimationUpdate(
                                this.loader.get(skin.src_json),
                                skin.cahce_image,
                                skin.name,
                                elem
                            );
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
    }
    contactPersons = (event) => {
        let canvas_enemy = event.target,
            img = this.loader.get(event.target.getAttribute("data-image"));

        if (typeof this.canvas != "undefined") {
            let id_person = parseInt(this.canvas.getAttribute("data-id")),
                id_enemy = parseInt(canvas_enemy.getAttribute("data-id")),
                unit: any = this.person_collection.getPersonById(id_person)[0],
                enemy = this.person_collection.getPersonById(id_enemy)[0];
            console.log("contactPersons", unit, enemy, id_enemy);

            if (this.getDistanceBetweenUnits(unit, enemy) > 2 && unit.person.class == "fighter") {
                alert("Бойцы ближнего боя могут атаковать только по прямойв радиусе 2х клеток");
                return;
            }
            if (this.getDistanceBetweenUnits(unit, enemy) > 4) {
                alert("Режим Леголаса отменен. Лучники могут атаковать только в радиусе 4х клеток");
                return;
            } else {
                if (unit.person.class == "archer" && !(unit.x == enemy.x || enemy.y == unit.y)) {
                    alert("Лучники могут атаковать только по прямой");
                    return;
                }
            }
            console.log("cache_set_atacke_units", this.cache_set_atacke_units);
            if (this.checkUnitAction(this.cache_set_atacke_units, unit)) {
                alert("За этот ход вы уже кого-то побили.");
                return;
            }
            this.cache_set_atacke_units.push(unit);
            if (unit.person.class == "fighter") {
                unit.stopAnimation("elf_fighter_default");
                unit.playAnimation("elf_fighter_atacke");

                // animation.stop();
                setTimeout(() => {
                    unit.stopAnimation("elf_fighter_atacke");
                    unit.playAnimation("elf_fighter_default");
                }, 750);
            }
            if (unit.person.class == "archer") {
                unit.stopAnimation("elf_archer_default");
                unit.playAnimation("elf_archer_atacke");

                // animation.stop();
                setTimeout(() => {
                    unit.stopAnimation("elf_archer_atacke");
                    unit.playAnimation("elf_archer_default");
                }, 750);
            }
            this.view.contactPersonsView(canvas_enemy, img, unit.person.damage);
        }
    };
    onChangePerson = (event) => {
        let canvas = event.target;
        console.log("onChangePerson", canvas);
        if (this.canvas != undefined) {
            this.view.clearPrev(this.canvas, this.loader);
        }
        this.chosePerson = true;

        this.view.changePersonView(canvas, this.loader);

        this.canvas = canvas;

        this.view.showAvailabeMovies(this.canvas);
    };
    renderAiPerson() {}
}
