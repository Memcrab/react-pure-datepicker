const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV;

const externals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
  ['react-pure-modal']: {
    root: 'react-pure-modal',
    commonjs2: 'react-pure-modal',
    commonjs: 'react-pure-modal',
    amd: 'react-pure-modal',
  },
};

const config = {
  entry: {
    'react-pure-datepicker': path.join(__dirname, './src/react-pure-datepicker.js'),
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /(node_modules|dist)/ },
    ],
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].min.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
  },
  externals,
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    })
  );
}

module.exports = config;
