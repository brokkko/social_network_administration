import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    mode:'production',
    entry: "./src/index.js",
    output: {
        filename: './webpack/main.js',

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.pug"
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
            // {
            //     test: /\.(jpe?g|png|gif|svg)$/i,
            //     use: [{
            //         loader:'url-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outPath: './src/assets/imgs',
            //             publicPath: './src/assets/imgs',
            //             emitFile: true,
            //             esModule: false,
            //         }
            //    }]
            // },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ['file-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            }

        ]
    }
}