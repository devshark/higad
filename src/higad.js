/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
const C = require('./constants')
const Food = require('./food')
const {isInside} = require('./utils')
require('./Array.prototype.equals')

class Higad {
    constructor (x, y) {
        this.onInit([x, y])
    }

    onInit (headPosition) {
        if (!headPosition instanceof Array || headPosition.length !== 2) {
            throw new Error('Argument headPosition must be an array with exactly two elements!')
        }
        this.higad = [
            headPosition,
            [headPosition[0]-1, headPosition[1]],
            [headPosition[0]-2, headPosition[1]],
        ]
        this.direction = null
        this.hasEaten = false
    }

    getHead () {
        return this.higad[0].slice()
    }

    didHitItself () {
        return this.higad.slice(1).find(a => this.getHead().equals(a)) !== undefined
    }

    didHitEdge (maxHeight, maxWidth) {
        const head = this.getHead()
        return [0, maxHeight].includes(head[1]) || [0, maxWidth].includes(head[0])
    }

    getDirection () {
        return this.direction
    }

    setDirection (direction) {
        if (C.DIRECTIONS.includes(direction)) this.direction = direction
    }

    isInside (location) {
        return isInside(this.higad, location)
    }

    feed (food) {
        if (!(food instanceof Food)) {
            throw new Error('I can only eat Food!')
        }
        return this.hasEaten = food.isInside(this.higad)
    }

    moveLeft () {
        const head = this.getHead()
        return this.move(head[0]-1)
    }

    moveRight () {
        const head = this.getHead()
        return this.move(head[0]+1)
    }

    moveUp () {
        const head = this.getHead()
        return this.move(head[0], head[1]-1)
    }

    moveDown () {
        const head = this.getHead()
        return this.move(head[0], head[1]+1)
    }
    
    move (x, y) {
        if (x === undefined && y === undefined) {
            // if there's no specific location to move, just move normally
            const direction = this.getDirection()
            switch (direction) {
                case C.DIRECTION_UP:
                    return this.moveUp()
                    break;
                case C.DIRECTION_DOWN:
                    return this.moveDown()
                    break;
                case C.DIRECTION_LEFT:
                    return this.moveLeft()
                    break;
                case C.DIRECTION_RIGHT:
                    return this.moveRight()
                    break;
            }
        } else {
            // move to the new location as specified
            const origHead = this.getHead()
            x = x || origHead[0]
            y = y || origHead[1]
            const newHead = [x, y]
            this.higad.unshift(newHead)
        }
        if (!this.hasEaten) {
            // if it hasn't eaten yet, move the tail forward then end the function
            return this.higad.pop()
        }
        // it will only reach this if he has eaten
        // so unset the meal and return
        return this.hasEaten = false
    }
}

module.exports = Higad