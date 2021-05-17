define(["require", "exports", "react", "react-dom", "./js/loader", "./js/modules/ai", "./js/modules/scene"], function (require, exports, React, ReactDOM, loader_1, ai_1, scene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ROOT = document.getElementById("root");
    ReactDOM.render(React.createElement("h1", null, "Hellen"), ROOT);
    var loader = new loader_1.ImageDownloader();
    var arrPersons = [
        {
            url: "./src/images/hola.png",
            x: 7,
            y: 2,
            evil: false,
            class: "fighter",
            damage: 10,
            health: 90,
            id: 0,
        },
        {
            url: "./src/images/vinny.png",
            x: 5,
            y: 3,
            evil: false,
            class: "archer",
            damage: 10,
            health: 80,
            id: 1,
        },
        {
            url: "./src/images/person3.jpg",
            x: 0,
            y: 0,
            evil: true,
            class: "fighter",
            damage: 10,
            health: 50,
            id: 4,
        },
        {
            url: "./src/images/vinny.png",
            x: 0,
            y: 1,
            evil: true,
            class: "archer",
            damage: 10,
            health: 50,
            id: 5,
        },
        {
            url: "./src/images/person.jpg",
            x: 0,
            y: 4,
            evil: true,
            class: "fighter",
            damage: 10,
            health: 50,
            id: 8,
        },
        {
            url: "./src/images/person3.png",
            x: 3,
            y: 2,
            evil: true,
            class: "archer",
            damage: 5,
            health: 50,
            id: 6,
        },
        {
            url: "./src/images/person.jpg",
            x: 3,
            y: 3,
            evil: true,
            class: "fighter",
            damage: 5,
            health: 50,
            id: 7,
        },
    ];
    var Director = (function () {
        function Director(loader, arrPersons) {
            var _this = this;
            this.startAI = function () {
                _this.ai.step();
            };
            this.ai = new ai_1.Ai([]);
            this.scene = new scene_1.Scene(loader, arrPersons, this.ai);
            this.ai.initScene(this.scene);
            this.start();
        }
        Director.prototype.start = function () {
            var play = document.createElement("input");
            play.type = "button";
            play.classList.add("button");
            play.value = "Ход соперника";
            play.addEventListener("click", this.startAI);
            document.getElementById("scene").appendChild(play);
        };
        return Director;
    }());
    new Director(loader, arrPersons);
});
