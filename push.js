var exec = require('child_process').exec;
var program = require('commander');

program
    .version(require('./package').version)
    .usage('[options] <file ...>')
    .option('-m, --message <说明>  ', '提交说明')
    .parse(process.argv);
console.log(program.message, process.argv);
if (!program.message) {
    console.error('ERROR:请输入注释！！！');
    return
}
exec("git add .", function (error, stdout, stderr) {
    stdout && console.log(stdout);
    stderr && console.log(stderr);
    if (error !== null) {
        console.log('git add error: ' + error);
        return;
    }
    exec("git commit -m '测试'", function (error, stdout, stderr) {
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