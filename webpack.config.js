module.exports = {
    output: {
        filename: "index-min.js"
    },
    module: {
      loaders: [{ 
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader" 
      }]
    }
};