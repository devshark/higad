/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
const Debugger = require('./debugger')
const C = require('./constants')
require('./Array.prototype.equals')

const Higad = require('./higad')
const Food = require('./food')

class Game {
    // throws exception if required options are missing
    constructor (options) {
        this.initialize = this.initialize.bind(this)
        this.initEvents = this.initEvents.bind(this)
        this.moveFrame = this.moveFrame.bind(this)
        this.start = this.start.bind(this)
        this.gameOver = this.gameOver.bind(this)
        this.showScore = this.showScore.bind(this)
        this.cleanUp = this.cleanUp.bind(this)
        this.onStartUp(options)
    }

    onStartUp (options) {
        if (options === undefined) throw new Error('options is required.');
        ['program', 'screen', 'cursor'].forEach((requiredKey, index, requiredKeys) => {
            if (!(requiredKey in options) || !options[requiredKey]) {
                throw new Error(`These options are required and cannot be null: ${requiredKeys.join(',')}`)
            }
            this[requiredKey] = options[requiredKey]
        })
        this.debug = options.debug || false
        this.logger = new Debugger({
            yPosition: this.screen.height - 1,
            maxWidth: this.screen.width,
            padding: C.CHAR_SPACE,
            enable: this.debug || false,
            program: this.program,
        })
        this.keys = {
            exit: ['escape', 'q', 'C-c'],
            restart: ['space'],
            directions: C.DIRECTIONS,
        }
        this.state = {
            score: 0,
            higad: null,
            food: null,
            interval: 500,
            timer: null,
            maxHeight: this.screen.height - (this.debug ? 2 : 1),
            maxWidth: this.screen.width,
        }
    }

    initialize () {
        this.program.clear()
        this.cursor.hide()
        const {maxHeight, maxWidth} = this.getState(),
        food = new Food(maxWidth, maxHeight),
        higad = new Higad([parseInt(maxHeight/4), parseInt(maxWidth/2)]);
        higad.setDirection(C.DIRECTION_RIGHT)
        this.setState({
            food, higad,
        })
    }

    initEvents () {
        this.screen.key(this.keys.directions, (e, key) => {
            const currentKey = this.higad.getDirection()
            if (C.OPPOSITES[currentKey] != key.name) {
                this.getState().higad.setDirection(key.name)
            }
        })
        this.screen.key(this.keys.exit, () => {
            this.cleanUp()
            process.exit(0)
        })
    }

    start () {
        const {interval} = this.getState()
        this.setState({
            timer: setInterval(this.moveFrame, interval),
        })
    }

    moveFrame () {
        const {higad, score, food, maxHeight, maxWidth} = this.getState();
        if (food == null) {
            while(food == null) {
                const newFood = new Food()
                food = newFood.isInside(higad) ? null : newFood
            }
            this.logger.write(C.CHAR_FOOD, food)
            this.logger.log({food})
        }
        if (higad.didHitItself() || higad.didHitEdge(maxHeight, maxWidth)) {
            return this.gameOver()
        }
        const tail = higad.moveDirection()
        const newHead = higad.getHead()
        if (higad.feed(food)) {
            food = null
            score++
        } else {
            this.logger.write(C.CHAR_SPACE, tail)
        }
        this.logger.write(C.CHAR_HIGAD, newHead)
        this.setState({higad, food, score})
        this.showScore()
    }

    gameOver () {
        const {maxHeight} = this.getState()
        this.logger.write(this.logger.normalize(`Game Over! Your Score: ${this.getState().score}. Press space for new game, Ctrl+C to quit.`), [0, this.maxWidth]);
        this.screen.onceKey(this.keys.restart, () => {
            // const bago = (new Higad(this.program, this.screen, this.debug))
            this.initialize()
            this.start()
        })
        this.cleanUp()
    }

    showScore () {
        const { maxHeight, score } = this.getState()
        this.logger.write(this.logger.normalize(`Score: ${score}. Press Ctrl+C to quit.`), [0, maxHeight])
    }

    cleanUp () {
        clearInterval(this.getState().timer)
        this.program.clear()
        this.cursor.show()
    }

    setState (newState) {
        this.state = Object.assign({}, this.state, newState);
    }

    getState () {
        return this.state;
    }
}

module.exports = Game