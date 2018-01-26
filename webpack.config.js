/**
 * Created by tangyuhui on 2018/1/23.
 */
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{'tue':['babel-polyfill','./src/demo2'],
            'compile':['babel-polyfill','./src/compile']} ,
    output: {
        filename: '[name].js?[chunkhash]',
        chunkFilename: "[id].js?[chunkhash]",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'compile.html',
        chunks:['compile']
    })]
};