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
        newHigad[0] = food.slice()
        newHigad[0][0]--
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
})