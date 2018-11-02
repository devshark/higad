const chai = require('chai')
const expect = chai.expect

const {FoodFactory} = require('./utils/factories')

describe('Food', () => {
    it('must create food', () => {
        const food = FoodFactory()
        expect(food.getLocation()).to.be.an('array')
        expect(food.getLocation()).to.have.lengthOf(2)
    })

    it('location must not change', () => {
        const food = FoodFactory()
        const location1 = food.getLocation().slice()
        const location2 = food.getLocation().slice()
        expect(location1).to.have.members(location2)
    })

    it('must create new, different food', () => {
        const food = FoodFactory()
        const location1 = food.getLocation()
        const location2 = food.getFood()
        expect(location1).to.not.have.members(location2)
    })

    it('must know it IS inside something', () => {
        const food = FoodFactory()
        const location1 = food.getLocation()
        const thing1 = [
            location1,
            [location1[0]-1, location1[1]],
            [location1[0]-2, location1[1]],
        ]
        const result = food.isInside(thing1)
        expect(result).to.be.true
    })
    
    it('must know it IS NOT inside something', () => {
        const food = FoodFactory()
        const location1 = food.getLocation()
        const thing1 = [
            [location1[0]-1, location1[1]],
            [location1[0]-2, location1[1]],
            [location1[0]-3, location1[1]],
        ]
        const result = food.isInside(thing1)
        expect(result).to.be.false
    })
})