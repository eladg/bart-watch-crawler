var webpack = require('webpack');
var path    = require('path');
var fs      = require('fs');
var nodeExternals = require('webpack-node-externals');

var nodeModulesPath  = path.resolve(__dirname, 'node_modules');
var buildPath        = path.resolve(__dirname, 'build');

var crawlerApp       = path.resolve(__dirname, 'crawler', 'crawler.js');

var config = {
  name: 'bart-watch',
  target: 'node',
  devtool: 'sourcemap',

  entry: {
    crawler: crawlerApp,
  },

  output: {
    path: buildPath,
    filename: "[name].js"
  },

  externals: [nodeExternals()],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath]
      },
    ]
  },
};

module.exports = config;