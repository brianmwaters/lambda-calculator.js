'use strict';

var expression = require('./expression');

function ParseError(message) {
    this.message = message;
}

ParseError.prototype = new Error();
ParseError.prototype.name = 'ParseError';

function parse(line) {
    var i,
        ret;

    function match(rgx) {
        var matches = line.slice(i).match(rgx);
        if (!matches) {
            return false;
        }
        return matches[0];
    }

    function tokenize(rgx) {
        var token = match(rgx);
        if (!token) {
            return false;
        }
        i += token.length;
        return token;
    }

    function parseWs() {
        return tokenize(/^[ \t\n\r]+/); // whitespace
    }

    function parseName() {
        var name = tokenize(/^[a-zA-Z][a-zA-Z0-9]*/); // name
        if (!name) {
            return false;
        }
        return new expression.Variable(name);
    }

    function parseAbst() {
        var params, body, that;

        if (!tokenize(/^(?:λ|\\)/)) { // lambda or backslash
            return false;
        }

        parseWs();

        params = [];
        that = parseName();
        while (that) {
            params.push(that);
            parseWs();
            that = parseName();
        }
        if (params.length === 0) {
            throw new ParseError('Expected parameter list');
        }

        if (!tokenize(/^\./)) { // dot
            throw new ParseError('Expected \'.\'');
        }

        parseWs();

        body = parseExpr();

        that = new expression.Abstraction(params.pop(), body);
        while (params.length > 0) {
            that = new expression.Abstraction(params.pop(), that);
        }
        return that;
    }

    function parseParens() {
        var expr;

        if (!tokenize(/^\(/)) { // open paren
            return false;
        }

        parseWs();

        expr = parseExpr();

        parseWs();

        if (!tokenize(/^\)/)) { // close paren
            throw new ParseError('Expected \')\'');
        }

        return expr;
    }

    function parseExpr() {
        var parts, that;

        parts = [];
        that = parseName() || parseAbst() || parseParens();
        while (that) {
            parts.push(that);
            parseWs();
            that = parseName() || parseAbst() || parseParens();
        }
        if (parts.length === 0) {
            throw new ParseError('Expected lambda expression');
        }

        that = parts.shift();
        while (parts.length > 0) {
            that = new expression.Application(that, parts.shift());
        }
        return that;
    }

    i = 0;
    parseWs();
    ret = parseExpr();
    parseWs();
    if (i !== line.length) {
        throw new ParseError('Unexpected character');
    }
    return ret;
}

// Exports

module.exports = {
    ParseError: ParseError,
    parse: parse
};
