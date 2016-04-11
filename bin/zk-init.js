#!/usr/bin/env node
var child_process = require('child_process');
var rimraf = require('rimraf');

var program = require('commander');

function range(val) {
    return val.split('..').map(Number);
}

function list(val) {
    return val.split(',');
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

function increaseVerbosity(v, total) {
    return total + 1;
}

program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-s, --string <s>', 'An integer argument')
    .option('-i, --integer <n>', 'An integer argument', parseInt)
    .option('-f, --float <n>', 'A float argument', parseFloat)
    .option('-r, --range <a>..<b>', 'A range', range)
    .option('-l, --list <items>', 'A list', list)
    .option('-o, --optional [value]', 'An optional value')
    .option('-c, --collect [value]', 'A repeatable value', collect, [])
    .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
    .parse(process.argv);
console.log(program.string);
console.log(' string: %j', program.string);
console.log(' int: %j', program.integer);
console.log(' float: %j', program.float);
console.log(' optional: %j', program.optional);
program.range = program.range || [];
console.log(' range: %j..%j', program.range[0], program.range[1]);
console.log(' list: %j', program.list);
console.log(' collect: %j', program.collect);
console.log(' verbosity: %j', program.verbose);
console.log(' args: %j', program.args);


if (process.argv.length === 3 && (process.argv[2] === '-v' || process.argv[2] === '--version')) {
    console.log(require('../package').version);
    return;
}
if (process.argv.length === 3 && (process.argv[2] === '-h' || process.argv[2] === '--help')) {
    console.log('Help is not completed');
    return;
}
if (process.argv.length === 4 && (process.argv[2] === '-t' )) {
    console.log('init...');
    var templateName = process.argv[3];
    if (templateName === 'w-list-page') {
        rimraf('./w-list-page', function () {
            child_process.exec('git clone https://github.com/zkboys/w-list-page.git',
                function (error, stdout, stderr) {
                    rimraf('./w-list-page/.git', function () {
                        console.log('complete!!!');
                    });
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        });
    }

    return;
}
console.log('you can run zk-init -h to show  how to use this tool!');
