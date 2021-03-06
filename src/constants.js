const DIRECTION_UP = 'up'
const DIRECTION_DOWN = 'down'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

module.exports = Object.freeze({
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    CHAR_HIGAD: '#',
    CHAR_FOOD: "\u2764",
    CHAR_SPACE: ' ',
    OPPOSITES: {
        [DIRECTION_UP]: DIRECTION_DOWN,
        [DIRECTION_DOWN]: DIRECTION_UP,
        [DIRECTION_LEFT]: DIRECTION_RIGHT,
        [DIRECTION_RIGHT]: DIRECTION_LEFT,
    },
    KEYS: {
        EXIT: ['escape', 'q', 'C-c'],
        RESTART: ['space'],
        DIRECTIONS: [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT],
    }
})