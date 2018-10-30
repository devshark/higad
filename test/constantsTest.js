const chai = require('chai')
const assert = chai.assert

const C = require('../src/constants')

describe('Constants', function () {
    it('must never change', function () {
        const changedValue = '?'
        C.CHAR_FOOD = changedValue
        C.CHAR_HIGAD = changedValue
        C.CHAR_SPACE = changedValue
        assert.notEqual(C.CHAR_FOOD, changedValue)
        assert.notEqual(C.CHAR_HIGAD, changedValue)
        assert.notEqual(C.CHAR_SPACE, changedValue)
    })

    const O = C.OPPOSITES
    it('opposite of right must be left', function () {
        assert.equal(O.DIRECTION_RIGHT, C.DIRECTION_LEFT)
    })
    it('opposite of left must be right', function () {
        assert.equal(O.DIRECTION_LEFT, C.DIRECTION_RIGHT)
    })
    it('opposite of up must be down', function () {
        assert.equal(O.DIRECTION_UP, C.DIRECTION_DOWN)
    })
    it('opposite of down must be up', function () {
        assert.equal(O.DIRECTION_DOWN, C.DIRECTION_UP)
    })
})