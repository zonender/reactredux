import webpack from 'webpack';
import path from 'path';
const htmlWebpackPlugin = require('html-webpack-plugin');

//our app third party dependencies
const VENDOR_LIBS = [
  'babel-polyfill', 'bootstrap', 'jquery', 'react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux',
  'redux', 'redux-thunk', 'toastr'
];

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: {
    vendor: VENDOR_LIBS,
    bundle: [path.resolve(__dirname, 'src/index'), 'webpack-hot-middleware/client?reload=true', 'eventsource-polyfill']
  },
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: '[name][hash].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new htmlWebpackPlugin({
        template: 'src/index.html' //if we do not specifiy a template, it will use the default one
      }),
      //this plugin will make sure there is no duplicate modules between vendor.js and bundle.js if there are it will remove them from bundle.js and put them in vendor.js
      // Extract all 3rd-party modules into a separate chunk
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      //without this you will get: Uncaught ReferenceError: jQuery is not defined
      new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
      })
    ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.css)$/, loaders: ['style', 'css']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  }
};
