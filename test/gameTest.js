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
        try {
            // const foodLocation = food.getLocation()
            expect(higad.higad).to.have.lengthOf(3)
            expect(score).to.be.equal(0)
            PlayGameFactory(game, 1)
            // higad.move(foodLocation[0], foodLocation[1]) // move higad onto the food
            // higad.setDirection(C.DIRECTION_RIGHT)
            // game.moveFrame()
            const {score: newScore} = game.getState()
            expect(food.isInside(higad.higad)).to.be.true
            expect(newScore).to.be.equal(1)
            // console.dir({food: foodLocation, body: higad.higad, in: food.isInside(higad.higad)})
            expect(higad.higad).to.have.lengthOf(4)
        } catch (err) {
            console.log({higad, food})
            throw err
        }
    })

    it('must survive 10 rounds', () => {
        const game = GameFactory(false)
        game.initialize()
        const {score, higad} = game.getState(),
        initialSize = higad.higad.length,
        rounds = 10
        try {
            higad.setDirection(C.DIRECTION_RIGHT)
            expect(score).to.be.equal(0)
            PlayGameFactory(game, rounds)
            const {score: lastScore} = game.getState()
            expect(lastScore).to.be.equal(rounds)
            expect(higad.higad).to.have.lengthOf(rounds + initialSize)
        } catch (err) {
            const {higad, food, score} = game.getState()
            console.log({rounds, state: game.getState(), higad: higad.higad, food: food.getLocation(), score})
            throw err;
        }
    })

    it('must be able to end game after 10 rounds, restart game with initial state, and win 20 rounds', () => {
        const game = GameFactory(false)
        game.initialize()
        const {score, higad} = game.getState(),
        initialSize = higad.higad.length;
        higad.setDirection(C.DIRECTION_RIGHT)

        expect(score).to.be.equal(0)
        let rounds = 10

        try {
            PlayGameFactory(game, rounds)
            const {score: midScore} = game.getState()
            expect(midScore).to.be.equal(rounds)
            expect(higad.higad).to.have.lengthOf(rounds + initialSize)
    
            game.start = () => { /* override this method to do nothing; console.log('Started') */ }

            higad.move(game.screen.width, game.screen.height)
            game.moveFrame()
            expect(game.program.t.trim().toLowerCase()).to.have.string('game over')
    
            game.screen.triggerKey(C.KEYS.RESTART)

            const {score: freshScore, timer, food: freshFood, higad: freshHigad} = game.getState()
            expect(freshScore).to.be.equal(0)
            expect(timer).to.be.null
            expect(freshFood).to.be.an.instanceof(Food)
            expect(freshHigad).to.be.an.instanceof(Higad)
            expect(freshHigad.higad.length).to.be.equal(initialSize)
    
            rounds = 20
            PlayGameFactory(game, rounds)
            const {score: lastScore} = game.getState()
            expect(lastScore).to.be.equal(rounds)
            expect(freshHigad.higad).to.have.lengthOf(rounds + initialSize)
        } catch (err) {
            const {higad, food, score} = game.getState()
            console.log({rounds, state: game.getState(), higad: higad.higad, food: food.getLocation(), score})
            throw err;
        }

    })
    
})