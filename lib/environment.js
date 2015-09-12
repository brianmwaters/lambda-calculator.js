'use strict';

/*
 * environment module
 *
 * Maps variable names to values
 *
 * Usage:
 *
 * // Import the module
 * environment = require('./lib/environment');
 *
 * // The empty environment
 * empty = new environment.Environment();
 *
 * // Extend an environment with a new binding
 * newInstance = oldInstance.extend('newName', newValue);
 *
 * // Look up a binding
 * someValue = someInstance.lookup('someName');
 */

var empty;

function Environment() {
}

Environment.prototype.extend = function (name, value) {
    var that = new Environment();
    that.name = name;
    that.value = value;
    that.parent = this;
    return that;
};

/*
Environment.prototype.deepExtend = function (shadowingEnvironment) {
    var that;
    if (typeof shadowingEnvironment.name === 'undefined') {
        return this;
    } else {
        that = new Environment();
        that.name = shadowingEnvironment.name;
        that.value = shadowingEnvironment.value;
        that.parent = this.deepExtend(shadowingEnvironment.parent);
        return that;
    }
};
*/

Environment.prototype.lookup = function (name) {
    if (typeof this.name === 'undefined') {
        return null;
    } else if (this.name === name) {
        return this.value;
    } else {
        return this.parent.lookup(name);
    }
};

empty = new Environment();

// Exports

module.exports = {
	Environment: Environment,
    empty: empty
};
