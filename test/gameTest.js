const chai = require('chai')
const expect = chai.expect

const Game = require('../src/game')
const Food = require('../src/food')
const Higad = require('../src/higad')
const C = require('../src/constants')
const {GameFactory, PlayGameFactory} = require('./utils/factories')

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

    it('must increase size when it has eaten food', () => {
        const game = GameFactory(false)
        game.initialize()
        const {higad, food, score} = game.getState()
        const foodLocation = food.getLocation()
        expect(higad.higad).to.have.lengthOf(3)
        expect(score).to.be.equal(0)
        higad.move(foodLocation[0], foodLocation[1]) // move higad onto the food
        higad.setDirection(C.DIRECTION_RIGHT)
        game.moveFrame()
        const newScore = game.getState().score
        expect(food.isInside(higad.higad)).to.be.true
        expect(newScore).to.be.equal(1)
        // console.dir({food: foodLocation, body: higad.higad, in: food.isInside(higad.higad)})
        expect(higad.higad).to.have.lengthOf(4)
    })

    it('must survive 10 rounds', () => {
        const game = GameFactory(false)
        game.initialize()
        const {score, higad} = game.getState(),
        initialSize = higad.higad.length;
        higad.setDirection(C.DIRECTION_RIGHT)
        expect(score).to.be.equal(0)
        const rounds = 10
        PlayGameFactory(game, rounds)
        const lastScore = game.getState().score
        expect(lastScore).to.be.equal(rounds)
        expect(higad.higad).to.have.lengthOf(rounds + initialSize)
    })
/*
    it('must be able to end game after 10 rounds, restart game with initial state, and win 20 rounds', () => {
        const game = GameFactory(false)
        game.initialize()
        const {score, higad} = game.getState(),
        initialSize = higad.higad.length;
        higad.setDirection(C.DIRECTION_RIGHT)

        expect(score).to.be.equal(0)

        let rounds = 10
        PlayGameFactory(game, rounds)
        const midScore = game.getState().score
        expect(midScore).to.be.equal(rounds)
        expect(higad.higad).to.have.lengthOf(rounds + initialSize)

        higad.move(game.screen.width, game.screen.height)
        game.moveFrame()
        expect(game.program.t.trim().toLowerCase()).to.have.string('game over')

        game.screen.triggerKey(C.KEYS.RESTART)
        expect(score).to.be.equal(0)
        expect(higad).to.be.null
        expect(food).to.be.null
        expect(timer).to.be.null

        rounds = 20
        PlayGameFactory(game, rounds)
        const lastScore = game.getState().score
        expect(lastScore).to.be.equal(rounds)
        expect(origHigad.higad).to.have.lengthOf(rounds + initialSize)
    })
    */
})