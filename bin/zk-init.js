#!/usr/bin/env node
if (process.argv.length === 3 &&
    (process.argv[2] === '-v' || process.argv[2] === '--version')) {
    console.log(require('../package').version);
    return;
}
if (process.argv.length === 3 &&
    (process.argv[2] === '-h' || process.argv[2] === '--help')) {
    console.log('Help is not completed');
    return;
}
console.log(process.argv);
console.log('you can run zk-init -h to show  how to use this tool!');
