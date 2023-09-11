import { slice, find, padding } from "./utils.js"


const Unit = 24
const OriginalImageScale = 0.6
const GlobalImageScale = 0.3

export let outputs = (s) => {

    s.PartialMap = []
    s.GlobalMap = []

    s.Actions = [0, 0, 0, 0, 0, 0]

    s.Actions2 = [0, 0, 0, 0, 0, 0]

    s.OutputName = ['stay', 'dig', 'left', 'right', 'down', 'up']

    // s.Positions = [[75, 25], [75, 75], [25, 75], [125, 75], [50, 125], [100, 125]]
    s.Positions = [[100, 25], [100, 75], [100, 125], [100, 175], [100, 225], [100, 275]]

    s.Positions2 = [[0, 25], [0, 75], [0, 125], [0, 175], [0, 225], [0, 275]]

    s.images = {}

    s.map = []

    s.setup = () => {
        s.createCanvas(3000, 1000)
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
        s.images['black'] = s.loadImage('images/oryx/black.png')
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

    s.draw_game = (map, scale = 1) => {
        s.push()
        s.scale(scale)
        if (map.length === 0) return
        let [x, y] = [-1, -1]
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                let e = map[i][j]
                if (e !== 'black')
                    s.image(s.images['floor'], j * Unit, i * Unit)
                if (e === '')
                    e = 'floor'
                s.image(s.images[e], j * Unit, i * Unit)
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

        s.pop()
    }


    s.draw_neural_network = () => {
        s.fill(255)
        s.textSize(15)
        s.textAlign(s.CENTER, s.CENTER)

        for (let i = 0; i < s.Positions.length; i++) {
            for (let j = 0; j < s.Positions2.length; j++) {
                const [x1, y1] = s.Positions[i]
                const [x2, y2] = s.Positions2[j]

                s.line(x1, y1, x2, y2)

            }
        }

        for (let i = 0; i < s.Positions.length; i++) {
            const position = s.Positions[i]
            const [x, y] = position

            const fillColor = s.Actions[i] * 255

            s.fill(fillColor)
            s.circle(x, y, 40)

            s.fill(255 - fillColor)
            s.text(s.Actions[i], x, y)
        }

        for (let i = 0; i < s.Positions2.length; i++) {
            const position = s.Positions2[i]
            const [x, y] = position

            const fillColor = s.Actions2[i] * 255

            s.fill(fillColor)
            s.circle(x, y, 40)

            s.fill(255 - fillColor)
            s.text(s.Actions2[i], x, y)

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

        s.translate(0, 30)


        s.text("Original Image", OriginalImageScale * Unit * row / 2, 0)
        // s.text("Original Image", 0, 0)

        s.translate(0, 30)

        s.draw_game(s.map, OriginalImageScale)



        {
            // draw local observation
            s.push()

            s.translate(OriginalImageScale * Unit * row, 0)

            s.draw_arrow(20, OriginalImageScale * Unit * column / 2, 100, OriginalImageScale * Unit * column / 2)

            s.translate(120, 0)

            s.text("Local Observation", s.PartialMap.length * Unit / 2, 0)

            s.translate(0, 20)

            s.draw_game(s.PartialMap)

            s.translate(s.PartialMap.length * Unit, 0)

            s.drawingContext.setLineDash([15, 5])

            s.fill(255)

            s.rect(100, 0, s.PartialMap.length * Unit, s.PartialMap.length * Unit)

            s.pop()
        }

        {
            //draw draw global observation
            s.push()
            s.translate(0, OriginalImageScale * Unit * column)
            s.translate(0, 20)
            s.draw_arrow(OriginalImageScale * Unit * row / 2, 0, OriginalImageScale * Unit * row / 2, 50)
            s.translate(0, 70)

            s.draw_game(s.GlobalMap, GlobalImageScale)

            const [grow, gcolumn] = [s.GlobalMap[0].length, s.GlobalMap.length]

            s.text("Global Observation", GlobalImageScale * Unit * grow / 2, GlobalImageScale * Unit * gcolumn + 20)

            s.translate(GlobalImageScale * Unit * grow, 0)

            s.draw_arrow(20, GlobalImageScale * Unit * gcolumn / 2, 100, GlobalImageScale * Unit * gcolumn / 2)

            s.translate(20, 0)

            s.fill(255)

            s.drawingContext.setLineDash([15, 5])

            s.rect(100, 0, GlobalImageScale * Unit * grow + 30, GlobalImageScale * Unit * gcolumn)

            s.pop()
        }

        const [grow, gcolumn] = [s.GlobalMap[0].length, s.GlobalMap.length]


        s.translate(GlobalImageScale * Unit * grow * 3 - 100, 0)

        s.fill(255)
        s.drawingContext.setLineDash([15, 5])

        s.rect(0, 0, GlobalImageScale * Unit * grow + 200, GlobalImageScale * Unit * gcolumn * 2.5)
        s.translate(GlobalImageScale * Unit * grow, 0)
        s.fill(0)
        s.text("FC", 150, 30)
        s.translate(0, 100)
        s.draw_neural_network()

        s.pop()
    }

}