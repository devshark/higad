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
        this.mapOfKeyEvents = { keys: {}, onceKey: [] }
        // { keys: {[key]: [valueFn, valueFn, valueFn],}, onceKey: [valueFn, valueFn] }
        this.triggerKey = this.triggerKey.bind(this)
        // this.key = this.key.bind(this)
        // this.onceKey = this.onceKey.bind(this)
    }
    key (keys, fn) {
        keys.forEach(k => {
            if (this.mapOfKeyEvents.keys.hasOwnProperty(k)) {
                this.mapOfKeyEvents.keys[k].push(fn)
            } else {
                this.mapOfKeyEvents.keys[k] = [fn]
            }
        })
    }
    onceKey (keys, fn) {
        keys.forEach(k => {
            if (this.mapOfKeyEvents.onceKey.hasOwnProperty(k)) {
                this.mapOfKeyEvents.onceKey[k].push(fn)
            } else {
                this.mapOfKeyEvents.onceKey[k] = [fn]
            }
        })
    }
    triggerKey (keys) {
        keys.forEach(k => {
            // console.log(this.mapOfKeyEvents.keys[k])
            if (this.mapOfKeyEvents.keys.hasOwnProperty(k)) {
                this.mapOfKeyEvents.keys[k].forEach(fn => {
                    fn(null, k)
                })
            }
            // console.log(this.mapOfKeyEvents.onceKey[k])
            if (this.mapOfKeyEvents.onceKey.hasOwnProperty(k)) {
                this.mapOfKeyEvents.onceKey[k].forEach(fn => {
                    fn(null, k)
                })
                this.mapOfKeyEvents.onceKey[k].length = 0
            }
        })
    }
}

class Formulate {
    constructor(padding, maxWidth){
        this.padding = padding
        this.maxWidth = maxWidth
    }
    normalize(obj) {
        let stringText = null
        if (obj instanceof Object) {
            stringText = JSON.stringify(obj)
        } else {
            stringText = obj.toString()
        }
        const paddingSize = this.maxWidth - stringText.length
        return `${stringText}${Array(paddingSize).fill(this.padding).join('')}`
    }
}

module.exports = {
    ProgramMock,
    ScreenMock,
    Formulate,
}