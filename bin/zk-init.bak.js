#!/usr/bin/env node
var program = require('commander');
var child_process = require('child_process');
var rimraf = require('rimraf');
var fs = require('fs');
var ncp = require('ncp').ncp;
var join = require('path').join;
var vfs = require('vinyl-fs');
// 这个文件下所有正常写得相对路相对的是 命令 执行路径
program
    .version(require('../package').version)
    .usage('[options] <file ...>')
    .option('-t, --template-name <s>', 'The name of the template which you want to init')
    .option('-r, --rename <s>', 'Rename the template')
    .option('-n, --nofolder ', 'No folder')
    .parse(process.argv);

console.log(' templateName: %s', program.templateName);

console.log(' rename: %s', program.rename);
console.log(' noFolder: %s', program.nofolder);

console.log(' args: %s', program.args);

var templateNames = fs.readdirSync('../template');
var templateNameArr = templateNames.filter(function (name, index) {
    return program.templateName === name;
});
if (!templateNameArr || !templateNameArr.length) {
    console.log('No such template: %s', program.templateName);
    console.log('You can use:');
    for (var i = 0; i < templateNames.length; i++) {
        console.log(templateNames[i]);
    }
    return;
} else {
    var templateName = templateNameArr[0];
    console.log('init %s...', templateName);
    ncp(join(__dirname ,'../template/'+templateName), './'+templateName, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });

}

