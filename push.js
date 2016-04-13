var exec = require('child_process').exec;
var program = require('commander');
var fs = require('fs');
program
    .version(require('./package').version)
    .usage('[options] <file ...>')
    .option('-m, --message <说明>  ', '提交说明')
    .parse(process.argv);
if (!program.message) {
    console.error('ERROR:请输入注释！！！');
    return
}
var packageJson = fs.readFileSync('./package.json');

console.log(JSON.parse(packageJson));

exec("git add .", function (error, stdout, stderr) {
    stdout && console.log(stdout);
    stderr && console.log(stderr);
    if (error !== null) {
        console.log('git add error: ' + error);
        return;
    }
    exec("git commit -m '" + program.message + "'", function (error, stdout, stderr) {
        stdout && console.log(stdout);
        stderr && console.log(stderr);
        if (error !== null) {
            console.log('git commit error: ' + error);
            return;
        }
        exec("git push origin master ", function (error, stdout, stderr) {
            stdout && console.log(stdout);
            stderr && console.log(stderr);
            if (error !== null) {
                console.log('git push error: ' + error);
                return;
            }

        });

    });

});