const path = require('path');

module.exports = {
  // paths
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  // gzip
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  // report
  bundleAnalyzerReport: process.env.npm_config_report,
};
