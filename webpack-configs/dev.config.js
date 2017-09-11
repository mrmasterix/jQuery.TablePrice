const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config.json');

module.exports = {
  devtool: 'source-map',

  entry: {
    bundle: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, '../src/bundle.js'),
    ],
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },

  externals: {
    react: 'commonjs react',
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react', 'stage-3'],
              plugins: [
                'transform-runtime',
                'transform-decorators-legacy',
              ],
              sourceMaps: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?name=./img/[name].[ext]', {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        }],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),

    new ExtractTextPlugin({
      filename: './css/main.css',
      disable: false,
      allChunks: true,
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      filename: './index.html',
    }),

    new webpack.DefinePlugin({
      envConfig: JSON.stringify(config.development),
      commonConfig: JSON.stringify(config.common),
    }),
  ],
};
