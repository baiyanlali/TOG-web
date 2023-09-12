import Phaser from "./lib/phaser.js";
import { find, get_file, sleep, slice } from "./utils.js";
import { outputs } from "./outputs.js";

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
        this.load.image('floor', 'images/oryx/backLBrown.png')
        this.load.image('gold', 'images/oryx/gold2.png')
        this.load.image('diamond', 'images/oryx/diamond1.png')
        this.load.image('treasure', 'images/oryx/treasure1.png')
        this.load.image('chest', 'images/oryx/treasure2.png')
        this.load.image('trapchest', 'images/oryx/treasure2.png')
        this.load.image('shovel', 'images/oryx/pickaxe.png')
        this.load.image('avatar', 'images/oryx/axeman1.png')
        this.load.image('nokey', 'images/oryx/axeman1.png')
        this.load.image('shovel nokey', 'images/oryx/axeman1.png')
        this.load.image('withkey', 'images/oryx/axeman1.png')
        this.load.image('monsterQuick', 'images/oryx/bat1.png')
        this.load.image('monsterNormal', 'images/oryx/spider2.png')
        this.load.image('monsterSlow', 'images/oryx/scorpion1.png')
        this.load.image('monsterChest', 'images/oryx/trapChest1.png')
        this.load.image('wall', 'images/oryx/dirtWall_0.png')
        this.load.image('key', 'images/oryx/key2.png')
    }

    create() {
        this.images = []
        this.buildLevel(init_level, {})

        // let prob_txt = play[0]["probs"][0]
        // prob_txt = prob_txt.map(m=>m.toFixed(2)).join("<br>")
        this.updateProbInfo()
        // document.getElementById("probs").innerHTML = prob_txt
        document.getElementById("next_step").onclick = () => {
            this.nextStep()
        }

        // document.getElementById("stop_play").hidden = true
        document.getElementById("stop_play").style.display = "none"

        document.getElementById("auto_play").onclick = async () => {
            document.getElementById("stop_play").style.display = "inline-block"
            document.getElementById("auto_play").style.display = "none"

            while (this.autoPlayStop === false) {
                await sleep(500)
                this.nextStep()
            }

            this.autoPlayStop = false
            document.getElementById("auto_play").style.display = "inline-block"
            document.getElementById("stop_play").style.display = "none"
        }

        document.getElementById("stop_play").onclick = () => {
            this.autoPlayStop = true
        }

        onSetup(this)
    }

    autoPlayStop = false

    change = false

    update(time, delta) {
        if (!this.change) return

        this.change = false
        let curr_play = play[this.index % play.length]
        this.clear()
        this.buildLevel(curr_play["map"], curr_play)
        this.updateProbInfo()
    }

    nextStep() {
        this.index++
        this.change = true
    }

    updateProbInfo() {
        const prob_txt = play[this.index % play.length]["probs"][0]
        const raw_txt = play[this.index % play.length]["raw_val"][0]
        const map_arr = this.parseLevel(play[this.index % play.length]["map"])
        const [row, column] = [map_arr.length, map_arr[0].length]
        // const [x, y] = find(map_arr, 'nokey')
        // // console.log(`position: ${[x, y]}`)
        // if (x === -1 || y === -1) {
        //     return
        // }

        if (this.outputs) {
            this.outputs.setValue(prob_txt.map(m => parseFloat(m).toFixed(1)), raw_txt.map(m => parseFloat(m).toFixed(1)), map_arr)
            // this.outputs.Actions = prob_txt.map(m => m.toFixed(1))
            // this.outputs.Actions2 = raw_txt.map(m => m.toFixed(1))
            // this.outputs.map = map_arr
        }
    }

    buildLevel(level_str, curr_play) {
        this.images = []
        const levels = this.parseLevel(level_str)
        curr_play['array'] = levels
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < levels[i].length; j++) {
                this.add.image(j * 10, i * 10, "floor").setDisplayOrigin(0, 0).setDisplaySize(10, 10)
                if (levels[i][j] === "") continue

                if (levels[i][j] === "shovel nokey") {
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
    parent: document.getElementById("gamePreview")
}
const game = new Phaser.Game(config)

function onSetup(scene) {
    scene.outputs = new p5(outputs)
    scene.nextStep()
}
