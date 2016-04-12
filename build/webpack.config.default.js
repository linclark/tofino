// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const path = require('path');

const ExternalsPlugin = require('../node_modules/webpack/lib/ExternalsPlugin');
const FunctionModulePlugin = require('../node_modules/webpack/lib/FunctionModulePlugin');
const NodeTemplatePlugin = require('../node_modules/webpack/lib/node/NodeTemplatePlugin');
const LoaderTargetPlugin = require('../node_modules/webpack/lib/LoaderTargetPlugin');

/**
 * The intent is that this config is kept as simple as possible - just the
 * minimum needed to build, without development or production optimizations.
 *
 * Changes for running in development/live are made in webpack.config.{dev|prod}.js
 */
const root = path.join(__dirname, '..');

module.exports = {
  entry: {
    browser: ['babel-polyfill', path.join(root, 'ui', 'browser', 'index.js')],
  },
  context: root,
  output: {
    path: path.join(root, 'static', 'built'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    publicPath: 'http://localhost:8765/built/',
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(root, 'ui'),
          path.join(root, 'shared'),
        ],
      },
    ],
  },
  target: (compiler) => {
    compiler.apply(
      new NodeTemplatePlugin({
        asyncChunkLoading: true,
      }),
      new FunctionModulePlugin({
        path: path.join(root, 'static', 'built'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        publicPath: 'http://localhost:8765/built/',
      }),
      new ExternalsPlugin('commonjs', [
        'app',
        'auto-updater',
        'browser-window',
        'content-tracing',
        'dialog',
        'electron',
        'global-shortcut',
        'ipc',
        'ipc-main',
        'menu',
        'menu-item',
        'power-monitor',
        'power-save-blocker',
        'protocol',
        'session',
        'web-contents',
        'tray',
        'clipboard',
        'crash-reporter',
        'native-image',
        'screen',
        'shell',
      ]),
      new LoaderTargetPlugin('atom')
    );
  },
  plugins: [
  ],
};
