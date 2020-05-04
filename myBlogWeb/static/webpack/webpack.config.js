const path = require('path')
const uglifyJsPlugin = require('uglifyjs-webpack-plugin')

// const webpack = require('webpack')

// module.exports = {
//     entry: './index.js',
//     output: {
//         path: path.resolve(__dirname, '../js'),
//         filename: 'index_new.js'
//     },
//     resolve: {
//         alias: {'vue': '../js/vue.js'}
//     }
// }

module.exports = {
    entry: {
        index: './index.js',
        blog_detail: './blog_detail.js'
    },
    output: {
        path: path.resolve(__dirname, '../js'),
        filename: '[name]_new.js'
    },
    resolve: {
        alias: {'vue': 'vue/dist/vue.js'}
    },
    plugins: [
        new uglifyJsPlugin()
      ],
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: 排除
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['es2015']
                  }
                }
              },
              {
                test: /\.vue$/,
                use: ['vue-loader']
              }
        ]
    }
}