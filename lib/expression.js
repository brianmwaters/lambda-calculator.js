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

// Superclass (for shared functionality)

function Expression() {
}

Expression.prototype.apply = function (argument) {
    return new Application(this, argument);
};

// Variable AST node

function Variable(name) {
    this.name = name;
}

Variable.prototype = new Expression();

Variable.prototype.eval = function (environment) {
    var binding = environment.lookup(this.name);
    if (binding !== null) {
        return binding;
    } else {
        return this;
    }
};

Variable.prototype.toString = function () {
    return this.name;
};

// Abstraction AST node

function Abstraction(param, body) {
    this.param = param;
    this.body = body;
}

Abstraction.prototype = new Expression();

Abstraction.prototype.eval = function (environment) {
    return new Closure(this.param, this.body, environment);
};

Abstraction.prototype.apply = function (argument) {
    return this.body.eval(this.environment.extend(this.param.name, argument));
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

// Closure AST node

function Closure(param, body, environment) {
    this.param = param;
    this.body = body;
    this.environment = environment;
}

Closure.prototype = new Abstraction();

Closure.prototype.toString = function () {
    return '[Closure]';
};

// Application AST node

function Application(left, right) {
    this.left = left;
    this.right = right;
}

Application.prototype = new Expression();

Application.prototype.eval = function (environment) {
    return this.left.eval(environment).apply(this.right.eval(environment));
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
