# webpack 构建的jQuery 项目
## requirements
node 4.x以上
## 安装
```
 sudo npm install webpack -g
 sudo npm install webpack-dev-server -g
 npm install
```
## 启动
```
npm run dev
```
浏览器通过 http://localhost:8086/ 访问

## 监听hmtl文件改变，自动刷新浏览器
由于webpack只监听有依赖的文件，像html这种无构建依赖的文件，webpack watch是不会监听得。

通过创建一个watch-html.js文件，需要监听得html文件加入此文件中，并将此文件作为一个entry加入webpack.config.js

webpack.config.js 中通过 new webpack.DefinePlugin({"RUNMOD": JSON.stringify(runmod)}), 使watch-html.js可以获取到RUNMOD,根据RUNMOD判断，只有devserver模式，才会require相关html文件。
 
处理html文件需要一个 raw-loader
```
{
    test: /\.html$/,
    loader: "raw-loader"
},
```




