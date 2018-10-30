/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
const cursor = require('ansi')(process.stdout)
require('./Array.prototype.equals')
const Debugger = require('./debugger')
const constants = require('./constants')

class Higad {
    constructor (program, screen, debug) {
        this.program = program
        this.screen = screen
        this.debug = debug
        this.logger = new Debugger({
            yPosition: screen.height - 1,
            maxWidth: screen.width,
            padding: constants.CHAR_SPACE,
            enable: debug,
            program,
        })
        this.exitKeys = ['escape', 'q', 'C-c']
        this.state = {
            sh: null,
            sw: null,
            score: 0,
            higad: [],
            food: null,
            key: constants.DIRECTION_RIGHT,
            interval: 100,
            timer: null,
        }
        this.initEvents = this.initEvents.bind(this)
        this.startGame = this.startGame.bind(this)
        this.getState = this.getState.bind(this)
        this.setState = this.setState.bind(this)
        this.cleanUp = this.cleanUp.bind(this)
    }

    onInit () {
        this.program.clear()
        cursor.hide()
        const sh = this.screen.height - (this.debug ? 2 : 1)
        const sw = this.screen.width;
        const snk_x = parseInt(sw/4);
        const snk_y = parseInt(sh/2);
        const higad = [
            [snk_x, snk_y],
            [snk_x-1, snk_y],
            [snk_x-2, snk_y],
        ]
        this.setState({
            sh,
            sw,
            higad,
        })
        this.initEvents();
        const {interval} = this.getState()
        this.setState({
            timer: setInterval(this.startGame, interval),
        })
    }

    initEvents () {
        this.screen.key([constants.DIRECTION_DOWN, 
                constants.DIRECTION_LEFT, 
                constants.DIRECTION_RIGHT, 
                constants.DIRECTION_UP], (e, key) => {
            const currentKey = this.getState().key;
            if (constants.OPPOSITES[currentKey] != key.name) {
                this.setState({key: key.name})
            }
        })
        this.screen.key(this.exitKeys, () => {
            this.cleanUp()
            process.exit(0)
        })
    }

    getFood () {
        const {sh, sw} = this.getState()
        const { random } = Math
        return [
            (parseInt(random() * sw)),
            (parseInt(random() * sh)),
        ]
    }

    startGame () {
        let {higad, sh, sw, food, key, score} = this.getState()
        if (food == null) {
            while (food == null) {
                const newFood = this.getFood()
                food = higad.includes(newFood) ? null : newFood
            }
            this.logger.write(constants.CHAR_FOOD, food)
            this.logger.log({food})
        }
        this.logger.log({higad: higad[0], body: higad.slice(1), includes: higad.slice(1).includes(higad[0])})
        this.showScore()
        if ([0, sw].includes(higad[0][0]) || // it hit the sides
            [0, sh].includes(higad[0][1]) || // it hit the floor/ceiling
            higad.slice(1).find(s=>s.equals(higad[0])) // it hit itself
        ) {
            return this.gameOver();
        }
        const newHead = higad[0].slice()
        switch (key) {
            case constants.DIRECTION_UP:
                newHead[1] -= 1;
                break;
            case constants.DIRECTION_DOWN:
                newHead[1] += 1;
                break;
            case constants.DIRECTION_LEFT:
                newHead[0] -= 1;
                break;
            case constants.DIRECTION_RIGHT:
                newHead[0] += 1;
                break; 
        }
        higad.unshift(newHead)
        if (food.equals(newHead)) {
            food = null
            score++;
            if (score % 10 == 0) {
                this.speedUp()
            }
        } else {
            const tail = higad.pop()
            this.logger.write(constants.CHAR_SPACE, tail)
        }
        this.logger.write(constants.CHAR_HIGAD, newHead)
        this.setState({higad, food, score})
    }

    speedUp () {
        let {timer, interval} = this.getState()
        interval -= 10
        clearInterval(timer);
        this.setState({
            interval,
            timer: setInterval(this.startGame, interval)
        })
    }

    gameOver () {
        const {sh, timer} = this.getState()
        clearInterval(timer);
        this.logger.write(this.logger.normalize(`Game Over! Your Score: ${this.getState().score}. Press space for new game, Ctrl+C to quit.`), [0, sh]);
        this.screen.onceKey(['space'], () => {
            // const bago = (new Higad(this.program, this.screen, this.debug))
            this.onInit()
        })
        this.cleanUp()
    }

    cleanUp () {
        let {timer} = this.getState()
        clearInterval(timer);
        cursor.show()
        this.program.enableMouse();
    }

    showScore () {
        const { sh } = this.getState()
        this.logger.write(this.logger.normalize(`Score: ${this.getState().score}. Press Ctrl+C to quit.`), [0, sh])
    }

    setState (newState) {
        this.state = Object.assign({}, this.state, newState);
    }
    getState () {
        return this.state;
    }
}

module.exports = Higad