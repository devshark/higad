/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
const ScreenWriter = require('./writer')
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
        this.logger = new ScreenWriter({
            yPosition: this.screen.height - 1,
            maxWidth: this.screen.width,
            padding: C.CHAR_SPACE,
            enable: this.debug || false,
            program: this.program,
        })
        this.state = {
            score: 0,
            higad: null,
            food: null,
            interval: 100,
            timer: null,
            maxHeight: this.screen.height - 2,
            maxWidth: this.screen.width,
        }
    }

    initialize () {
        this.program.clear()
        this.cursor.hide()
        const {maxHeight, maxWidth} = this.getState(),
        food = new Food(maxWidth, maxHeight),
        higad = new Higad(parseInt(maxWidth/2), parseInt(maxHeight/4));
        higad.setDirection(C.DIRECTION_RIGHT)
        this.setState({
            food, higad,
        })
    }

    initEvents () {
        this.screen.key(C.KEYS.DIRECTIONS, (e, key) => {
            const {higad} = this.getState()
            if (higad instanceof Higad) {
                const currentDirection = higad.getDirection()
                this.logger.log({currentDirection, key: key.name})
                if (C.OPPOSITES[currentDirection] != key.name) {
                    this.logger.log({currentDirection, key: key.name, pressed: true})
                    higad.setDirection(key.name)
                }
            }
        })
        this.screen.onceKey(C.KEYS.EXIT, () => {
            this.cleanUp()
            process.exit(0)
        })
    }

    start () {
        this.initEvents()
        const {interval} = this.getState()
        this.setState({
            timer: setInterval(this.moveFrame, interval),
        })
    }

    restart () {
        this.cleanUp()
        this.initialize()
        this.start()
    }

    stop () {
        clearInterval(this.getState().timer)
    }

    moveFrame () {
        const {higad, maxHeight, maxWidth} = this.getState();
        let {food, score} = this.getState()

        this.logger.write(C.CHAR_FOOD, food.getLocation())
        // this.logger.log({food})

        if (higad.didHitItself() || higad.didHitEdge(maxHeight, maxWidth)) {
            return this.gameOver()
        }
        if (higad.feed(food)) {
            // this means the food has been eaten,
            // and the higad grew a character long.
            // Food must be changed to the higad character
            this.logger.write(C.CHAR_HIGAD, food.getLocation())
            food = null
            score++
        }
        const tail = higad.move()
        const newHead = higad.getHead()
        if (tail !== false && (tail instanceof Array)) {
            this.logger.write(C.CHAR_SPACE, tail)
        }
        while(food === null) {
            const newFood = new Food(maxWidth, maxHeight)
            food = newFood.isInside(higad.higad) ? null : newFood
        }
        // this.logger.log({tail, newHead, food: food.getLocation(), maxWidth, maxHeight})
        this.logger.write(C.CHAR_HIGAD, newHead)
        this.setState({higad, food, score})
        this.showScore()
    }

    gameOver () {
        const {maxHeight} = this.getState()
        this.logger.write(this.logger.normalize(`Game Over! Your Score: ${this.getState().score}. Press space for new game, Ctrl+C to quit.`), [0, maxHeight]);
        this.screen.onceKey(C.KEYS.RESTART, () => {
            this.restart()
        })
        this.stop()
    }

    showScore () {
        const { maxHeight, score } = this.getState()
        this.logger.write(this.logger.normalize(`Score: ${score}. Press Ctrl+C to quit.`), [0, maxHeight])
    }

    cleanUp () {
        this.stop()
        this.setState({
            score: 0,
            higad: null,
            food: null,
            interval: 100,
            timer: null,
        })
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