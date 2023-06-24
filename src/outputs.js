export let outputs = (s)=> {


    s.Actions = [0, 0, 0, 0, 0, 0]

    s.Positions = [[75, 25], [75, 75], [25, 75], [125, 75], [50, 125], [100, 125]]

    s.setup = () => {
        s.createCanvas(150, 150)
    }

    s.preload = () => {

    }

    s.updateActionInfo = (actions) => {
        s.Actions = actions
    }

    s.draw = () => {
        s.push()

        s.fill(255)
        s.textSize(25)
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

        // s.fill(0)


        // for (let i = 0; i < s.Positions.length; i++) {
        //     const position = s.Positions[i]
        //     const [x, y] = position
        //     s.text(s.Actions[i], x, y)
        // }

        s.pop()
    }

}