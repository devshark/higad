const chai = require('chai')
const expect = chai.expect

const {HigadFactory, screenSize} = require('./utils/factories')
const C = require('../src/constants')
const Food = require('../src/food')

describe('Higad', () => {
    it('must not hit itself initially', () => {
        const higad = HigadFactory()
        expect(higad.didHitItself()).to.be.false
    })
    
    it('must not hit the edge initially', () => {
        const higad = HigadFactory()
        const head = higad.getHead()
        expect(higad.didHitEdge(screenSize.height, screenSize.width)).to.be.false
    })

    it('must set the direction correctly', () => {
        const higad = HigadFactory()
        higad.setDirection(C.DIRECTION_UP)
        expect(higad.getDirection()).to.be.equal(C.DIRECTION_UP)
        higad.setDirection(C.DIRECTION_LEFT)
        expect(higad.getDirection()).to.be.equal(C.DIRECTION_LEFT)
        higad.setDirection(C.DIRECTION_DOWN)
        expect(higad.getDirection()).to.be.equal(C.DIRECTION_DOWN)
        higad.setDirection(C.DIRECTION_RIGHT)
        expect(higad.getDirection()).to.be.equal(C.DIRECTION_RIGHT)
    })
    
    it('must know if something is inside', () => {
        const higad = HigadFactory()
        expect(higad.higad).to.be.an('array')
        expect(higad.higad).to.have.lengthOf(3)
        higad.higad.forEach(segment => {
            expect(higad.isInside(segment)).to.be.true
        })
    })

    it('must know if it is being fed by not a food', () => {
        const higad = HigadFactory()
        const func = () => {
            higad.feed({not: 'food'})
        }
        expect(func).to.throw()
    })

    it('must know if it has eaten food', () => {
        const higad = HigadFactory()
        expect(higad.higad).to.be.an('array')
        const food = new Food(screenSize.width, screenSize.height)
        const foodLocation = food.getLocation()
        higad.move(foodLocation[0]-1, foodLocation[1]) // in front of higad
        higad.setDirection(C.DIRECTION_RIGHT) // higad direction is to the right
        higad.move() // higad will take a step forward
        expect(higad.feed(food)).to.be.true
    })

    it('must be expected to move when instructed', () => {
        const higad = HigadFactory()
        const initHead = higad.getHead().slice()

        higad.moveDown()
        const head1 = higad.getHead().slice()
        expect(head1).to.have.members([initHead[0], initHead[1]+1])
        
        higad.setDirection(C.DIRECTION_DOWN)
        higad.move()
        const head10 = higad.getHead().slice()
        expect(head10).to.have.members([head1[0], head1[1]+1])

        higad.moveUp()
        const head2 = higad.getHead().slice()
        expect(head2).to.have.members([head10[0], head10[1]-1])

        higad.setDirection(C.DIRECTION_UP)
        higad.move()
        const head20 = higad.getHead().slice()
        expect(head20).to.have.members([head2[0], head2[1]-1])

        higad.moveLeft()
        const head3 = higad.getHead().slice()
        expect(head3).to.have.members([head20[0]-1, head20[1]])

        higad.setDirection(C.DIRECTION_LEFT)
        higad.move()
        const head30 = higad.getHead().slice()
        expect(head30).to.have.members([head3[0]-1, head3[1]])

        higad.moveRight()
        const head4 = higad.getHead().slice()
        expect(head4).to.have.members([head30[0]+1, head30[1]])

        higad.setDirection(C.DIRECTION_RIGHT)
        higad.move()
        const head40 = higad.getHead().slice()
        expect(head40).to.have.members([head4[0]+1, head4[1]])

        const [x1, y1] = [20, 40]
        higad.move(x1, y1)
        const head5 = higad.getHead().slice()
        expect(head5).to.have.members([x1, y1])
    })
})