'use strict';

var lambdaCalculator = require('./index.js');

function runWithTTY() {
    var readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.on('line', function (line) {
        try {
            console.log(lambdaCalculator.interpret(line));
        } catch (e) {
            console.log(e.toString());
        }

        readline.prompt();
    });

    readline.on('close', function () {
        console.log(''); // Print a newline to clean up
    });

    // Synchronously executed
    readline.prompt();
}

function runWithStream() {
    var input = '';

    process.stdin.on('data', function (chunk) {
        input += chunk;
    });

    process.stdin.on('end', function () {
        try {
            console.log(lambdaCalculator.interpret(input));
        } catch (e) {
            console.log(e.toString());
        }
    });
}

if (process.stdin.isTTY === true && process.stdout.isTTY === true) {
    runWithTTY();
} else {
    runWithStream();
}
