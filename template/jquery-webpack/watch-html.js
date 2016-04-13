// RUNMOD 是在webpack.config.js中配置的： new webpack.DefinePlugin({"RUNMOD": JSON.stringify(runmod)}),
if (RUNMOD === 'devserver') {
    require('./index.html');// 这个引入只是让index.html可以被webpack watch 监听
    require('./demo/demo.html');
}