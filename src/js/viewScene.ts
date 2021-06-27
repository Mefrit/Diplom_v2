import { DragonAnimationUpdate } from "./lib/dragon";
// new DragonAnimationUpdate(result.data, element.children, obj.name);
export class ViewScene {
    arrObjPersons: any;
    loader: any;
    constructor(arrObjPlayers, loader) {
        this.arrObjPersons = arrObjPlayers;
        this.loader = loader;
    }

    renderPlayer = (cnvsElem, elem, img) => {
        let ctx;
        cnvsElem.style.position = "absolute";
        cnvsElem.classList.add("person");
        if (elem.person.evil) {
            cnvsElem.classList.add("ai");
        } else {
            cnvsElem.classList.add("players");
        }
        cnvsElem.setAttribute("data-image", elem.person.url);
        cnvsElem.setAttribute("data-id", elem.person.id);

        cnvsElem.style.top = elem.y * 120 + "px";
        cnvsElem.style.left = elem.x * 120 + "px";
        cnvsElem.style.width = 120 + "px";
        cnvsElem.style.height = 130 + "px";

        ctx = cnvsElem.getContext("2d");

        this.drawImage(ctx, img);
        this.changeHealth(ctx, elem);
        return cnvsElem;
    };
    renderElement = (element) => {
        element.domPerson.style.left = element.getX() * 120 + "px";
        element.domPerson.style.top = element.getY() * 120 + "px";
        // element.style.left = pos_dif_x + "px";
        // element.style.top = pos_dif_y + "px";
    };
    changeHealth = (ctx, elem, damage = 0) => {
        let obj, img;
        this.arrObjPersons.getCollection().forEach((elemCollection) => {
            if (elemCollection.getId() == elem.person.id) {
                obj = elemCollection;
            }
        });
        if (damage > 0) {
            if (typeof obj != "undefined") {
                if (obj.getHealth() >= 5) {
                    obj.setHealth(obj.getHealth() - damage);
                }
            }
        }
    };
    contactPersonsView = (canvas, img, damage = 5) => {
        let ctx = canvas.getContext("2d"),
            id;
        ctx.beginPath();
        ctx.clearRect(0, 0, 1000, 1000);
        this.drawImage(ctx, img);
        id = { id: canvas.getAttribute("data-id") };
        canvas.classList.add("person-atacked");
        setTimeout(() => {
            canvas.classList.remove("person-atacked");
        }, 900);
        this.changeHealth(ctx, { person: id }, damage);
    };
    drawImage(ctx, img) {
        let width, height, coef;
        if (img) {
            if (img.width > 200) {
                coef = 150 / parseFloat(img.width);
                width = img.width * coef;
                height = img.height * coef;
            } else {
                width = img.width;
                height = img.height;
            }

            ctx.drawImage(img, 0, 0, width + 150, height);
            ctx.scale(-1, 1);
            ctx.restore();
        } else {
            console.log("fail in load image");
        }

        return ctx;
    }
    renderDragon(name) {
        //
        // new DragonAnimationUpdate(result.data, element.children, name);
    }
    clearPrev(canvas, loader) {
        let ctx = canvas.getContext("2d"),
            img,
            width;
        ctx.clearRect(0, 0, 1000, 1000);
        img = loader.get(canvas.getAttribute("data-image"));
        this.drawImage(ctx, img);
    }
    changePersonView(canvas, loader) {
        let ctx = canvas.getContext("2d"),
            id,
            img;

        ctx.fillStyle = "coral"; // меняем цвет рамки
        ctx.fillRect(0, 0, 1000, 1000);
        img = loader.get(canvas.getAttribute("data-image"));
        this.drawImage(ctx, img);
        id = { id: canvas.getAttribute("data-id") };
        this.changeHealth(ctx, { person: id });
    }
    showAvailabeMovies(canvas) {
        let posX = canvas.style.left.split("px")[0],
            posY = canvas.style.top.split("px")[0],
            arrBlocks: any = document.getElementsByClassName("sence__block"),
            radius,
            posXblock,
            posYblock;

        radius = Math.sqrt(posX * posX + posY * posY);
        arrBlocks = [].slice.call(arrBlocks);

        arrBlocks.forEach((element) => {
            posXblock = element.style.left.split("px")[0];
            posYblock = element.style.top.split("px")[0];
        });
    }
    renderBlockView(block, posX, posY, i, j) {
        block.setAttribute("data-coord", i + ";" + j);
        block.classList.add("sence__block");
        block.style.left = posX + "px";
        block.style.top = posY + "px";
        let random = this.randomInteger(0, 40);
        block.src = "images/block3.png";

        // if (i == 6 && j == 3) {
        //     block.src = "images/block3.png";
        // }
        // if (i == 7 && j == 7) {
        //     block.src = "images/block1.png";
        // }
        // if (i == 7 && j == 6) {
        //     block.src = "images/block1.png";
        // }
        // if (i == 7 && j == 1) {
        //     block.src = "images/block4.png";
        // }
        // if (i == 6 && j == 3) {
        //     block.src = "images/block1.png";
        // }
        block.src = "images/block2.png";
        if (random < 20) {
            block.src = "images/block3.png";
        }
        // if (random >= 7 && random <= 23) {
        //     block.src = "images/block2.png";
        // }
        // if (random == 39) {
        //     block.src = "images/block1.png";
        // }
        // if (random == 40) {
        //     block.src = "images/block4.png";
        // }
        if (i == 8 && j == 1) {
            block.src = "images/block1.png";
        }
        if (i == 4 && j == 3) {
            block.src = "images/block4.png";
        }
        if (i == 4 && j == 3) {
            block.src = "images/block4.png";
        }
        if (i == 4 && j == 2) {
            block.src = "images/block4.png";
        }
        if (i == 4 && j == 1) {
            block.src = "images/block4.png";
        }
        if (i == 8 && j == 4) {
            block.src = "images/block4.png";
        }
        if (i == 8 && j == 5) {
            block.src = "images/block4.png";
        }
        if (i == 8 && j == 6) {
            block.src = "images/block4.png";
        }
        if (i == 5 && j == 7) {
            block.src = "images/block1.png";
        }
        if (i == 2 && j == 2) {
            block.src = "images/block1.png";
        }
        if (i == 7 && j == 5) {
            block.src = "images/block1.png";
        }
        if (i == 7 && j == 5) {
            block.src = "images/block1.png";
        }
        if (i == 2 && j == 5) {
            block.src = "images/block4.png";
        }
        return block;
    }
    randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    showCurentUnit(domPerson) {
        // Fix Me сделать адекватный выбор
        domPerson.classList.add("block__free");
    }
    disableCurentUnit(domPerson) {
        domPerson.classList.remove("block__free");
    }
}
