expect = require('chai').expect
expression = require '../lib/expression.js'
environment = require '../lib/environment.js'

instance = undefined

ex = 'ex'
why = 'why'
zee = 'zee'

beforeEach ->
    instance = environment.empty
        .extend('shadowedName', ex)
        .extend('shadowedName', why)
        .extend('unshadowedName', zee)

describe 'Looking up', ->

    describe 'a bound name', ->

        it 'should return the most tightly bound value', ->
            expect(instance.lookup 'shadowedName')
                .to.be.equal why

    describe 'an unbound name', ->

        it 'should return null', ->
            expect(instance.lookup 'unboundName')
                .to.be.null
