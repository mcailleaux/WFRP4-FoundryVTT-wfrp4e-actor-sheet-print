const path = require('path');

module.exports = {
  entry: './src/main.ts',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    publicPath: '',
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
