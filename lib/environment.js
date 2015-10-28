'use strict';

function Environment() {
}

Environment.prototype.extend = function (name, value) {
    var that = new Environment();
    that.name = name;
    that.value = value;
    that.parent = this;
    return that;
};

Environment.prototype.lookup = function (name) {
    if (typeof this.name === 'undefined') {
        return null;
    } else if (this.name === name) {
        return this.value;
    } else {
        return this.parent.lookup(name);
    }
};

// Exports

module.exports = {
	Environment: Environment,
};
