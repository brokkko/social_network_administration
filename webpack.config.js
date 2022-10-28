import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = "./views";
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

export default {
    mode: 'development',
    entry: {
        server: path.resolve(__dirname, './scripts/client/import/imports.js')
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist/webpack'),
        publicPath: '/',
        filename: './scripts/main.min.js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./styles/main.min.css"
        }),
        // ...PAGES.map(page => new HtmlWebpackPlugin({
        //     template: `${PAGES_DIR}/${page}`,
        //     filename: `./html/${page.replace(/\.pug/, '.html')}`
        // })),
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader'],
            },
            // {
            //     test: /\.pug$/,
            //     loader: 'pug-loader'
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

        ]
    }
}


