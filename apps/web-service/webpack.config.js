// webpack.config.js
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Mode: production for small Bundle
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // run env Node.js
  target: 'node',
  // using devtool only Local (debug easier)
  devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'hidden-source-map',
  
  externals: [nodeExternals()], // not to include node_modules in the Bundle

  entry: slsw.lib.entries, // Webpack will find entry points from serverless.yml
  
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  
  module: {
    rules: [
      {
        test: /\.ts$/, // Specify that .ts files should be handled
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  
  resolve: {
    extensions: ['.ts', '.js'],
  },
};