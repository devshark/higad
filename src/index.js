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