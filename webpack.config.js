const webpack           = require('webpack');
const path              = require('path');
const nodeExternals     = require('webpack-node-externals');

var nodeModulesPath     = path.resolve(__dirname, 'node_modules');
var buildPath           = path.resolve(__dirname, 'build');
var crawlerApp          = path.resolve(__dirname, 'crawler', 'crawler.js');

var config = {
  name: 'bart-watch',
  target: 'node',
  devtool: 'source-map',

  entry: {
    crawler: crawlerApp,
  },

  output: {
    path: buildPath,
    filename: "[name].js"
  },

  externals: [nodeExternals()],
};

module.exports = config;