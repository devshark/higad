const chai = require('chai')
const assert = chai.assert

const Debugger = require('../src/debugger')
const {ProgramMock, ScreenMock} = require('./utils/mocks')

class Formulate {
    constructor(padding, maxWidth){
        this.padding = padding
        this.maxWidth = maxWidth
    }
    normalize(obj) {
        let stringText = null
        if (obj instanceof Object) {
            stringText = JSON.stringify(obj)
        } else {
            stringText = obj.toString()
        }
        const paddingSize = this.maxWidth - stringText.length
        return `${stringText}${Array(paddingSize).fill(this.padding).join('')}`
    }
}

describe('Debugger', () => {
    it('must set the exact values', () => {
        const program = new ProgramMock()
        const xAxis = 30
        const yAxis = 40;
        const text = Buffer.from('randomstring').toString('base64')
        const d = new Debugger({
            yPosition: 150,
            maxWidth: 200,
            padding: '@',
            enable: false,
            program, /* this is a mock */
        })
        d.write(text, [xAxis, yAxis])
        assert.equal(xAxis, program.x)
        assert.equal(yAxis, program.y)
        assert.equal(text, program.t)
    })

    it('must normalize JSON properly', () => {
        const program = new ProgramMock()
        const maxWidth = 200
        const padding = '@'
        const form = new Formulate(padding, maxWidth)
        const d = new Debugger({
            yPosition: 150,
            maxWidth,
            padding,
            enable: false,
            program, /* this is a mock */
        })
        const jsonText = {test:'chai', mocha:'uson'}
        const resultText = d.normalize(jsonText)
        const expectedText = form.normalize(jsonText, maxWidth)
        assert.equal(expectedText.length, resultText.length)
        assert.equal(expectedText, resultText)
    })

    it('must normalize Text properly', () => {
        const program = new ProgramMock()
        const maxWidth = 200
        const padding = '@'
        const form = new Formulate(padding, maxWidth)
        const d = new Debugger({
            yPosition: 150,
            maxWidth,
            padding,
            enable: false,
            program, /* this is a mock */
        })
        const text = Buffer.from('randomstring').toString('base64')
        const resultText = d.normalize(text)
        const expectedText = form.normalize(text, maxWidth)
        assert.equal(expectedText.length, resultText.length)
        assert.equal(expectedText, resultText)
    })

    it('must not write if debug is disabled', () => {
        const program = new ProgramMock()
        const text = Buffer.from('randomstring').toString('base64')
        const d = new Debugger({
            yPosition: 150,
            maxWidth: 200,
            padding: '@',
            enable: false,
            program, /* this is a mock */
        })
        d.log(text)
        assert.equal(program.t, null)
        assert.equal(program.x, null)
        assert.equal(program.y, null)
    })

    it('must write if debug is enabled', () => {
        const program = new ProgramMock()
        const maxWidth = 200
        const padding = '@'
        const yPosition = 150
        const form = new Formulate(padding, maxWidth)
        const text = Buffer.from('randomstring').toString('base64')
        const d = new Debugger({
            yPosition,
            maxWidth,
            padding,
            enable: true,
            program, /* this is a mock */
        })
        d.log(text)
        assert.equal(program.x, 0)
        assert.equal(program.y, yPosition)
        assert.equal(form.normalize(text), program.t)
    })
})