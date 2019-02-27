const path = require("path");

module.exports = {
<<<<<<< HEAD
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
=======
  mode: "production",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "app/static/js"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  optimization: {
    minimize: true
  }
};
>>>>>>> 0648753d12a3ba6ab14ab76d7ed50c32dd59f16b
