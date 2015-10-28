'use strict';

var parser = require('./lib/parser.js'),
    expression = require('./lib/expression.js'),
    environment = require('./lib/environment.js');

module.exports = {
    parser: parser,
    expression: expression,
    environment: environment,

    interpret: function (input) {
        var parsed,
            evaluated;

        parsed = parser.parse(input);
        evaluated = parsed.eval(new environment.Environment());

        return evaluated.toString();
    }
};
