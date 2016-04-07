module.exports = {
  entry: './src/index',
  output: {
    libraryTarget: 'commonjs2',
    library: 'reach',
    filename: 'build/index.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
