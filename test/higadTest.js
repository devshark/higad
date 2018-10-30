require('../src/Array.prototype.equals')

const chai = require('chai')
const assert = chai.assert
const expect = chai.expect

const Higad = require('../src/higad')
const C = require('../src/constants')
const {ProgramMock, ScreenMock} = require('./utils/mocks')

describe('Higad', () => {
    it('must initialize with default state', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const higad = new Higad(program, screen, false)
        const state = higad.getState()
        assert.isObject(state)
        assert.isNull(state.sh)
        assert.isNull(state.sw)
        assert.equal(state.score, 0)
        assert.isEmpty(state.higad)
        assert.isNull(state.food)
        assert.equal(state.key, C.DIRECTION_RIGHT)
        assert.equal(state.interval, 100)
        assert.isNull(state.timer)
        higad.cleanUp()
    })

    it('must set new values after onInit call', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const higad = new Higad(program, screen, debug)
        higad.onInit()
        const state = higad.getState()
        assert.isObject(state)
        assert.equal(state.sh, screen.height - (debug ? 2 : 1))
        assert.equal(state.sw, screen.width)
        assert.equal(state.score, 0)
        assert.lengthOf(state.higad, 3)
        assert.isNull(state.food)
        assert.equal(state.key, C.DIRECTION_RIGHT)
        assert.equal(state.interval, 100)
        assert.isNotNull(state.timer)
        higad.cleanUp()
    })

    it('must give food when asked', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const higad = new Higad(program, screen, debug)
        higad.onInit()
        const food = higad.getFood()
        assert.isArray(food)
        assert.lengthOf(food, 2, 'Food must always be a pair.')
        assert.isBelow(food[0], screen.width)
        assert.isBelow(food[1], screen.height)
        higad.cleanUp()
    })

    it('must decrease interval when I speedUp', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const higad = new Higad(program, screen, debug)
        higad.onInit()
        const initInterval = higad.getState().interval
        higad.speedUp()
        const endInterval = higad.getState().interval
        assert.isAbove(initInterval, endInterval)
        assert.isBelow(endInterval, initInterval)
        higad.cleanUp()
    })

    it('must end game when it hit the wall', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        const initHigad = _higad.getState().higad
        initHigad[0] = [screen.width, screen.height/2]
        _higad.setState({
            higad: initHigad
        })
        _higad.startGame()
        assert.include(program.t.toLowerCase(), 'game over')
        _higad.cleanUp()
    })

    it('must end game when it hit itself', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        const initHigad = _higad.getState().higad
        initHigad[0] = initHigad[2]
        _higad.setState({
            higad: initHigad
        })
        _higad.startGame()
        assert.include(program.t.toLowerCase(), 'game over')
        _higad.cleanUp()
    })

    it('must be able to restart game', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        _higad.cleanUp()
        const origHigad = _higad.getState().higad.slice()
        const initHigad = origHigad.slice()
        const initScore = _higad.getState().score
        initHigad[0] = initHigad[2]
        _higad.setState({
            higad: initHigad.slice()
        })
        _higad.startGame()
        assert.include(program.t.toLowerCase(), 'game over')
        screen.triggerKey(['space'])
        const Higado = _higad.getState().higad.slice()
        assert(Higado.equals(origHigad))
        //assert() // must be the same as the original higad
        
        const rounds = 10
        for (let i=0; i<rounds; i++) {
            const food = _higad.getFood()
            // make sure the food is not along the left edge
            if (food[0] <= 1) food[0] = parseInt(screen.width/4)
            const newHigad = _higad.getState().higad
            // set the head just beside the food, ready to be eaten on game start
            newHigad[0] = [food[0]-1, food[1]]
            _higad.setState({
                food,
                higad: newHigad,
            })
            _higad.startGame()
        }
        const {score, higad} = _higad.getState()
        assert.lengthOf(initHigad, 3)
        assert.equal(initScore, 0)
        assert.equal(score, rounds)
        assert.lengthOf(higad, initHigad.length + rounds)
        assert.isAbove(higad.length, initHigad.length)
        _higad.cleanUp()
    })

    it('must increase size when it has eaten food', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        const initHigad = _higad.getState().higad
        const initScore = _higad.getState().score
        const food = _higad.getFood()
        const newHigad = initHigad.slice()
        // set the head just beside the food, ready to be eaten on game start
        newHigad[0] = [food[0]-1, food[1]]
        _higad.setState({
            food,
            higad: newHigad,
        })
        _higad.startGame()
        const {score, higad} = _higad.getState()
        assert.lengthOf(initHigad, 3)
        assert.equal(initScore, 0)
        assert.equal(score, 1)
        assert.lengthOf(higad, 4)
        assert.isAbove(higad.length, initHigad.length)
        _higad.cleanUp()
    })

    it('must survive 10 rounds', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        const initHigad = _higad.getState().higad
        const initScore = _higad.getState().score
        const newHigad = initHigad.slice()

        const rounds = 10
        for (let i=0; i<rounds; i++) {
            const food = _higad.getFood()
            // make sure the food is not along the left edge
            if (food[0] <= 1) food[0] = parseInt(screen.width/4)
            // set the head just beside the food, ready to be eaten on game start
            newHigad[0] = [food[0]-1, food[1]]
            _higad.setState({
                food,
                higad: newHigad,
            })
            _higad.startGame()
        }
        const {score, higad} = _higad.getState()
        assert.lengthOf(initHigad, 3)
        assert.equal(initScore, 0)
        assert.equal(score, rounds)
        assert.lengthOf(higad, initHigad.length + rounds)
        assert.isAbove(higad.length, initHigad.length)
        _higad.cleanUp()
    })
    
    /* Skipping because it exits the process
    it('must be able to quit game', () => {
        const program = new ProgramMock()
        const screen = new ScreenMock(300, 300)
        const debug = false
        const _higad = new Higad(program, screen, debug)
        _higad.onInit()
        _higad.startGame()

        process.stdin.resume();//so the program will not close instantly

        const exitHandler = (options, exitCode) => {
            assert.equal(exitCode, 0)
            assert.equal(options.cleanup, true)
            if (options.exit) process.exit();
        }

        //do something when app is closing
        process.on('exit', exitHandler.bind(null,{cleanup:true}));
        process.on('SIGINT', exitHandler.bind(null, {exit:true}));

        // catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
        process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
        
        //catches uncaught exceptions
        process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
        
        screen.triggerKey(['q'])
    }) */
})