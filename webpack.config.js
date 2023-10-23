const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /^date-fns[/\\]locale$/,
            new RegExp(`\\.[/\\\\](${['en-US']})[/\\\\]index\\.js$`)
        )
    ],
    optimization: {
        usedExports: false,
    },
}