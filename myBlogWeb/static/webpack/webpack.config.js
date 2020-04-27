const path = require('path')

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
        alias: {'vue': '../js/vue.js'}
    }
}