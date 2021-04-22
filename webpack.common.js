const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

require('dotenv').config();

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
                // include: "/node_modules/chums-ducks/",
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
                include: "/node_modules/chums-components/",
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                chums: {
                    test: /[\\/](common|chums)-components[\\/]/,
                    name: 'chums',
                    chunks: 'all',
                },
            }
        }
    },
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: "[location].js",
        sourceMapFilename: '[file].map',
        publicPath: '/',
    },
    target: 'web',
}
