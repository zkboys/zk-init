#!/usr/bin/env node
var program = require('commander');
var vfs = require('vinyl-fs');
var fs = require('fs');
var through = require('through2');
var path = require('path');
var join = path.join;
var basename = path.basename;

// 这个文件下所有正常写得相对路相对的是 命令 执行路径
program
    .version(require('../package').version)
    .usage('[options] <file ...>')
    .parse(process.argv);
var templateName;
if (program.args && program.args.length == 1) {
    templateName = program.args[0];
}
// 默认模板
if (templateName === undefined) {
    templateName = 'jquery-simple';
}

var templateNames = [
    'jquery-simple',
    'jquery-webpack'
];
//根据输入命令行参数，查找对应的模板
var templateNameArr = templateNames.filter(function (name, index) {
    return templateName === name;
});

if (!templateNameArr || !templateNameArr.length) {
    console.log('No such template: %s', templateName);
    console.log('You can use:');
    for (var i = 0; i < templateNames.length; i++) {
        console.log(templateNames[i]);
    }
    return;
} else {
    initTemplate(templateName);
}


function initTemplate(templateName) {
    var cwd = join(__dirname, '../template', templateName);
    var dest = process.cwd();//返回运行当前脚本的工作目录的路径。
    vfs.src('**/*', {cwd: cwd, cwdbase: true, dot: true})
        .pipe(template(dest))
        .pipe(vfs.dest(dest))
        .on('end', function () {
            fs.renameSync(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
            var needInstall = fs.existsSync(path.join(dest, 'package.json'));
            if(needInstall){
                require('../lib/install');
            }


        })
        .resume();
}

function template(dest) {
    return through.obj(function (file, enc, cb) {
        if (!file.stat.isFile()) {
            return cb();
        }

        console.log('Write %s', simplifyFilename(join(dest, basename(file.path))));
        this.push(file);
        cb();
    });
}

function simplifyFilename(filename) {
    return filename.replace(process.cwd(), ".");
}
