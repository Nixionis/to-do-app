const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    devtools: 'inline-source-maps',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
}