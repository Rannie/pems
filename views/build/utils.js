'use strict';

const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.assetsPath = (_path) => {
  return path.posix.join(config.assetsSubDirectory, _path);
};

exports.cssLoaders = (_options = {}) => {
  let loaders = [];

  // style loader
  !_options.extract && loaders.push({loader: 'style-loader'});
  // css loader
  loaders.push({
    loader: 'css-loader',
    options: {
      importLoaders: _options.importLoaders
    }
  });
  // postcss loader
  loaders.push({loader: 'postcss-loader'});
  // sass loader
  _options.isSass && loaders.push({loader: 'sass-loader'});

  if (_options.extract) {
    return [MiniCssExtractPlugin.loader, ...loaders];
  }
  return loaders;
};
