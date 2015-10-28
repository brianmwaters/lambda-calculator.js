expect = require('chai').expect
environment = require '../lib/environment.js'

fixture = undefined
result = undefined

# dummies
unbound = 'x'

bound = 'y'
bound_value = 'why'

unshadowing = 'z'
unshadowing_value = 'zee'
expect(unshadowing)
    .to.not.equal(bound)
expect(unshadowing_value)
    .to.not.equal(bound_value)

shadowing = 'y'
shadowing_value = 'shadowing why'
expect(shadowing)
    .to.equal(bound)
expect(shadowing_value)
    .to.not.equal(bound_value)

describe 'On the empty envrionment,', ->
    beforeEach ->
        fixture = new environment.Environment

    describe 'looking up an unbound name', ->
        beforeEach ->
            result = fixture.lookup(unbound)

        it 'should return null', ->
            expect(result)
                .to.be.null

describe 'On an environment with one binding,', ->
    beforeEach ->
        fixture = (new environment.Environment)
            .extend(bound, bound_value)

    describe 'looking up the bound name', ->
        beforeEach ->
            result = fixture.lookup(bound)

        it 'should return the bound value', ->
            expect(result)
                .to.equal(bound_value)

    describe 'looking up an unbound name', ->
        beforeEach ->
            result = fixture.lookup(unbound)

        it 'should return null', ->
            expect(result)
                .to.be.null

describe 'On an environment with two bindings,', ->
    beforeEach ->
        fixture = (new environment.Environment)
            .extend(bound, bound_value)
            .extend(unshadowing, unshadowing_value)

    describe 'looking up the shallowly bound name', ->
        beforeEach ->
            result = fixture.lookup(unshadowing)

        it 'should return the shallowly bound value', ->
            expect(result)
                .to.equal(unshadowing_value)

    describe 'looking up the deeply bound name', ->
        beforeEach ->
            result = fixture.lookup(bound)

        it 'should return the deeply bound value', ->
            expect(result)
                .to.equal(bound_value)

    describe 'looking up an unbound name', ->
        beforeEach ->
            result = fixture.lookup(unbound)

        it 'should return null', ->
            expect(result)
                .to.be.null

describe 'On a deep environment with shadowing,', ->
    beforeEach ->
        fixture = (new environment.Environment)
            .extend(bound, bound_value)
            .extend(shadowing, shadowing_value)

    describe 'looking up the shadowed name', ->
        beforeEach ->
            result = fixture.lookup(shadowing)

        it 'should return the shallowest value', ->
            expect(result)
                .to.equal(shadowing_value)
