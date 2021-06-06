import { Person } from "./person";
import { ViewScene } from "../viewScene";
import { Collection } from "./person_collection";
import { DragonAnimationUpdate } from "../lib/dragon";
export class Scene {
    loader: any;
    canvas: any;
    ai: any;
    arrImg: object[];
    collectionPersons: any;
    chosePerson: boolean;
    curentPerson: any;
    view: any;
    config_skins: any;
    skins: any;
    constructor(loader, arrImg, config_skins, ai) {
        this.loader = loader;
        this.chosePerson = false;
        this.skins = {};
        this.config_skins = config_skins;
        this.collectionPersons = new Collection(arrImg);
        //  arrImg.map(elem => {
        //     return new Person(elem);
        // });
        this.view = new ViewScene(this.collectionPersons, this.loader);
        this.curentPerson = undefined;

        this.ai = ai;
        this.ai.initView(this.view);
        this.ai.initPersons(this.collectionPersons, this.syncUnit);
        this.play();
    }
    getCoordFromStyle(elem) {
        return parseInt(elem.split("px")[0]);
    }
    getPerson() {
        return this.collectionPersons;
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
            document.getElementById("block_information").innerHTML =
                "<h1>x:" +
                this.getCoordFromStyle(block.style.left) / 120 +
                " y:" +
                this.getCoordFromStyle(block.style.top) / 120 +
                "</h1>";

            if (posX < 190 && posY < 190) {
                block.classList.add("block__free");
            } else {
                block.classList.add("block__nonFree");
            }
        }
    };
    syncUnit = (data) => {
        this.collectionPersons = data;
    };
    onOutBlock = (event) => {
        event.target.classList.remove("block__free");
        event.target.classList.remove("block__nonFree");
    };
    onMove = (event) => {
        let posX = event.target.style.left,
            posY = event.target.style.top,
            activePerson = [];
        //условие что можно ходить в область

        if (true) {
            this.canvas.style.left = parseInt(posX.split("px")[0]) + 18 + "px";
            this.canvas.style.top = posY;
        }
        activePerson = this.collectionPersons.getCollection().filter((elem: any) => {
            if (elem.getId() == this.canvas.getAttribute("data-id")) {
                elem.setCoord(parseInt(posX.split("px")) / 120, parseInt(posY.split("px")) / 120);

                elem.setMoveAction(true);
            }
            if (!elem.getMoveAction() && !elem.getKind()) {
                return elem;
            }
        });
        if (activePerson.length == 0) {
            // optimizase
            this.collectionPersons.getCollection().forEach((elem: any) => {
                if (!elem.getKind()) {
                    elem.setMoveAction(false);
                }
            });
            setTimeout(() => {
                // this.ai.step();
            }, 200);
        }
    };
    renderElement(element) {
        this.view.renderElement(element);
    }
    renderArena() {
        let scence = document.getElementById("scene"),
            block,
            posX = 0,
            posY = 0;
        for (let j = 0; j < 7; j++) {
            for (let i = 0; i < 12; i++) {
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
    }
    setAIperson() {}
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
        this.loader.loadElement("./src/images/rip.png");
        this.loader.load(this.collectionPersons);
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

            this.collectionPersons.collection.forEach((elem: any) => {
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
                    // if (elem.person.evil) {
                    //     console.log("ele11111m", skin, elem);
                    //     var dragon = new DragonAnimationUpdate(
                    //         this.loader.get(skin.src_json),
                    //         skin.cahce_image,
                    //         skin.name,
                    // elem.person.id
                    //     );
                    //     if (skin.class == "evil_fighter" && elem.person.class == "fighter") {
                    //         dragon.show();
                    //         dragon.updateCanvas(elem.domPerson);
                    //         if (skin.name == "default_fighter" && elem.person.class == "fighter") {
                    //             dragon.play();
                    //         }
                    //         elem.setAnimation(skin.name, dragon);
                    //     }
                    // }
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
                            elem.setAnimation(skin.name, dragon);
                        }
                        if (skin.class == "evil_archer" && elem.person.class == "archer") {
                            // console.log("ele11111m", skin, elem);
                            // console.log("skin.cahce_image", skin.cahce_image);
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
                            console.log("ele11111m", skin, elem);
                            console.log("skin.cahce_image", skin.cahce_image);
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
                    // var dragon = new DragonAnimationUpdate(result.data, element.children, obj.name);
                    // dragon.show();
                    // dragon;
                });

                // elem.initDragonAnimatoin();
                elem.initImage(img);
                document.getElementById("scene").appendChild(cnvsElem);
            });
        });
    }
    contactPersons = (event) => {
        let canvas = event.target,
            img = this.loader.get(event.target.getAttribute("data-image"));
        this.view.contactPersonsView(canvas, img);
    };
    onChangePerson = (event) => {
        let canvas = event.target;

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
