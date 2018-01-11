const { resolve } = require('path');

module.exports = {
  entry: "./src/main.js",
  externals: ['tabris'],
  output: {
    libraryTarget: 'commonjs2',
    filename: "index.js",
    path: __dirname + "/dist"
  },
  resolve: { extensions: [".ts", ".tsx", ".js"] },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  }
};
