const chai = require('chai')
const assert = chai.assert
const expect = chai.expect

const Higad = require('../src/higad')
const C = require('../src/constants')

class ScreenMock {
    constructor (height, width) {
        this.height = height
        this.width = width
    }
}

describe('Higad', () => {
    it('must initialize with default state', () => {
        const program = {}
        const screen = {height: 300, width: 300}
        const higad = new Higad(program, screen, false)
        const state = higad.getState()
        assert.equal(state.sh, null)
        assert.equal(state.sw, null)
        assert.equal(state.score, 0)
        // expect(state.snake).to.have.all.members([])
        assert.equal(state.snake.length, 0)
        assert.equal(state.food, null)
        assert.equal(state.key, C.DIRECTION_RIGHT)
        assert.equal(state.interval, 100)
        assert.equal(state.timer, null)
    })
})