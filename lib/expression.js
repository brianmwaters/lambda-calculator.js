// Suppress warnings about the "eval" method we define below
/*jshint evil: true
*/

'use strict';

/*
 * expression module
 *
 * Represents a lambda expression
 *
 * Usage:
 *
 * // Import the module
 * var expression = require('./lib/expression');
 *
 * // Create a variable
 * variable = new expression.Variable(name);
 *
 * // Create a lambda abstraction
 * abstraction = new expression.Abstraction(param, body);
 *
 * // Create an application
 * application = new expression.Application(left, right);
 *
 * // Evaluate an expression in an environment
 * evaluated = unevaluated.eval(environment);
 *
 * // Pretty-print an expression
 * prettyPrinted = someExpression.toString();
 */

// Helper functions

function parenthesize(str) {
    return '(' + str + ')';
}

// Constructors

function Expression() {
}

function Variable(name) {
    this.name = name;
}

function Abstraction(param, body) {
    this.param = param;
    this.body = body;
}

function Closure(param, body, environment) {
    this.param = param;
    this.body = body;
    this.environment = environment;
}

function Application(left, right) {
    this.left = left;
    this.right = right;
}

// Prototypes

Variable.prototype = new Expression();
Abstraction.prototype = new Expression();
Closure.prototype = new Abstraction();
Application.prototype = new Expression();

// eval

Variable.prototype.eval = function (environment) {
    var binding = environment.lookup(this.name);
    if (binding === null) {
        return this;
    } else {
        return binding;
    }
};

Abstraction.prototype.eval = function (environment) {
    return new Closure(this.param, this.body, environment);
};

Application.prototype.eval = function (environment) {
    return this.left.eval(environment).apply(this.right.eval(environment));
};

// apply

Expression.prototype.apply = function (argument) {
    return new Application(this, argument);
};

Abstraction.prototype.apply = function (argument) {
    return this.body.eval(this.environment.extend(this.param.name, argument));
};

// toString

Variable.prototype.toString = function () {
    return this.name;
};

Abstraction.prototype.toString = function (position) {
    var params,
        that;

    // "position" is a hack to enable optimal (ie, minimal) parenthesization
    if (typeof position !== 'undefined' && !position.rightmost) {
        return parenthesize(this);
    }

    params = '';
    that = this;
    do {
        params += that.param + ' ';
        that = that.body;
    } while (that.hasOwnProperty('param'));
    return 'λ ' + params + '. ' + that;
};

Closure.prototype.toString = function () {
    return '[Closure]';
};

Application.prototype.toString = function (position) {
    if (typeof position === 'undefined') {
        position = {
            leftmost: true,
            rightmost: true
        };
    }

    if (!position.leftmost) {
        return parenthesize(this);
    }

    return this.left.toString({leftmost: position.leftmost, rightmost: false}) +
           ' ' +
           this.right.toString({leftmost: false,
                                rightmost: position.rightmost});
};

// Exports

module.exports = {
    Variable: Variable,
    Abstraction: Abstraction,
    Closure: Closure, // needed for testing
    Application: Application
};
