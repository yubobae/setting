const pkg = require('./package.json');

const path = pkg.paths;
const browserslist = require('./browserslist');
const webpack = require('webpack');

module.exports = {
  watch: false,
  resolve: {
    modules: ['node_modules', path.SRC.RESOURCES + '/javascripts/lib'],
    alias: {
      'jqueryEasing': 'jquery.easing',
      'jquerySlick': 'slick-carousel'
    }
  },
  entry: {
    'vendors': [path.SRC.RESOURCES + '/javascripts/_vendors'],
    'commons': [path.SRC.RESOURCES + '/javascripts/_commons']
  },
  output: {
    path: path.DEST.JS,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [[
            'es2015',
            {
              'targets': { 'browsers': browserslist },
              'loose': true,
              'modules': false
            }
          ]],
          plugins: [
            'transform-proto-to-assign',
            'transform-object-assign'
          ]
        }
      }]
    }
    // {
    //   test: require.resolve('jquery'),
    //   use: [{
    //     loader: 'expose-loader',
    //     query: 'jQuery'
    //   }, {
    //     loader: 'expose-loader',
    //     query: '$'
    //   }]
    // }
    ]
  },
  devtool: '#cheap-module-source-map',
  plugins: [

    new webpack.ProvidePlugin({
      // $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      moment: 'moment'
      // angular: 'angular'
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: { comments: false },
      compress: { warnings: false },
      // mangle: {
      //   // Skip mangling these
      //   except: ['$super', '$', 'jQuery', 'exports', 'require', 'moment', 'Promise', 'Angular', 'angular', 'window']
      // },
      exclude: /\/lib/,
      mangle: false
    })
  ]
};
