var webpack = require('webpack');

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
    },
    plugins:[
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress:{
            warnings: false
          }
        })
    ],
    resolve: {
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        }
    }   
};