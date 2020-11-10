const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const fs = require('fs');

const production = process.env.npm_lifecycle_event == 'build'

const conf = fs.readFileSync('../config.json', 'utf8')

module.exports = {
  entry: {
    bundel: './dev/js/index.js'
  },
  output: {
    filename: 'js/[name].[hash].js',
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
      }, {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }, {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  resolve: {
    alias: production
      ? {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      } : {}
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': production
        ? '"production"'
        : '"development"',
      WEBPACK_PRODUCTION: production,
      CONF_BOTTOM_TEXT: conf.bottomText,
      CONF_SPONSOR: conf.sponsor,
      CONF_COMMUNITY: conf.community,
    }),
    new HtmlWebpackPlugin({
      production: production,
      template: 'dev/index.html',
      inject: false
    })
  ],
  stats: {
    colors: true
  },
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development'
}
