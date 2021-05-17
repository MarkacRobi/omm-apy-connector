const path = require('path');
const build = path.resolve(__dirname, "build");

module.exports = () => ({
  mode: 'production',
  entry: {
    index: './src/OmmApyConnector.ts',
  },

  devtool: 'source-map',
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
  ],
  output: {
    filename: '[name].js',
    path: build,
    // library: "omm-apy-connector",
    // libraryTarget: 'umd'
  }
}) ;
