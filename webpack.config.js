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
        }]
    },
    optimization: {
        minimize: true,
    }
}