class ScreenWriter {
    constructor (options) {
        this.options = Object.assign({
            yPosition: 0, 
            maxWidth: 0, 
            padding: null,
            enable: true,
            program: null,
        }, options)
        // console.log({yPosition: this.options.yPosition, maxWidth: this.options.maxWidth})
    }
    log (obj) {
        if (!this.options.enable) return;
        const pos = [0, this.options.yPosition];
        this.write(this.normalize(obj), pos)
    }
    normalize (obj) {
        if (obj instanceof Object) {
            obj = JSON.stringify(obj)
        } else {
            obj = obj.toString()
        }
        if (obj.length > this.options.maxWidth) {
            return obj.slice(0, this.options.maxWidth)
        }
        const padRight = this.options.maxWidth - obj.length
        return `${obj}${Array(padRight).fill(this.options.padding).join('')}`
    }
    write(char, loc) {
        if (!loc instanceof Array || loc.length !== 2) {
            return console.error('Error! Cannot find coordinates.')
        }
        if (!this.options.program) {
            return console.log(char)
        }
        // console.log({loc, char: char.trim()})
        this.options.program.move(loc[0], loc[1])
        this.options.program.write(char)
    }
}

module.exports = ScreenWriter