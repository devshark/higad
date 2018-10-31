/*
* Higad
* A snake-like game inspired by Engineer-man's Python-based snake game
* Author: Anthony Lim
*/
/* Archived version
const blessed = require('blessed')
const program = blessed.program()
const screen = blessed.screen({
    useBCE: true,
    smartCSR: true,
    title: 'Higad Paxenxia'
})

const Higad = require('./higad')
const debug = false

const higad = new Higad(program, screen, debug)
higad.onInit()
*/
const cursor = require('ansi')(process.stdout)
const blessed = require('blessed')
const program = blessed.program()
const screen = blessed.screen({
    useBCE: true,
    smartCSR: true,
    title: 'Higad Paxenxia'
})

const Game = require('./game')
const debug = false

const game = new Game({
    blessed, program, screen, cursor, debug,
})
game.initialize()
game.start()