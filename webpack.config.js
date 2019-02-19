const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'app/static/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        }]
    },
    optimization: {
        minimize: true,
    }
}