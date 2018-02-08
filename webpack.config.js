/**
 * Created by tangyuhui on 2018/1/23.
 */
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{'vue':['./src/vue'],'test':['./src/test']} ,
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
    devtool:'source-map',
    plugins: [new HtmlWebpackPlugin({
        template: 'index.html',
        chunks:['vue']
    }),new HtmlWebpackPlugin({
    	filename:'test.html',
        template: './test.html',
        chunks:['test']
    })]
};