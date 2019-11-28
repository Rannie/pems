const merge = require('webpack-merge');
const devEnv = require('../config/dev.env');
const baseConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const utils = require('./utils');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../config');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      // sass loader
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: utils.cssLoaders({
          isSass: true,
          importLoaders: 2
        })
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': devEnv
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});
