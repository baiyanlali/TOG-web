import Phaser from "./lib/phaser.js";
import {get_file, sleep} from "./utils.js";
import {outputs} from "./outputs.js";

const updateRate = 1

const ele =
['floor',
'gold',
'diamond',
'treasure',
'chest',
'trapchest',
'shovel',
'avatar',
'nokey',
'withkey',
'monsterQuick',
'monsterNormal',
'monsterSlow',
'monsterChest',
'wall',
'key',
'shovel nokey']

const init_level =
    "wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall\n" +
    "wall,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,wall\n" +
    "wall,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,diamond,wall\n" +
    "wall,,,,,monsterSlow,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,monsterSlow,,,,,,,,,,,,monsterNormal,,,,,,trapchest,,wall\n" +
    "wall,,,,,,,,,monsterNormal,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,key,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,chest,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,nokey,,,,,,,,,,,,,,,,,,,,,,,,,wall\n" +
    "wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall"

const play = await get_file("./web/lv_0_play_0.json")

export class GameScene extends Phaser.Scene {

    level = ""

    images = []

    index = 0

    outputs = null

    constructor() {
        super();
    }

    parseLevel(level_str) {
        const rows = level_str.split(/\n/)
        return rows.map(row => row.split(/,/))
    }

    preload() {
        this.load.image('floor', 'oryx/backLBrown.png')
        this.load.image('gold', 'oryx/gold2.png')
        this.load.image('diamond', 'oryx/diamond1.png')
        this.load.image('treasure', 'oryx/treasure1.png')
        this.load.image('chest', 'oryx/treasure2.png')
        this.load.image('trapchest', 'oryx/treasure2.png')
        this.load.image('shovel', 'oryx/pickaxe.png')
        this.load.image('avatar', 'oryx/axeman1.png')
        this.load.image('nokey', 'oryx/axeman1.png')
        this.load.image('shovel nokey', 'oryx/axeman1.png')
        this.load.image('withkey', 'oryx/axeman1.png')
        this.load.image('monsterQuick', 'oryx/bat1.png')
        this.load.image('monsterNormal', 'oryx/spider2.png')
        this.load.image('monsterSlow', 'oryx/scorpion1.png')
        this.load.image('monsterChest', 'oryx/trapChest1.png')
        this.load.image('wall', 'oryx/dirtWall_0.png')
        this.load.image('key', 'oryx/key2.png')
    }

    create() {
        this.images = []
        this.buildLevel(init_level)

        // let prob_txt = play[0]["probs"][0]
        // prob_txt = prob_txt.map(m=>m.toFixed(2)).join("<br>")
        this.updateProbInfo()
        // document.getElementById("probs").innerHTML = prob_txt
        document.getElementById("next_step").onclick = ()=>{
            this.nextStep()
        }

        document.getElementById("stop_play").hidden = true

        document.getElementById("auto_play").onclick = async () => {
            document.getElementById("stop_play").hidden = false
            document.getElementById("auto_play").hidden = true

            while(this.autoPlayStop===false){
                await sleep(1000)
                this.nextStep()
            }

            this.autoPlayStop = false
            document.getElementById("auto_play").hidden = false
            document.getElementById("stop_play").hidden = true
        }

        document.getElementById("stop_play").onclick = () => {
            this.autoPlayStop = true
        }

        onSetup(this)
    }

    autoPlayStop = false

    change = false

    update(time, delta) {
        if(!this.change) return

        this.change = false
        let curr_play = play[this.index % play.length]
        this.clear()
        this.buildLevel(curr_play["map"])
        this.updateProbInfo()
    }

    nextStep(){
        this.index ++
        this.change = true

    }

    updateProbInfo(){
        let prob_txt = play[this.index % play.length]["probs"][0]

        if(this.outputs){
            this.outputs.Actions = prob_txt.map(m=>m.toFixed(1))
        }

        // prob_txt = prob_txt.map(m=>m.toFixed(2)).join("<br>")
        // document.getElementById("probs").innerHTML = prob_txt
    }

    buildLevel(level_str) {
        this.images = []
        const levels = this.parseLevel(level_str)
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < levels[i].length; j++) {
                this.add.image(j * 10, i * 10, "floor").setDisplayOrigin(0, 0).setDisplaySize(10, 10)
                if (levels[i][j] === "") continue

                if(levels[i][j] === "shovel nokey"){
                    let img = this.add.image(j * 10, i * 10, "nokey").setDisplayOrigin(0, 0).setDisplaySize(10, 10)
                    this.images.push(img)
                    img = this.add.image(j * 10, i * 10, "shovel").setDisplayOrigin(0, 0).setDisplaySize(10, 10)
                    this.images.push(img)
                    continue
                }

                let img = this.add.image(j * 10, i * 10, levels[i][j]).setDisplayOrigin(0, 0).setDisplaySize(10, 10)
                this.images.push(img)
            }
        }
    }

    clear() {
        for (const image of this.images) {
            image.destroy()
        }
        this.images = []
    }

}

let scale_factor = 1
const config = {
    width: 270,
    height: 150,
    type: Phaser.AUTO,
    pixelArt: true,
    scene: GameScene,
    backgroundColor: "#6d8ffc",
}
const game = new Phaser.Game(config)

function onSetup(scene) {
    scene.outputs = new p5(outputs)
    console.log(scene)
}