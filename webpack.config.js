module.exports = {
  entry: './src/index',
  output: {
    libraryTarget: 'umd',
    library: 'calcReach',
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
