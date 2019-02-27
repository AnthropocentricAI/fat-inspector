const path = require("path");

module.exports = {
    mode: 'production',
    entry: ['./src/index.jsx', './src/sass/main.scss'],
    output: {
        path: path.resolve(__dirname, 'app/static/'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'css/[name].scss.css',
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader?-url'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }]
    },
    optimization: {
        minimize: true,
    }
}
