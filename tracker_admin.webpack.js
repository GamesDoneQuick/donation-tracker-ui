var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var sharedConfig = require('./shared.webpack')({hmr: true});
var WebpackManifestPlugin = require('webpack-yam-plugin');

module.exports = {
    context: __dirname,
    entry: ['./js/init', './js/admin'],
    output: {
        'filename': 'admin.js',
        'pathinfo': true,
        'path': __dirname + '/static/gen',
        'publicPath': '/webpack',
    },
    module: sharedConfig.module,
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new WebpackManifestPlugin({
            manifestPath: __dirname + '/ui-admin.manifest.json',
            outputRoot: __dirname + '/static'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
            __DEVTOOLS__: true,
        }),
        new ExtractTextPlugin("admin.css", {
            allChunks: true
        }),
    ],
    devServer: sharedConfig.devServer,
    resolve: sharedConfig.resolve,
    devtool: 'eval-source-map',
};
