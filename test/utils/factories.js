const chai = require('chai')
const expect = chai.expect

const Food = require('../../src/food')
const Higad = require('../../src/higad')
const Game = require('../../src/game')
const C = require('../../src/constants')
const {CursorMock, ProgramMock, ScreenMock} = require('./mocks')

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

const GameFactory = (debug) => {
    const game = new Game({
        cursor: new CursorMock(),
        program: new ProgramMock(),
        screen: new ScreenMock(screenSize.height, screenSize.width),
        debug,
    })
    const { score, higad, food, timer, maxHeight, maxWidth } = game.getState()
    expect(game).to.have.own.property('debug', debug)
    expect(game).to.have.own.property('logger')
    expect(game).to.have.own.property('state')
    expect(score).to.be.equal(0)
    expect(higad).to.be.null
    expect(food).to.be.null
    expect(timer).to.be.null
    expect(maxHeight).to.be.equal(screenSize.height - 2)
    expect(maxWidth).to.be.equal(screenSize.width)
    return game
}

const PlayGameFactory = (game, rounds) => {
    const {higad} = game.getState()
    const initialSize = higad.higad.length
    for(let round = 1; round <= rounds; round++) {
        const {food} = game.getState()
        const foodLocation = food.getLocation()
        higad.move(foodLocation[0], foodLocation[1])
        // because we are navigating blindly, 
        // we need to adjust the character 
        // in case it is off the grid when eating the food
        switch (foodLocation[0]) { // x-axis
            case 0: // food is beside the left edge
                higad.moveRight()
                higad.setDirection(C.DIRECTION_LEFT);
                break;
            case food.maxX: // food is beside the right edge
                higad.moveLeft()
                higad.setDirection(C.DIRECTION_RIGHT);
                break;
        }
        switch (foodLocation[1]) { // y-axis
            case 0: // food is below the roof
                higad.moveDown()
                higad.setDirection(C.DIRECTION_UP);
                break;
            case food.maxY: // food is on the floor
                higad.moveUp()
                higad.setDirection(C.DIRECTION_DOWN);
                break;
        }
        game.moveFrame()
        const {score: newScore} = game.getState()
        expect(newScore).to.be.equal(round)
        expect(higad.higad).to.have.lengthOf(round + initialSize)
    }
}

module.exports = {
    GameFactory,
    FoodFactory,
    HigadFactory,
    screenSize,
    PlayGameFactory,
}