var exec = require('child_process').exec;

exec("git add .", function (error, stdout, stderr) {

    if (error !== null) {
        console.log('git add error: ' + error);
        return;
    }
    exec("git commit -m '测试'", function (error, stdout, stderr) {

        if (error !== null) {
            console.log('git commit error: ' + error);
            return;
        }
        exec("git push origin master ", function (error, stdout, stderr) {

            if (error !== null) {
                console.log('git push error: ' + error);
                return;
            }

        });

    });

});