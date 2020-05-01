const path = require('path')
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
    }
    // plugins: [
    //     new webpack.DefinePlugin({
    //       'process.env.NODE_ENV': JSON.stringify('production')
    //     })
    //   ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             // exclude: 排除
    //             exclude: /(node_modules|bower_components)/,
    //             use: {
    //               loader: 'babel-loader',
    //               options: {
    //                 presets: ['es2015']
    //               }
    //             }
    //           }
    //     ]
    // }
}