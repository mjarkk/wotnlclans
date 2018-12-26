const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const production = process.env.npm_lifecycle_event == 'build'

module.exports = {
  entry: {
    bundel: './dev/js/index.js'
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, './build/')
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
      },{
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader' 
      }
    ]
  },
  resolve: {
    alias:  production 
      ? {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      } : {}
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': production 
        ? '"production"' 
        : '"development"'
    }),
    new HtmlWebpackPlugin({
      production: production,
      template: 'dev/index.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  stats: {
    colors: true
  },
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development'
}
