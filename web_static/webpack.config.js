const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')

// Using a fork of webpack-livereload-plugin because it doesn't support webpack v5
// const LiveReloadPlugin = require('webpack-livereload-plugin')
const LiveReloadPlugin = require('@kooneko/livereload-webpack-plugin')

const production = process.env.npm_lifecycle_event == 'build'

const confString = fs.readFileSync('../config.json', 'utf8')
const conf = JSON.parse(confString)

module.exports = {
  entry: {
    bundel: './dev/js/index.js'
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, './build/')
  },
  resolveLoader: {
    extensions: [
      '.js',
      '.json',
      '.styl',
      '.svg'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            comments: false,
            shouldPrintComment: val => false
          }
        }
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    ...(production ? [new CleanWebpackPlugin()] : [new LiveReloadPlugin()]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': production
        ? '"production"'
        : '"development"',
      WEBPACK_PRODUCTION: production,
      CONF_TITLE: JSON.stringify(conf.title),
      CONF_SPONSOR: JSON.stringify(conf.sponsor),
      CONF_COMMUNITY: JSON.stringify(conf.community),
    }),
    new HtmlWebpackPlugin({
      production: production,
      template: 'dev/index.html',
      inject: false,
      conf_title: conf.title,
      webAnalytics: conf.webAnalytics,
    })
  ],
  stats: {
    colors: true
  },
  mode: production ? 'production' : 'development',
  devtool: production ? 'hidden-nosources-source-map' : 'eval-source-map',
}
