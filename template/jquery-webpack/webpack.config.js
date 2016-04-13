var path = require("path");
var join = path.join;
var child_process = require('child_process');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var runmod = process.env.runmod || 'development';
/*
 * 基于不同模式，区分配置
 * */
var configs = {
    "devserver": {
        "path": './dist',
        "publicPath": 'http://localhost:8086/dist/'
    },
    "development": {
        "path": './dist',
        "publicPath": '/s/'
    },
    "test": {
        "path": './dist',
        "publicPath": '/s/'
    },
    "production": {
        "path": './dist',
        "publicPath": '/s/'
    }
};


/*
 * 获取不同的环境配置
 * */
var cfg = configs[runmod] || configs.development;
/*
 * 定义entry
 * 如果项目结构命名有良好的约定，是否考虑使用代码自动生成entry？
 * */
var _entry = {
    //"index": ["./src/home/home.jsx", "./src/home/home-content.jsx"],//会合并成一个index.js
    "index": './index.js',
    "demo": './demo/demo.js'
};
if (runmod === 'devserver') {// 只有devserver模式，才加入监听html文件
    _entry["watch-html"] = './watch-html.js';
}

/*
 * babel参数
 * */
var babelQuery = {
    presets: ['es2015', 'stage-0'],
    plugins: ['add-module-exports', 'typecheck']
};


/*
 * webpack配置
 * */
module.exports = {
    /*
     * 指定node_modules目录, 如果项目中存在多个node_modules时,这个很重要.
     * import js文件时，可以忽略后缀名
     * */
    resolve: {
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')],
        extensions: ['', '.js']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')]
    },
    /*
     * 入口文件配置
     * */
    entry: _entry,
    /*
     * 输出配置
     * path：构建之后的文件存放目录
     * publicPath：js或css等文件，浏览器访问时路径
     * filename：构建之后的文件名
     * */
    output: {
        pathinfo: false,//去掉生成文件的相关注释
        path: join(__dirname, cfg.path),
        publicPath: cfg.publicPath,
        filename: "[name].js",// entry　配置的文件
        chunkFilename: "[name].[chunkhash:8].min.js",//非entry，但是需要单独打包出来的文件名配置，添加[chunkhash:8]　防止浏览器缓存不更新．
        // libraryTarget: 'umd',
        'libraryTarget': 'var',
        //umdNamedDefine: true
    },
    externals: {
        "jquery": "jQuery"
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: babelQuery
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&-restructuring!' + 'autoprefixer-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!' + 'autoprefixer-loader!' + 'less?{"sourceMap":true,"modifyVars":{}}')
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name]-[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({"RUNMOD": JSON.stringify(runmod)}),
        /*
         * 公共文件配置
         * */
        //new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        /*
         * css单独打包成一个css文件
         * 比如entry.js引入了多个less，最终会都打到一个xxx.css中。
         * */
        new ExtractTextPlugin("[name].css", {
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        /*
         * 这样写法 fetch就可以全局使用了，各个不用单独import
         * */
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        /*
         * 把指定文件夹下的文件复制到指定的目录
         */
        new TransferWebpackPlugin([
            {from: './node_modules/jquery/dist'}
        ], path.resolve(__dirname, ''))
    ]
};
