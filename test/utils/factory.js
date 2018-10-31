const chai = require('chai')
const expect = chai.expect

const Food = require('../../src/food')
const Higad = require('../../src/higad')

const screenSize = {
    height: 400,
    width: 400,
}

const FoodFactory = () => {
    const maxX = screenSize.width,
    maxY = screenSize.height;
    const food = new Food(maxX, maxY)
    expect(food).to.have.own.property('maxX', maxX)
    expect(food).to.have.own.property('maxY', maxY)
    expect(food.maxX).to.be.equal(maxX)
    expect(food.maxY).to.be.equal(maxY)
    return food;
}

const HigadFactory = () => {
    const x = parseInt(screenSize.width/4),
    y = parseInt(screenSize.height/2);
    const higad = new Higad(x, y)
    expect(higad).to.have.own.property('direction', null)
    expect(higad).to.have.own.property('hasEaten', false)
    expect(higad.getHead()).to.have.members([x, y])
    return higad
}

module.exports = {
    FoodFactory,
    HigadFactory,
    screenSize,
}