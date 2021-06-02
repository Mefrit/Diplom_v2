define(["require", "exports", "react", "react-dom", "./js/loader", "./js/modules/ai", "./js/modules/scene"], function (require, exports, React, ReactDOM, loader_1, ai_1, scene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ROOT = document.getElementById("root");
    ReactDOM.render(React.createElement("h1", null, "Hellen"), ROOT);
    var loader = new loader_1.Downloader();
    var arrPersons = [
        {
            url: "./src/images/hola_1.png",
            x: 8,
            y: 2,
            evil: false,
            class: "fighter",
            damage: 15,
            health: 100,
            id: 0,
        },
        {
            url: "./src/images/kind_archer2.png",
            x: 8,
            y: 3,
            evil: false,
            class: "archer",
            damage: 10,
            health: 80,
            id: 1,
        },
        {
            url: "./src/images/hola3.png",
            x: 6,
            y: 3,
            evil: false,
            class: "fighter",
            damage: 10,
            health: 80,
            id: 35,
        },
        {
            url: "./src/images/hola2.png",
            x: 6,
            y: 2,
            evil: false,
            class: "fighter",
            damage: 10,
            health: 90,
            id: 190,
        },
        {
            url: "./src/images/kind_archer.png",
            x: 10,
            y: 4,
            evil: false,
            class: "archer",
            damage: 10,
            health: 80,
            id: 33,
        },
        {
            url: "./src/images/vinny2.png",
            x: 3,
            y: 3,
            evil: true,
            class: "archer",
            damage: 19,
            health: 50,
            id: 6,
        },
        {
            url: "./src/images/vinny.png",
            x: 2,
            y: 3,
            evil: true,
            class: "archer",
            damage: 10,
            health: 50,
            id: 5,
        },
        {
            url: "./src/images/person2_2.png",
            x: 0,
            y: 0,
            evil: true,
            class: "fighter",
            damage: 10,
            health: 50,
            id: 4,
        },
        {
            url: "./src/images/person2_1.png",
            x: 0,
            y: 4,
            evil: true,
            class: "fighter",
            damage: 10,
            health: 50,
            id: 8,
        },
        {
            url: "./src/images/person2.png",
            x: 3,
            y: 4,
            evil: true,
            class: "fighter",
            damage: 7,
            health: 80,
            id: 7,
        },
    ];
    var config_skins = [
        {
            class: "evil_fighter",
            children: [{
                    src_json: "./src/images/dragon/knight1/knight1.json",
                    src_images: [
                        { name: "1_body_", path: "./src/images/dragon/knight1/images/1_body_.png" },
                        { name: "1_head_", path: "./src/images/dragon/knight1/images/1_head_.png" },
                        { name: "1_left_arm_", path: "./src/images/dragon/knight1/images/1_left_arm_.png" },
                        { name: "1_left_lag_", path: "./src/images/dragon/knight1/images/1_left_lag_.png" },
                        { name: "1_right_arm_", path: "./src/images/dragon/knight1/images/1_right_arm_.png" },
                        { name: "1_right_lag_", path: "./src/images/dragon/knight1/images/1_right_lag_.png" },
                        { name: "1_shield_", path: "./src/images/dragon/knight1/images/1_shield_.png" },
                        { name: "1_spear_", path: "./src/images/dragon/knight1/images/1_spear_.png" }
                    ],
                    name: "atacke",
                    scale: 0.8
                }]
        }
    ];
    var Director = (function () {
        function Director(loader, arrPersons) {
            var _this = this;
            this.startAI = function () {
                _this.ai.step();
            };
            this.ai = new ai_1.Ai([]);
            this.scene = new scene_1.Scene(loader, arrPersons, config_skins, this.ai);
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
