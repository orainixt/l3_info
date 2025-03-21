const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PRODUCTION = false;

module.exports = {
  entry: {
    'students' : path.resolve(__dirname, './javascript/students.js'),
    'groups' : path.resolve(__dirname, './javascript/groups.js'), 
  },

  output: {
    path: path.resolve(__dirname, '../', 'server/public'),
    filename: 'scripts/[name]-bundle.js'
  },

  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'eval-source-map'),
  
  devServer: {
    static : {
        publicPath: path.resolve(__dirname, 'dist'),
        watch : true
    },
    host: 'localhost',
    port: 8080,
  },

//   module: {
//     rules : [
//         {
//             test: /\.m?js$/,
//             exclude: /(node_modules)/, 
//             use: {
//                 loader: 'babel-loader'
//             }
//         },
//         {
//             test: /\.css$/,
//             use 
//         }
//     ]
//   } pas fini de copier mais au cas ou voir video du prof 

  plugins: [
    new HtmlWebpackPlugin({
      template: "./html/students.html",
      filename: "students.html",
      chunks : ['students']
    }),
    new HtmlWebpackPlugin({
      template: "./html/groups.html",
      filename: "groups.html",
    }),

    new CopyPlugin({
      patterns: [
        // {
        //   context: path.resolve(__dirname, 'src', 'utils', 'images'),
        //   from: '**/*',
	      //   to:   'assets/images/[name][ext]',
        //   noErrorOnMissing: true
	      // },
        // {
        //   context: path.resolve(__dirname, 'src', 'utils', 'style'),
        //   from: '**/*',
	    //     to:   'utils/style/[name][ext]',
        //   noErrorOnMissing: true
	    //   },
        {
            from: './html/index.html',
            to: 'index.html',
            noErrorOnMissing: true
        },
        {
            from: './style/index.css',
            to: 'style/[name][ext]',
            context: path.resolve(__dirname)
        },
        {
          from: './style/students.css', 
          to: 'style/[name][ext]', 
          context: path.resolve(__dirname)
        }
      ] 
   })

  ]
};
