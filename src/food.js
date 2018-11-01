/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
const {isInside} = require('./utils')
require('./Array.prototype.equals')
class Food {
    constructor (maxX, maxY) {
        this.maxX = maxX
        this.maxY = maxY
        const food = this.getFood()
        this.getLocation = () => food
    }
    isInside (locationList) {
        return isInside(locationList, this.getLocation())
    }
    getFood () {
        return [
            parseInt(Math.random() * this.maxX -1),
            parseInt(Math.random() * this.maxY -1),
        ]
    }
}

module.exports = Food