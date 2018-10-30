class ProgramMock {
    constructor () {
        this.x = null
        this.y = null
        this.t = null
    }
    move (xAxis, yAxis) {
        this.x = xAxis
        this.y = yAxis
    }
    write (text) {
        this.t = text
    }
    clear() {

    }
    enableMouse() {

    }
}

class ScreenMock {
    constructor (height, width) {
        this.height = height
        this.width = width
    }
    key () {
        
    }
}

module.exports = {
    ProgramMock,
    ScreenMock,
}