module.exports = function(config) {
    config.set({
        autoWatch: true,

        browsers: ['PhantomJS'],

        frameworks: ['jasmine'],

        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            'js/**/*_spec.js'
        ],

        preprocessors: {
            // add webpack as preprocessor
            'js/**/*_spec.js': ['webpack']
        },

        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel-loader',
                    },
                    {
                        test: /\.css$/,
                        loader: 'style!css-loader?sourceMap!postcss-loader',
                    },
                ],
            },
            node: {
                 fs: "empty"
            },
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },

        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
        ]
    });
};
