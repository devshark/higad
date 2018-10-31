const chai = require('chai')
const expect = chai.expect

const Game = require('../src/game')
const Food = require('../src/food')
const Higad = require('../src/higad')
const C = require('../src/constants')
const {GameFactory} = require('./utils/factories')

describe('Game', () => {
    it('must complain when options are missing', () => {
        const func1 = () => {
            new Game({})
        }
        const func2 = () => {
            new Game()
        }
        const func3 = () => {
            new Game({program: null})
        }
        const func4 = () => {
            new Game({cursor: null})
        }
        const func5 = () => {
            new Game({screen: null})
        }
        const func6 = () => {
            new Game({program: null, cursor: null, screen: null})
        }
        expect(func1).to.throw()
        expect(func2).to.throw()
        expect(func3).to.throw()
        expect(func4).to.throw()
        expect(func5).to.throw()
        expect(func6).to.throw()
    })

    it('must be able to create game', () => {
        const func = () => { return GameFactory(false) }
        expect(func).to.not.throw()
        expect(func()).to.be.an.instanceof(Game)
    })

    it('must initialize with new food and higad', () => {
        const game = GameFactory(false)
        game.initialize()
        const {food, higad} = game.getState()
        expect(food).to.be.an.instanceof(Food)
        expect(higad).to.be.an.instanceof(Higad)
    })

    it('must end game when it hit the edge', () => {
        const game = GameFactory(false)
        game.initialize()
        const {higad} = game.getState()
        higad.setDirection(C.DIRECTION_RIGHT)
        higad.move(game.screen.width, game.screen.height)
        game.moveFrame()
        expect(game.program.t.trim().toLowerCase()).to.have.string('game over')
    })
    
    it('must end game when it hit itself', () => {
        const game = GameFactory(false)
        game.initialize()
        const {higad} = game.getState()
        higad.setDirection(C.DIRECTION_LEFT)
        higad.move(higad.higad[1][0], higad.higad[1][1])
        game.moveFrame()
        expect(game.program.t.trim().toLowerCase()).to.have.string('game over')
    })
})