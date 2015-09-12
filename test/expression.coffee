expect = require('chai').expect
environment = require '../lib/environment.js'
expression = require '../lib/expression.js'

# A DSL for expressions
vr = (name) -> new expression.Variable(name)
ab = (param, body) -> new expression.Abstraction(param, body);
cl = (param, body, environment) ->
    new expression.Closure(param, body, environment)
ap = (left, right) -> new expression.Application(left, right)

# Some pre-made variables
x = vr 'x'
y = vr 'y'
z = vr 'z'
ex = vr 'ex'
why = vr 'why'

# An empty environment
empty = environment.empty
nonempty = empty
		.extend('x', ex)
        .extend('y', why)

describe 'A variable', ->

    describe 'when created', ->

        it 'should have a name', ->
            expect(x).to.have.ownProperty 'name', 'x'

    describe 'when pretty printed', ->

        it 'should look like itself', ->
            expect(x.toString()).to.equal 'x'

    describe 'when evaluated', ->

        it 'should evaluate to itself, when unbound', ->
            expect(x.eval(empty)).to.deep.equal(x)

        it 'should evaluate to its binding, when bound', ->
            expect(x.eval(nonempty)).to.deep.equal(ex)

describe 'An abstraction', ->

    describe 'when created', ->

        it 'should have a parameter and a body', ->
            expect(ab x, y).to.have.ownProperty 'param', x
            expect(ab x, y).to.have.ownProperty 'body', y

    describe 'when pretty printed', ->

        it 'should use shorthand notation', ->
            expect(ab(x, ab(y, z)).toString()).to.equal 'λ x y . z'

        it 'should not use parentheses', ->
            expect(ab(x, y).toString()).to.equal 'λ x . y'

        it 'except when necessary', ->
            expect(ap(ab(x, y), z).toString()).to.equal '(λ x . y) z'

    describe 'when evaluated', ->

        it 'should evaluate to a closure over the environment', ->
            expect(ab(x, y).eval(nonempty))
                .to.deep.equal(cl x, y, nonempty)

describe 'A closure', ->

    describe 'when created', ->

        it 'should have a parameter, a body, and an environment', ->
            expect(cl x, y, nonempty).to.have.ownProperty 'param', x
            expect(cl x, y, nonempty).to.have.ownProperty 'body', y
            expect(cl x, y, nonempty).to.have.ownProperty 'environment', nonempty

    describe 'when pretty printed', ->

        it 'should not show its internals', ->
            expect((cl x, y, nonempty).toString()).to.equal '[Closure]'

describe 'An application', ->

    describe 'when created', ->

        it 'should have a left and a right', ->
            expect(ap x, y).to.have.ownProperty 'left', x
            expect(ap x, y).to.have.ownProperty 'right', y

    describe 'when pretty printed', ->

        it 'should not use parentheses', ->
            expect(ap(x, y).toString()).to.equal 'x y'

        it 'except when necessary', ->
            expect(ap(x, ap(y, z)).toString()).to.equal 'x (y z)'

    describe 'when evaluated', ->

        it 'should always evaluate its left', ->
            expect(ap(x, z).eval(nonempty)).to.deep.equal(ap ex, z)

        it 'should apply its left to its right, when it is a redex', ->
            expect(ap(ab(x, x), y).eval(empty))
                .to.deep.equal(y)
