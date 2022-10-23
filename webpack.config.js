import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals'

////    "build": "webpack --mode development",
// //    "start": "node ./dist/webpack/server.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    entry: {
        server: path.resolve(__dirname, './app.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/webpack'),
        publicPath: '/',
        filename: '[name].js',
    },
    target: 'web',
    // node: {
    //     // Need this when working with express, otherwise the build fails
    //     __dirname: false,   // if you don't put this is, __dirname
    //     __filename: false,  // and __filename return blank or /
    // },
    // externals: [nodeExternals()], // Need this to avoid error when working with Express
    plugins: [
        new HtmlWebpackPlugin({
            template: "./views/index.pug",
            excludeChunks: [ 'app' ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader'],
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ['file-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }

        ]
    }
}


