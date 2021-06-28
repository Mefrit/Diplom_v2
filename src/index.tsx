
import { Downloader } from "./js/loader";
import { Ai } from "./js/modules/ai";
import { Scene } from "./js/modules/scene";
// import { Persons } from './js/modules/personsController';
// import { Module } from "./components/modules/module";


let loader = new Downloader();
// to json
// FIX ME низя 1 фотку вставлять в несколько изображений
let arrPersons = [
    // { url: './images/person2.png', x: 1, y: 4, evil: true, class: 'fighter', damage: 15, health: 50, id: 0 },
    // { url: './images/person3.png', x: 3, y: 1, evil: true, class: 'fighter', damage: 14, health: 50, id: 1 },
    // { url: './images/hola2.png', x: 3, y: essssssssssssssses4, evil: false, class: 'fighter', damage: 12, health: 50, id: 2 },
    {
        url: "./images/hola_1.png",
        x: 11,
        y: 2,
        evil: false,
        class: "fighter",
        damage: 15,
        health: 95,
        id: 0,
    },
    {
        url: "./images/kind_archer2.png",
        x: 11,
        y: 4,
        evil: false,
        class: "archer",
        damage: 10,
        health: 60,
        id: 1,
    },
    {
        url: "./images/hola3.png",
        x: 11,
        y: 3,
        evil: false,
        class: "fighter",
        damage: 15,
        health: 95,
        id: 75,
    },
    {
        url: "./images/hola2.png",
        x: 11,
        y: 6,
        evil: false,
        class: "fighter",
        damage: 15,
        health: 95,
        id: 190,
    },
    {
        url: "./images/kind_archer.png",
        x: 11,
        y: 5,
        evil: false,
        class: "archer",
        damage: 10,
        health: 60,
        id: 33,
    },




    {
        url: "./images/vinny2.png",
        x: 0,
        y: 4,
        evil: true,
        class: "archer",
        damage: 11,
        health: 67,
        id: 6,
    },
    {
        url: "./images/vinny.png",
        x: 0,
        y: 3,
        evil: true,
        class: "archer",
        damage: 11,
        health: 63,
        id: 5,
    },
    {
        url: "./images/person2_2.png",
        x: 0,
        y: 2,
        evil: true,
        class: "fighter",
        damage: 15,
        health: 97,
        id: 4,
    },
    {
        url: "./images/person2_1.png",
        x: 0,
        y: 1,
        evil: true,
        class: "fighter",
        damage: 16,
        health: 97,
        id: 8,
    },

    {
        url: "./images/person2.png",
        x: 0,
        y: 0,
        evil: true,
        class: "fighter",
        damage: 16,
        health: 103,
        id: 7,
    },
];
let config_skins = [
    {
        class: "evil_fighter",
        children: [{
            src_json: "./images/dragon/knight1/knight1_atacke.json",
            src_images: [
                { name: "1_body_", path: "./images/dragon/knight1/images/1_body_.png" },
                { name: "1_head_", path: "./images/dragon/knight1/images/1_head_.png" },
                { name: "1_left_arm_", path: "./images/dragon/knight1/images/1_left_arm_.png" },
                { name: "1_left_lag_", path: "./images/dragon/knight1/images/1_left_lag_.png" },
                { name: "1_right_arm_", path: "./images/dragon/knight1/images/1_right_arm_.png" },
                { name: "1_right_lag_", path: "./images/dragon/knight1/images/1_right_lag_.png" },
                { name: "1_shield_", path: "./images/dragon/knight1/images/1_shield_.png" },
                { name: "1_spear_", path: "./images/dragon/knight1/images/1_spear_.png" }
            ],
            name: "atacke_fighter",
            class: "evil_fighter",
            scale: 0.8
        }, {
            src_json: "./images/dragon/knight1/knight1_default.json",
            src_images: [
                { name: "1_body_", path: "./images/dragon/knight1/images/1_body_.png" },
                { name: "1_head_", path: "./images/dragon/knight1/images/1_head_.png" },
                { name: "1_left_arm_", path: "./images/dragon/knight1/images/1_left_arm_.png" },
                { name: "1_left_lag_", path: "./images/dragon/knight1/images/1_left_lag_.png" },
                { name: "1_right_arm_", path: "./images/dragon/knight1/images/1_right_arm_.png" },
                { name: "1_right_lag_", path: "./images/dragon/knight1/images/1_right_lag_.png" },
                { name: "1_shield_", path: "./images/dragon/knight1/images/1_shield_.png" },
                { name: "1_spear_", path: "./images/dragon/knight1/images/1_spear_.png" }
            ],
            name: "default_fighter",
            class: "evil_fighter",
            scale: 0.8
        },
            , {
            src_json: "./images/dragon/knight1/knight1_die.json",
            src_images: [
                { name: "1_body_", path: "./images/dragon/knight1/images/1_body_.png" },
                { name: "1_head_", path: "./images/dragon/knight1/images/1_head_.png" },
                { name: "1_left_arm_", path: "./images/dragon/knight1/images/1_left_arm_.png" },
                { name: "1_left_lag_", path: "./images/dragon/knight1/images/1_left_lag_.png" },
                { name: "1_right_arm_", path: "./images/dragon/knight1/images/1_right_arm_.png" },
                { name: "1_right_lag_", path: "./images/dragon/knight1/images/1_right_lag_.png" },
                { name: "1_shield_", path: "./images/dragon/knight1/images/1_shield_.png" },
                { name: "1_spear_", path: "./images/dragon/knight1/images/1_spear_.png" }
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
                src_json: "./images/dragon/evil_archer/evil_archer_die.json",
                src_images: [
                    { name: "quiver", path: "./images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "evil_archer_die",
                class: "evil_archer",
                scale: 0.8
            },
            {
                src_json: "./images/dragon/evil_archer/evil_archer_atacke.json",
                src_images: [
                    { name: "quiver", path: "./images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "atacke_archer",
                class: "evil_archer",
                scale: 0.8
            },
            {
                class: "evil_archer",
                src_json: "./images/dragon/evil_archer/evil_archer_default.json",
                src_images: [
                    { name: "quiver", path: "./images/dragon/evil_archer/images/quiver.png" },
                    { name: "3_left_leg", path: "./images/dragon/evil_archer/images/3_left_leg.png" },
                    { name: "3_left_arm", path: "./images/dragon/evil_archer/images/3_left_arm.png" },
                    { name: "3_head", path: "./images/dragon/evil_archer/images/3_head.png" },
                    { name: "aкrow", path: "./images/dragon/evil_archer/images/aкrow.png" },
                    { name: "3_right_arm_2", path: "./images/dragon/evil_archer/images/3_right_arm_2.png" },
                    { name: "3_right_arm_1", path: "./images/dragon/evil_archer/images/3_right_arm_1.png" },
                    { name: "3_body", path: "./images/dragon/evil_archer/images/3_body.png" },
                    { name: "3_right_leg", path: "./images/dragon/evil_archer/images/3_right_leg.png" },
                    { name: "bow_2", path: "./images/dragon/evil_archer/images/bow_2.png" }
                ],
                name: "default_archer",
                scale: 0.8
            }]
    },
    {
        class: "elf_fighter",
        children: [
            {
                src_json: "./images/dragon/elf_fighter/elf_fighter_die.json",
                src_images: [
                    { name: "2_leg_left", path: "./images/dragon/elf_fighter/images/2_leg_left.png" },
                    { name: "2_leg_right", path: "./images/dragon/elf_fighter/images/2_leg_right.png" },
                    { name: "2_arm_left", path: "./images/dragon/elf_fighter/images/2_arm_left.png" },

                    { name: "2_body", path: "./images/dragon/elf_fighter/images/2_body.png" },
                    { name: "2_head", path: "./images/dragon/elf_fighter/images/2_head.png" },
                    { name: "sword", path: "./images/dragon/elf_fighter/images/sword.png" },
                    { name: "2_arm_right", path: "./images/dragon/elf_fighter/images/2_arm_right.png" },
                ],
                name: "elf_fighter_die",
                class: "elf_fighter",
                scale: 0.8
            },
            {
                class: "elf_fighter",
                src_json: "./images/dragon/elf_fighter/elf_fighter_default.json",
                src_images: [
                    { name: "2_leg_left", path: "./images/dragon/elf_fighter/images/2_leg_left.png" },
                    { name: "2_leg_right", path: "./images/dragon/elf_fighter/images/2_leg_right.png" },
                    { name: "2_arm_left", path: "./images/dragon/elf_fighter/images/2_arm_left.png" },

                    { name: "2_body", path: "./images/dragon/elf_fighter/images/2_body.png" },
                    { name: "2_head", path: "./images/dragon/elf_fighter/images/2_head.png" },
                    { name: "sword", path: "./images/dragon/elf_fighter/images/sword.png" },
                    { name: "2_arm_right", path: "./images/dragon/elf_fighter/images/2_arm_right.png" },


                ],
                name: "elf_fighter_default",
                scale: 0.8
            },
            {
                class: "elf_fighter",
                src_json: "./images/dragon/elf_fighter/elf_fighter_atacke.json",
                src_images: [
                    { name: "2_leg_left", path: "./images/dragon/elf_fighter/images/2_leg_left.png" },
                    { name: "2_leg_right", path: "./images/dragon/elf_fighter/images/2_leg_right.png" },
                    { name: "2_arm_left", path: "./images/dragon/elf_fighter/images/2_arm_left.png" },

                    { name: "2_body", path: "./images/dragon/elf_fighter/images/2_body.png" },
                    { name: "2_head", path: "./images/dragon/elf_fighter/images/2_head.png" },
                    { name: "sword", path: "./images/dragon/elf_fighter/images/sword.png" },
                    { name: "2_arm_right", path: "./images/dragon/elf_fighter/images/2_arm_right.png" },


                ],
                name: "elf_fighter_atacke",
                scale: 0.8
            }]
    },
    {
        class: "elf_archer",
        children: [
            {
                src_json: "./images/dragon/elf_archer/elf_archer_die.json",
                src_images: [
                    { name: "1_quiver", path: "./images/dragon/elf_archer/images/1_quiver.png" },
                    { name: "1_hand_right", path: "./images/dragon/elf_archer/images/1_hand_right.png" },
                    { name: "1_arm_right", path: "./images/dragon/elf_archer/images/1_arm_right.png" },
                    { name: "1_leg_right", path: "./images/dragon/elf_archer/images/1_leg_right.png" },
                    { name: "1_leg_left", path: "./images/dragon/elf_archer/images/1_leg_left.png" },
                    { name: "1_body", path: "./images/dragon/elf_archer/images/1_body.png" },
                    { name: "1_head", path: "./images/dragon/elf_archer/images/1_head.png" },
                    { name: "arrow", path: "./images/dragon/elf_archer/images/arrow.png" },
                    { name: "1_bow1", path: "./images/dragon/elf_archer/images/1_bow1.png" },
                    { name: "1_hand_left", path: "./images/dragon/elf_archer/images/1_hand_left.png" },
                    { name: "1_arm_left", path: "./images/dragon/elf_archer/images/1_arm_left.png" },
                ],
                name: "elf_archer_die",
                class: "elf_archer",
                scale: 0.8
            },
            {
                class: "elf_archer",
                src_json: "./images/dragon/elf_archer/elf_archer_default.json",
                src_images: [
                    { name: "1_quiver", path: "./images/dragon/elf_archer/images/1_quiver.png" },
                    { name: "1_hand_right", path: "./images/dragon/elf_archer/images/1_hand_right.png" },
                    { name: "1_arm_right", path: "./images/dragon/elf_archer/images/1_arm_right.png" },
                    { name: "1_leg_right", path: "./images/dragon/elf_archer/images/1_leg_right.png" },
                    { name: "1_leg_left", path: "./images/dragon/elf_archer/images/1_leg_left.png" },
                    { name: "1_body", path: "./images/dragon/elf_archer/images/1_body.png" },
                    { name: "1_head", path: "./images/dragon/elf_archer/images/1_head.png" },
                    { name: "arrow", path: "./images/dragon/elf_archer/images/arrow.png" },
                    { name: "1_bow1", path: "./images/dragon/elf_archer/images/1_bow1.png" },
                    { name: "1_hand_left", path: "./images/dragon/elf_archer/images/1_hand_left.png" },
                    { name: "1_arm_left", path: "./images/dragon/elf_archer/images/1_arm_left.png" },


                ],
                name: "elf_archer_default",
                scale: 0.8
            },
            {
                class: "elf_archer",
                src_json: "./images/dragon/elf_archer/elf_archer_atacke.json",
                src_images: [
                    { name: "1_quiver", path: "./images/dragon/elf_archer/images/1_quiver.png" },
                    { name: "1_hand_right", path: "./images/dragon/elf_archer/images/1_hand_right.png" },
                    { name: "1_arm_right", path: "./images/dragon/elf_archer/images/1_arm_right.png" },
                    { name: "1_leg_right", path: "./images/dragon/elf_archer/images/1_leg_right.png" },
                    { name: "1_leg_left", path: "./images/dragon/elf_archer/images/1_leg_left.png" },
                    { name: "1_body", path: "./images/dragon/elf_archer/images/1_body.png" },
                    { name: "1_head", path: "./images/dragon/elf_archer/images/1_head.png" },
                    { name: "arrow", path: "./images/dragon/elf_archer/images/arrow.png" },
                    { name: "1_bow1", path: "./images/dragon/elf_archer/images/1_bow1.png" },
                    { name: "1_hand_left", path: "./images/dragon/elf_archer/images/1_hand_left.png" },
                    { name: "1_arm_left", path: "./images/dragon/elf_archer/images/1_arm_left.png" },
                ],
                name: "elf_archer_atacke",
                scale: 0.8
            }]
    }
];
class Director {
    scene: any;
    ai: any;
    persController: any;
    loader: any;
    arrPersons: any;
    mode: string;
    config_skins: any;
    constructor(loader, arrPersons, config_skins) {
        this.ai = new Ai([]);
        this.loader = loader;
        this.arrPersons = arrPersons;
        this.config_skins = config_skins;
        // this.scene = new Scene(this.loader, arrPersons, this.config_skins, this.ai);

        // this.ai.initScene(this.scene);
        this.start();

    }
    setAdvancedMode = (ev) => {
        this.mode = "advanced";
        this.startGame("advanced");
    }
    setDefaultMode = (ev) => {
        this.mode = "default";
        this.startGame("default")
    }
    startGame = (mode) => {
        let arrPersons = this.arrPersons, delete_unit = false, tmp;
        if (mode == "advanced") {
            arrPersons.forEach(elem => {

                if (elem.class == "fighter" && !elem.evil && !delete_unit) {
                    delete_unit = true;
                    elem.health = 10;

                }
            });

            arrPersons = this.arrPersons
        }


        this.scene = new Scene(this.loader, arrPersons, this.config_skins, this.ai);

        this.ai.initScene(this.scene);
        document.getElementById('parent_popup').style.display = 'none'
    }
    start() {

        let default_btn = document.getElementById("default");
        let advanced_btn = document.getElementById("advanced");
        let play = document.getElementById("play_btn");

        advanced_btn.addEventListener("click", this.setAdvancedMode);
        default_btn.addEventListener("click", this.setDefaultMode);

        play.addEventListener("click", this.startAI);
        document.getElementById("container").appendChild(play);
    }
    // deleteOneUser(){}
    startAI = () => {
        this.scene.removeCacheUnits();
        this.ai.step();
    };
}
new Director(loader, arrPersons, config_skins);
