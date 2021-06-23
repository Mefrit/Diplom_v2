import * as React from "react";
import * as ReactDOM from "react-dom";
import { Downloader } from "./js/loader";
import { Ai } from "./js/modules/ai";
import { Scene } from "./js/modules/scene";
// import { Persons } from './js/modules/personsController';
// import { Module } from "./components/modules/module";


let loader = new Downloader();
// to json
// FIX ME низя 1 фотку вставлять в несколько изображений
let arrPersons = [
    // { url: './src/images/person2.png', x: 1, y: 4, evil: true, class: 'fighter', damage: 15, health: 50, id: 0 },
    // { url: './src/images/person3.png', x: 3, y: 1, evil: true, class: 'fighter', damage: 14, health: 50, id: 1 },
    // { url: './src/images/hola2.png', x: 3, y: essssssssssssssses4, evil: false, class: 'fighter', damage: 12, health: 50, id: 2 },
    {
        url: "./src/images/hola_1.png",
        x: 6,
        y: 2,
        evil: false,
        class: "fighter",
        damage: 15,
        health: 20,
        id: 0,
    },
    {
        url: "./src/images/kind_archer2.png",
        x: 7,
        y: 4,
        evil: false,
        class: "archer",
        damage: 10,
        health: 50,
        id: 1,
    },
    {
        url: "./src/images/hola3.png",
        x: 6,
        y: 3,
        evil: false,
        class: "fighter",
        damage: 10,
        health: 30,
        id: 35,
    },
    // {
    //     url: "./src/images/hola2.png",
    //     x: 10,
    //     y: 2,
    //     evil: false,
    //     class: "fighter",
    //     damage: 10,
    //     health: 90,
    //     id: 190,
    // },
    // {
    //     url: "./src/images/kind_archer.png",
    //     x: 10,
    //     y: 5,
    //     evil: false,
    //     class: "archer",
    //     damage: 10,
    //     health: 20,
    //     id: 33,
    // },


    {
        url: "./src/images/vinny2.png",
        x: 3,
        y: 3,
        evil: true,
        class: "archer",
        damage: 5,
        health: 50,
        id: 6,
    },
    {
        url: "./src/images/vinny.png",
        x: 2,
        y: 3,
        evil: true,
        class: "archer",
        damage: 15,
        health: 50,
        id: 5,
    },
    // {
    //     url: "./src/images/person2_2.png",
    //     x: 1,
    //     y: 2,
    //     evil: true,
    //     class: "fighter",
    //     damage: 10,
    //     health: 50,
    //     id: 4,
    // },
    // {
    //     url: "./src/images/person2_1.png",
    //     x: 1,
    //     y: 1,
    //     evil: true,
    //     class: "fighter",
    //     damage: 10,
    //     health: 50,
    //     id: 8,
    // },

    // {
    //     url: "./src/images/person2.png",
    //     x: 2,
    //     y: 2,
    //     evil: true,
    //     class: "fighter",
    //     damage: 17,
    //     health: 80,
    //     id: 7,
    // },
];
let config_skins = [
    {
        class: "evil_fighter",
        children: [{
            src_json: "./src/images/dragon/knight1/knight1_atacke.json",
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
            name: "atacke_fighter",
            class: "evil_fighter",
            scale: 0.8
        }, {
            src_json: "./src/images/dragon/knight1/knight1_default.json",
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
            name: "default_fighter",
            class: "evil_fighter",
            scale: 0.8
        },
            , {
            src_json: "./src/images/dragon/knight1/knight1_die.json",
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
            name: "die_fighter",
            class: "evil_fighter",
            scale: 0.8
        }
        ]
    },
    {
        class: "evil_archer",
        children: [
            {
                src_json: "./src/images/dragon/evil_archer/evil_archer_die.json",
                src_images: [
                    { name: "quiver", path: "./src/images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./src/images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./src/images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./src/images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./src/images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./src/images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./src/images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./src/images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./src/images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./src/images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "evil_archer_die",
                class: "evil_archer",
                scale: 0.8
            },
            {
                src_json: "./src/images/dragon/evil_archer/evil_archer_atacke.json",
                src_images: [
                    { name: "quiver", path: "./src/images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./src/images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./src/images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./src/images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./src/images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./src/images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./src/images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./src/images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./src/images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./src/images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "atacke_archer",
                class: "evil_archer",
                scale: 0.8
            },
            {
                class: "evil_archer",
                src_json: "./src/images/dragon/evil_archer/evil_archer_default.json",
                src_images: [
                    { name: "quiver", path: "./src/images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./src/images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./src/images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./src/images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./src/images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./src/images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./src/images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./src/images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./src/images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./src/images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "default_archer",
                scale: 0.8
            }]
    },
    {
        class: "elf_fighter",
        children: [
            {
                src_json: "./src/images/dragon/elf_fighter/elf_fighter_die.json",
                src_images: [
                    { name: "2_leg_left", path: "./src/images/dragon/elf_fighter/images/2_leg_left.png" },
                    { name: "2_leg_right", path: "./src/images/dragon/elf_fighter/images/2_leg_right.png" },
                    { name: "2_arm_left", path: "./src/images/dragon/elf_fighter/images/2_arm_left.png" },

                    { name: "2_body", path: "./src/images/dragon/elf_fighter/images/2_body.png" },
                    { name: "2_head", path: "./src/images/dragon/elf_fighter/images/2_head.png" },
                    { name: "sword", path: "./src/images/dragon/elf_fighter/images/sword.png" },
                    { name: "2_arm_right", path: "./src/images/dragon/elf_fighter/images/2_arm_right.png" },
                ],
                name: "elf_fighter_die",
                class: "elf_fighter",
                scale: 0.8
            },
            {
                class: "elf_fighter",
                src_json: "./src/images/dragon/elf_fighter/elf_fighter_default.json",
                src_images: [
                    { name: "2_leg_left", path: "./src/images/dragon/elf_fighter/images/2_leg_left.png" },
                    { name: "2_leg_right", path: "./src/images/dragon/elf_fighter/images/2_leg_right.png" },
                    { name: "2_arm_left", path: "./src/images/dragon/elf_fighter/images/2_arm_left.png" },

                    { name: "2_body", path: "./src/images/dragon/elf_fighter/images/2_body.png" },
                    { name: "2_head", path: "./src/images/dragon/elf_fighter/images/2_head.png" },
                    { name: "sword", path: "./src/images/dragon/elf_fighter/images/sword.png" },
                    { name: "2_arm_right", path: "./src/images/dragon/elf_fighter/images/2_arm_right.png" },


                ],
                name: "elf_fighter_default",
                scale: 0.8
            }]
    },
    {
        class: "elf_archer",
        children: [
            {
                src_json: "./src/images/dragon/elf_archer/elf_archer_die.json",
                src_images: [
                    { name: "1_quiver", path: "./src/images/dragon/elf_archer/images/1_quiver.png" },
                    { name: "1_hand_right", path: "./src/images/dragon/elf_archer/images/1_hand_right.png" },
                    { name: "1_arm_right", path: "./src/images/dragon/elf_archer/images/1_arm_right.png" },
                    { name: "1_leg_right", path: "./src/images/dragon/elf_archer/images/1_leg_right.png" },
                    { name: "1_leg_left", path: "./src/images/dragon/elf_archer/images/1_leg_left.png" },
                    { name: "1_body", path: "./src/images/dragon/elf_archer/images/1_body.png" },
                    { name: "1_head", path: "./src/images/dragon/elf_archer/images/1_head.png" },
                    { name: "arrow", path: "./src/images/dragon/elf_archer/images/arrow.png" },
                    { name: "1_bow1", path: "./src/images/dragon/elf_archer/images/1_bow1.png" },
                    { name: "1_hand_left", path: "./src/images/dragon/elf_archer/images/1_hand_left.png" },
                    { name: "1_arm_left", path: "./src/images/dragon/elf_archer/images/1_arm_left.png" },
                ],
                name: "elf_archer_die",
                class: "elf_archer",
                scale: 0.8
            },
            {
                class: "elf_archer",
                src_json: "./src/images/dragon/elf_archer/elf_archer_default.json",
                src_images: [
                    { name: "1_quiver", path: "./src/images/dragon/elf_archer/images/1_quiver.png" },
                    { name: "1_hand_right", path: "./src/images/dragon/elf_archer/images/1_hand_right.png" },
                    { name: "1_arm_right", path: "./src/images/dragon/elf_archer/images/1_arm_right.png" },
                    { name: "1_leg_right", path: "./src/images/dragon/elf_archer/images/1_leg_right.png" },
                    { name: "1_leg_left", path: "./src/images/dragon/elf_archer/images/1_leg_left.png" },
                    { name: "1_body", path: "./src/images/dragon/elf_archer/images/1_body.png" },
                    { name: "1_head", path: "./src/images/dragon/elf_archer/images/1_head.png" },
                    { name: "arrow", path: "./src/images/dragon/elf_archer/images/arrow.png" },
                    { name: "1_bow1", path: "./src/images/dragon/elf_archer/images/1_bow1.png" },
                    { name: "1_hand_left", path: "./src/images/dragon/elf_archer/images/1_hand_left.png" },
                    { name: "1_arm_left", path: "./src/images/dragon/elf_archer/images/1_arm_left.png" },


                ],
                name: "elf_archer_default",
                scale: 0.8
            }]
    }
];
class Director {
    scene: any;
    ai: any;
    persController: any;
    constructor(loader, arrPersons) {
        this.ai = new Ai([]);
        this.scene = new Scene(loader, arrPersons, config_skins, this.ai);

        this.ai.initScene(this.scene);
        this.start();
    }
    start() {
        // let play = document.createElement("input");
        // play.type = "button";
        // play.classList.add("button");
        // play.value = "Ход соперника";
        let play = document.getElementById("play_btn");
        play.addEventListener("click", this.startAI);
        document.getElementById("container").appendChild(play);
    }
    startAI = () => {
        this.ai.step();
    };
}
new Director(loader, arrPersons);
