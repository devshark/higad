const chai = require('chai')
const assert = chai.assert
const expect = chai.expect

const C = require('../src/constants')

describe('Constants', function () {
    it('must never change', function () {
        const changedValue = '?'
        const [FOOD, HIGAD, SPACE] = [C.CHAR_FOOD, C.CHAR_HIGAD, C.CHAR_SPACE]
        C.CHAR_FOOD = changedValue
        C.CHAR_HIGAD = changedValue
        C.CHAR_SPACE = changedValue
        expect(C.CHAR_FOOD).to.not.be.equal(changedValue)
        expect(C.CHAR_HIGAD).to.not.be.equal(changedValue)
        expect(C.CHAR_SPACE).to.not.be.equal(changedValue)
        expect(C.CHAR_FOOD).to.be.equal(FOOD)
        expect(C.CHAR_HIGAD).to.be.equal(HIGAD)
        expect(C.CHAR_SPACE).to.be.equal(SPACE)
    })

    const O = C.OPPOSITES
    it('opposite of right must be left', function () {
        expect(O[C.DIRECTION_RIGHT]).to.be.equal(C.DIRECTION_LEFT)
    })
    it('opposite of left must be right', function () {
        expect(O[C.DIRECTION_LEFT]).to.be.equal(C.DIRECTION_RIGHT)
    })
    it('opposite of up must be down', function () {
        expect(O[C.DIRECTION_UP]).to.be.equal(C.DIRECTION_DOWN)
    })
    it('opposite of down must be up', function () {
        expect(O[C.DIRECTION_DOWN]).to.be.equal(C.DIRECTION_UP)
    })
})