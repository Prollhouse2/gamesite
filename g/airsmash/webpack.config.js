const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProvidePlugin = require('webpack').ProvidePlugin;
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  entry: {
    'assets/engine.js': [
      './src/js/main.js'
    ],
    'assets/style.css': [
      './src/css/style.css',
      'perfect-scrollbar/dist/css/perfect-scrollbar.css'
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      PIXI: 'pixi.js'
    }),
    new CopyPlugin([
      { from: './src/assets', to: 'assets' },
      { from: './src/robots.txt', to: 'robots.txt' },
      { from: './src/html/privacy.html', to: 'privacy.html' },
      { from: './src/html/contact.html', to: 'contact.html' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      hash: true,
      inject: 'head'
    }),
    new ExtractTextPlugin("assets/style.css"),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].map'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          fallback: 'style-loader'
        })
      },
    ],
  },
  optimization: {
    minimize: process.env.DEBUG != '1',
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false
          }
        },
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          zindex: false,
        },
      })
    ],
  }
}
