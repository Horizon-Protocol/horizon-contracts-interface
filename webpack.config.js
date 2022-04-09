'use strict';

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: ['/node_modules/'],
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
    net: 'empty',
  },
  entry: './src/index.ts',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'horizon',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [path.resolve(__dirname, 'src', 'horizon.d.ts')],
    }),
  ],
};
