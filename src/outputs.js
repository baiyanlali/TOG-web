export let outputs = (s)=> {

    s.PartialMap = []

    s.Actions = [0, 0, 0, 0, 0, 0]

    s.Actions2 = [0, 0, 0, 0, 0, 0]

    // s.Positions = [[75, 25], [75, 75], [25, 75], [125, 75], [50, 125], [100, 125]]
    s.Positions = [[300, 25], [300, 75], [300, 125], [300, 175], [300, 225], [300, 275]]

    s.Positions2 = [[100, 25], [100, 75], [100, 125], [100, 175], [100, 225], [100, 275]]

    s.images = {}

    s.setup = () => {
        s.createCanvas(1000, 300)
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
        s.images['shovel noke'] = s.loadImage('images/oryx/axeman1.png')
        s.images['withkey'] = s.loadImage('images/oryx/axeman1.png')
        s.images['monsterQuick'] = s.loadImage('images/oryx/bat1.png')
        s.images['monsterNormal'] = s.loadImage('images/oryx/spider2.png')
        s.images['monsterSlow'] = s.loadImage('images/oryx/scorpion1.png')
        s.images['monsterChest'] = s.loadImage('images/oryx/trapChest1.png')
        s.images['wall'] = s.loadImage('images/oryx/dirtWall_0.png')
        s.images['key'] = s.loadImage('images/oryx/key2.png')
    }

    s.updateActionInfo = (actions) => {
        s.Actions = actions
    }

    s.draw_partial_game = () => {
        if(s.PartialMap.length === 0) return

    }

    s.draw_neural_network = () => {
        s.fill(255)
        s.textSize(20)
        s.textAlign(s.CENTER, s.CENTER)

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
    }

    s.draw = () => {

        s.push()

        s.draw_partial_game()

        s.pop()

        s.push()
        
        s.draw_neural_network()

        s.pop()
    }

}