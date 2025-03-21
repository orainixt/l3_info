const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PRODUCTION = false;

module.exports = {
  entry: {
    'index' : './src/scripts/index.js', 
    'admin' : './src/scripts/admin.js', 
    'voter' : './src/scripts/voter.js', 
  },
  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'eval-source-map'),
  output: {
    path: path.resolve(__dirname, '../', 'server/public'),
    filename: 'scripts/[name]-bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      filename: "html/index.html",
      chunks : ['index']
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/about.html",
      filename: "html/about.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/error.html",
      filename: "html/error.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/admin.html",
      filename: "html/admin.html",
      chunks : ['admin']
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/voter.html",
      filename: "html/voter.html",
      chunks : ['voter']
    }),

    new CopyPlugin({
      patterns: [
        // {
        //   context: path.resolve(__dirname, 'src', 'utils', 'images'),
        //   from: '**/*',
	      //   to:   'assets/images/[name][ext]',
        //   noErrorOnMissing: true
	      // },
        {
          context: path.resolve(__dirname, 'src', 'utils', 'style'),
          from: '**/*',
	        to:   'utils/style/[name][ext]',
          noErrorOnMissing: true
	      },
      ]
   })

  ]
};