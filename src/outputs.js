import { slice, find, padding, minus, temperatureToColor } from "./utils.js"


const Unit = 24
const OriginalImageScale = 0.6
const GlobalImageScale = 0.3

export let outputs = (s) => {

    s.PartialMap = []
    s.GlobalMap = []

    s.Actions = [0, 0, 0, 0, 0, 0]
    s.ActionsTarget = [0, 0, 0, 0, 0, 0]

    s.Actions2 = [0, 0, 0, 0, 0, 0]
    s.Actions2Target = [0, 0, 0, 0, 0, 0]
    s.Actions2Diff = [0, 0, 0, 0, 0, 0]

    s.OutputName = ['stay', 'dig', 'left', 'right', 'down', 'up']

    s.tween = null
    s.tween2 = null

    // s.Positions = [[75, 25], [75, 75], [25, 75], [125, 75], [50, 125], [100, 125]]
    s.Positions = [
        [150, 25],
        [150, 75],
        [150, 125],
        [150, 175],
        [150, 225],
        [150, 275]
    ]

    s.Positions2 = [
        [0, 25],
        [0, 75],
        [0, 125],
        [0, 175],
        [0, 225],
        [0, 275]
    ]

    s.images = {}

    s.map = []

    s.resizeWhole = 1
    s.setup = () => {
        // let canvas = s.createCanvas(1500, 600)
        s.canvas = s.createCanvas(1500, 600)
        s.canvas.parent('gameSystem')
        s.parent = s.canvas.elt.parentElement
        const [height, width] = [s.parent.clientHeight, s.parent.clientWidth]
        s.resizeCanvas(width, 600 * width / 1500)
        s.resizeWhole = width / 1500 * 0.8


        s.tween = new TWEEN.Tween(s.Actions)
        s.tween2 = new TWEEN.Tween(s.Actions2)
    }

    s.windowResized = () => {
        const [height, width] = [s.parent.clientHeight, s.parent.clientWidth]
        s.resizeCanvas(width, 600 * width / 1500)
        s.resizeWhole = width / 1500 * 0.8
    }

    s.preload = () => {
        s.images['floor'] = s.loadImage('images/oryx/backLBrown.png')
        s.images['gold'] = s.loadImage('images/oryx/gold2.png')
        s.images['diamond'] = s.loadImage('images/oryx/diamond1.png')
        s.images['treasure'] = s.loadImage('images/oryx/treasure1.png')
        s.images['chest'] = s.loadImage('images/oryx/treasure2.png')
        s.images['trapchest'] = s.loadImage('images/oryx/treasure2.png')
        s.images['shovel'] = s.loadImage('images/oryx/pickaxe.png')
        s.images['avatar'] = s.loadImage('images/oryx/axeman1.png')
        s.images['nokey'] = s.loadImage('images/oryx/axeman1.png')
        s.images['shovel nokey'] = s.loadImage('images/oryx/axeman1.png')
        s.images['withkey'] = s.loadImage('images/oryx/axeman1.png')
        s.images['monsterQuick'] = s.loadImage('images/oryx/bat1.png')
        s.images['monsterNormal'] = s.loadImage('images/oryx/spider2.png')
        s.images['monsterSlow'] = s.loadImage('images/oryx/scorpion1.png')
        s.images['monsterChest'] = s.loadImage('images/oryx/trapChest1.png')
        s.images['wall'] = s.loadImage('images/oryx/dirtWall_0.png')
        s.images['key'] = s.loadImage('images/oryx/key2.png')
        s.images['black'] = s.loadImage('images/black.png')
        s.images['white'] = s.loadImage('images/white.png')
        s.images['l1'] = s.loadImage('images/l1.png')
        s.images['l2'] = s.loadImage('images/l2.png')
    }

    s.updateMap = () => {
        if (s.map.length === 0) return
        const [x, y] = find(s.map, 'nokey')
        s.PartialMap = slice(s.map, x - 3, x + 4, y - 3, y + 4)

        const [tx, ty] = [s.map.length * 2, s.map[0].length * 2]

        const [qx, qy] = [parseInt(tx / 2) - x, parseInt(ty / 2) - y]
        s.GlobalMap = padding(s.map, tx, ty, qx, qy, 'black')
    }

    s.updateActionInfo = (actions) => {
        s.Actions = actions
    }

    s.draw_game = (map, scale = 1, after_draw = (px, py) => { }) => {
        s.push()



        s.scale(scale)
        s.strokeWeight(0)

        s.push()
        s.blendMode(s.ADD)
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                let e = map[i][j]
                if (e === '')
                    e = 'floor'
                if (e !== 'black')
                    s.image(s.images['floor'], j * Unit, i * Unit, Unit, Unit)
                else
                    s.image(s.images['black'], j * Unit, i * Unit, Unit, Unit)
            }
        }
        s.pop()

        if (map.length === 0) return
        let [x, y] = [-1, -1]
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                let e = map[i][j]
                if (e !== 'black' && e !== '' && e !== 'floor')
                    s.image(s.images[e], j * Unit, i * Unit, Unit, Unit)
                if (e === 'nokey' || e === 'shovel nokey') {
                    [x, y] = [j, i]

                }
            }
        }

        s.push()
        s.stroke(255, 204, 0)
        s.strokeWeight(3)
        s.noFill()
        s.circle(x * Unit + Unit / 2, y * Unit + Unit / 2, Unit)
        s.pop()

        after_draw(x, y)

        s.pop()
    }

    s.setValue = (a1, a2, map) => {
        s.ActionsTarget = a1
        s.Actions2Target = a2
        // if(s.tween)
        //     s.tween.stop()
        // if(s.tween2)
        //     s.tween2.stop()
        s.Actions2Diff = minus(s.Actions2, s.Actions2Target)
        console.log(s.Actions2Diff)
        s.tween?.to(s.ActionsTarget, 100).start(undefined, false)
        s.tween2?.to(s.Actions2Target, 100).start(undefined, false)
        
        // s.Actions = a1
        // s.Actions2 = a2
        s.map = map
    }


    s.draw_neural_network = () => {
        s.fill(255)
        s.textSize(15)
        s.textAlign(s.CENTER, s.CENTER)

        for (let i = 0; i < s.Positions.length; i++) {
            const [x1, y1] = s.Positions[i]
            const [x2, y2] = s.Positions2[i]

            s.draw_arrow(x2 + 40, y2, x1 - 40, y1)

        }

        for (let i = 0; i < s.Positions2.length; i++) {
            const position = s.Positions2[i]
            const [x, y] = position

            const fillColor = temperatureToColor(s.Actions2Diff[i] +( s.Actions2Target[i] - s.Actions2[i])/10)

            s.fill(fillColor)
            s.circle(x, y, 40)

            s.fill(0)
            s.text(`${s.Actions2[i].toFixed(1)}`, x, y)

        }

        for (let i = 0; i < s.Positions.length; i++) {
            const position = s.Positions[i]
            const [x, y] = position

            const fillColor = s.Actions[i] * 255

            s.fill(fillColor)
            s.circle(x, y, 40)

            s.fill(255 - fillColor)
            s.text(`${s.Actions[i].toFixed(1)}`, x, y)
        }



        for (let i = 0; i < s.OutputName.length; i++) {
            const position = s.Positions[i]
            let [x, y] = position
            x += 50

            s.fill(0)

            s.text(s.OutputName[i], x, y)

        }
    }

    s.draw_arrow = (sx, sy, ex, ey) => {
        //draw line
        s.line(sx, sy, ex, ey)
        const angle = Math.atan2(ey - sy, ex - sx)
        //draw arrow head
        s.push()
        s.translate(ex, ey, angle)
        s.rotate(angle)
        s.fill(0)
        s.triangle(-10, -5, 0, 0, -10, 5)
        s.pop()
    }

    s.draw = () => {

        if (s.map.length === 0) return
        s.updateMap()
        const [row, column] = [s.map[0].length, s.map.length]


        s.clear()


        s.fill(0)
        s.textSize(20)
        s.textAlign(s.CENTER, s.TOP)

        s.push()

        s.tween.update()
        s.tween2.update()

        s.scale(s.resizeWhole)

        s.translate(0, 30)


        s.text("Original Image", OriginalImageScale * Unit * row / 2, 0)
        // s.text("Original Image", 0, 0)

        s.translate(0, 30)

        /**
         * c1----c2
         * |     |
         * |     |
         * c3----c4
         */

        s.draw_game(s.map, OriginalImageScale, (x, y) => {
            s.push()
            s.push()
            s.tint(255, 126)
            for (let i = Math.max(x - 3, 0); i < Math.min(x + 4, s.map[0].length); i++) {
                for (let j = Math.max(y - 3, 0); j < Math.min(y + 4, s.map.length); j++) {
                    s.image(s.images['white'], i * Unit, j * Unit, Unit, Unit)
                }
            }
            s.pop()

            let [c1, c2, c3, c4] = [[0, 0], [0, 0], [0, 0], [0, 0]]

            c1 = [Math.max(x - 3, 0) * Unit, Math.max(y - 3, 0) * Unit]
            c2 = [Math.min(x + 4, s.map[0].length) * Unit, Math.max(y - 3, 0) * Unit]
            c3 = [Math.max(x - 3, 0) * Unit, Math.min(y + 4, s.map.length) * Unit]
            c4 = [Math.min(x + 4, s.map[0].length) * Unit, Math.min(y + 4, s.map.length) * Unit]

            s.stroke(161)
            s.strokeWeight(3)
            // + OriginalImageScale * Unit * row
            s.line(c1[0], c1[1], row * Unit + (120) / OriginalImageScale, (20) / OriginalImageScale)
            s.line(c2[0], c2[1], row * Unit + (120 + s.PartialMap.length * Unit) / OriginalImageScale, (20) / OriginalImageScale)
            s.line(c3[0], c3[1], row * Unit + (120) / OriginalImageScale, (20 + s.PartialMap.length * Unit) / OriginalImageScale)
            s.line(c4[0], c4[1], row * Unit + (120 + s.PartialMap.length * Unit) / OriginalImageScale, (20 + s.PartialMap.length * Unit) / OriginalImageScale)

            s.pop()
        })



        {
            // draw local observation
            s.push()

            s.translate(OriginalImageScale * Unit * row, 0)

            s.draw_arrow(20, OriginalImageScale * Unit * column / 2, 100, OriginalImageScale * Unit * column / 2)

            s.translate(120, 0)

            s.text("Local Observation", s.PartialMap.length * Unit / 2, 0)

            s.translate(0, 20)

            s.draw_game(s.PartialMap, 1, (x, y) => {

                s.push()

                s.strokeWeight(1)

                s.translate(s.PartialMap.length * Unit, 0)

                s.text('Kernel Size = 2\nStride = 1\nPadding = 0', 80, -80)
                s.draw_arrow(80, 0, 80, 80)

                s.push()
                s.drawingContext.setLineDash([15, 5])


                s.noFill()

                const zoom = 2

                const [sizex, sizey] = [500 / zoom, 400 / zoom]

                s.rect(100, 0, sizex + 50, sizey + 20)

                // s.blendMode(s.BLEND)

                s.image(s.images['l1'], 100 + 3, 3, sizex - 6, sizey - 6)
                s.pop()

                s.translate(sizex + 100, 0)

                s.strokeWeight(0)
                s.fill(132, 151, 176)
                s.circle(0, 20, 25)
                s.circle(0, 50, 25)
                s.circle(0, 80, 10)
                s.circle(0, 100, 10)
                s.circle(0, 120, 10)
                s.circle(0, 150, 25)
                s.circle(0, 180, 25)

                s.fill(0)
                s.text('256', 0, 200)

                //draw line

                const line_start = [
                    [15, 20],
                    [15, 50],
                    [15, 100],
                    [15, 150],
                    [15, 180],
                ]

                const line_end = [
                    [180, 50],
                    [180, 100],
                    [180, 150],
                    [180, 200],
                    [180, 260],
                    [180, 320],
                    [180, 370],
                    [180, 420],
                    [180, 470],
                ]

                s.strokeWeight(1)
                s.stroke(161)

                for (const start of line_start) {
                    for (const end of line_end) {
                        s.line(start[0], start[1], end[0], end[1])
                    }
                }

                s.pop()

                {
                    s.push()

                    s.push()
                    s.tint(255, 126)
                    for (let i = x; i < x + 2; i++) {
                        for (let j = y; j < y + 2; j++) {
                            s.image(s.images['white'], Unit * j, Unit * i)
                        }

                    }
                    s.pop()

                    s.stroke(161)
                    let [c1, c2, c3, c4] = [
                        [x * Unit, y * Unit],
                        [(x + 2) * Unit, y * Unit],
                        [(x + 2) * Unit, (y + 2) * Unit],
                        [x * Unit, (y + 2) * Unit]

                    ]

                    s.strokeWeight(2)
                    s.line(c1[0], c1[1], s.PartialMap.length * Unit + 100 + 80, s.PartialMap.length * Unit / 2 + 40)
                    s.line(c2[0], c2[1], s.PartialMap.length * Unit + 100 + 80, s.PartialMap.length * Unit / 2 + 40)
                    s.line(c3[0], c3[1], s.PartialMap.length * Unit + 100 + 80, s.PartialMap.length * Unit / 2 + 40)
                    s.line(c4[0], c4[1], s.PartialMap.length * Unit + 100 + 80, s.PartialMap.length * Unit / 2 + 40)

                    s.pop()
                }
            })
            s.pop()
        }

        {
            //draw draw global observation
            s.push()
            s.translate(0, OriginalImageScale * Unit * column)
            s.translate(0, 20)
            s.draw_arrow(OriginalImageScale * Unit * row / 2, 0, OriginalImageScale * Unit * row / 2, 50)
            s.translate(0, 70)

            s.draw_game(s.GlobalMap, GlobalImageScale, (x, y) => {
                s.push()
                s.stroke(255, 204, 0)
                s.strokeWeight(3)
                s.drawingContext.setLineDash([5, 5])
                s.line(x * Unit, y * Unit + Unit / 2, 0, y * Unit + Unit / 2)

                s.line(x * Unit + Unit, y * Unit + Unit / 2, x * 2 * Unit, y * Unit + Unit / 2)

                s.line(x * Unit + Unit / 2, y * Unit, x * Unit + Unit / 2, 0)
                s.line(x * Unit + Unit / 2, y * Unit + Unit, x * Unit + Unit / 2, y * 2 * Unit)
                s.pop()
                {
                    s.push()

                    s.strokeWeight(1)

                    s.scale(1 / GlobalImageScale)

                    const [grow, gcolumn] = [s.GlobalMap[0].length, s.GlobalMap.length]

                    s.text("Global Observation", GlobalImageScale * Unit * grow / 2, GlobalImageScale * Unit * gcolumn + 20)

                    // draw arrow
                    s.translate(GlobalImageScale * Unit * grow, 0)

                    s.draw_arrow(20, GlobalImageScale * Unit * gcolumn / 2, 100, GlobalImageScale * Unit * gcolumn / 2)

                    s.text('Kernel size = 4\nStride = 3\nPadding = 0', 80, GlobalImageScale * Unit * gcolumn + 50)
                    s.draw_arrow(80, GlobalImageScale * Unit * gcolumn + 40, 80, GlobalImageScale * Unit * gcolumn)

                    //draw Conv-G
                    s.translate(20, 0)

                    s.noFill()

                    s.push()
                    s.drawingContext.setLineDash([15, 5])

                    const zoom = 2.5

                    const [sizex, sizey] = [200 * zoom, 100 * zoom]
                    s.rect(100, 0, sizex + 70, sizey)
                    s.image(s.images['l2'], 100 + 3, 3, sizex - 6 + 20, sizey - 6)
                    s.pop()

                    s.push()
                    {
                        s.translate(120 + sizex, 10)

                        s.strokeWeight(0)
                        s.fill(132, 151, 176)
                        s.circle(0, 20, 25)
                        s.circle(0, 50, 25)
                        s.circle(0, 80, 10)
                        s.circle(0, 100, 10)
                        s.circle(0, 120, 10)
                        s.circle(0, 150, 25)
                        s.circle(0, 180, 25)
                        s.fill(0)
                        s.text('256', 0, 210)

                        //draw line

                        const line_start = [
                            [15, 20],
                            [15, 50],
                            [15, 100],
                            [15, 150],
                            [15, 180],
                        ]

                        const line_end = [
                            [180 - 2, 5 - 300 + 50],
                            [180 - 2, 5 - 300 + 100],
                            [180 - 2, 5 - 300 + 150],
                            [180 - 2, 5 - 300 + 200],
                            [180 - 2, 5 - 300 + 260],
                            [180 - 2, 5 - 300 + 320],
                            [180 - 2, 5 - 300 + 370],
                            [180 - 2, 5 - 300 + 420],
                            [180 - 2, 5 - 300 + 470],
                        ]

                        s.strokeWeight(1)
                        s.stroke(161)

                        for (const start of line_start) {
                            for (const end of line_end) {
                                s.line(start[0], start[1], end[0], end[1])
                            }
                        }
                    }
                    s.pop()


                    s.strokeWeight(1)
                    s.fill(0)
                    s.text('Kernel size = 3\nStride = 2\nPadding = 0', 350, 270)
                    s.draw_arrow(350, 260, 350, 200)
                    s.pop()
                }
                {
                    s.push()
                    s.tint(255, 126)

                    for (let i = x; i < x + 4; i++) {
                        for (let j = y; j < y + 4; j++) {
                            s.image(s.images['white'], i * Unit, j * Unit)
                        }
                    }
                    s.pop()

                    let [c1, c2, c3, c4] = [
                        [x * Unit, y * Unit],
                        [(x + 4) * Unit, y * Unit],
                        [(x + 4) * Unit, (y + 4) * Unit],
                        [x * Unit, (y + 4) * Unit]

                    ]

                    s.strokeWeight(2 / GlobalImageScale)
                    s.stroke(120)
                    s.line(c1[0], c1[1], s.GlobalMap[0].length * Unit + (220) / GlobalImageScale, s.GlobalMap.length * Unit / 2 + 40 / GlobalImageScale)
                    s.line(c2[0], c2[1], s.GlobalMap[0].length * Unit + (220) / GlobalImageScale, s.GlobalMap.length * Unit / 2 + 40 / GlobalImageScale)
                    s.line(c3[0], c3[1], s.GlobalMap[0].length * Unit + (220) / GlobalImageScale, s.GlobalMap.length * Unit / 2 + 40 / GlobalImageScale)
                    s.line(c4[0], c4[1], s.GlobalMap[0].length * Unit + (220) / GlobalImageScale, s.GlobalMap.length * Unit / 2 + 40 / GlobalImageScale)

                }

            })


            s.pop()
        }

        const [grow, gcolumn] = [s.GlobalMap[0].length, s.GlobalMap.length]

        // s.circle(0, 0, 30)
        s.translate(GlobalImageScale * Unit * grow * 3 + 20, 20)
        s.text('Full Connected\n(256+256) X 512', -30, GlobalImageScale * Unit * gcolumn * 2.5 + 20)
        s.text('Full Connected\n512 X 64', 200, GlobalImageScale * Unit * gcolumn * 2.5 + 20)
        s.text('Full Connected\n512 X 64', 450, GlobalImageScale * Unit * gcolumn * 2.5 + 20)

        s.fill(132, 151, 176)

        s.strokeWeight(0)
        s.circle(50, 50, 30)
        s.circle(50, 100, 30)
        s.circle(50, 150, 30)
        s.circle(50, 200, 30)
        s.circle(50, 240, 10)
        s.circle(50, 260, 10)
        s.circle(50, 280, 10)
        s.circle(50, 320, 30)
        s.circle(50, 370, 30)
        s.circle(50, 420, 30)
        s.circle(50, 470, 30)


        s.circle(200, 100, 30)
        s.circle(200, 150, 30)
        s.circle(200, 200, 30)
        s.circle(200, 240, 10)
        s.circle(200, 260, 10)
        s.circle(200, 280, 10)
        s.circle(200, 320, 30)
        s.circle(200, 370, 30)
        s.circle(200, 420, 30)
        s.fill(0)

        s.text('512', 50, 500)
        s.text('64', 200, 500)
        s.text('Number of actions', 450, 500)



        const line_start = [
            [50 + 20, 50],
            [50 + 20, 100],
            [50 + 20, 150],
            [50 + 20, 200],
            [50 + 20, 260],
            [50 + 20, 320],
            [50 + 20, 370],
            [50 + 20, 420],
            [50 + 20, 470],
        ]

        const line_end = [
            [200 - 20, 100],
            [200 - 20, 150],
            [200 - 20, 200],
            [200 - 20, 260],
            [200 - 20, 320],
            [200 - 20, 370],
            [200 - 20, 420],
        ]

        s.strokeWeight(1)
        s.stroke(161)

        for (const start of line_start) {
            for (const end of line_end) {
                s.line(start[0], start[1], end[0], end[1])
            }
        }

        for (const start of s.Positions2) {
            for (const end of line_end) {
                s.line(start[0] + GlobalImageScale * Unit * grow - 30, start[1] + 100, end[0] + 40, end[1])
            }
        }


        s.noFill()
        s.stroke(0)
        s.drawingContext.setLineDash([15, 5])

        s.rect(0, 0, GlobalImageScale * Unit * grow + 250, GlobalImageScale * Unit * gcolumn * 2.5)
        s.translate(GlobalImageScale * Unit * grow, 0)
        s.fill(0)
        s.text("FC", 150, 30)
        s.translate(0, 100)
        s.drawingContext.setLineDash([1])
        s.stroke(161)
        s.draw_neural_network()

        s.pop()
    }

}