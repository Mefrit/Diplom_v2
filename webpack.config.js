const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    target: "web",
    entry: [
        "./src/index.tsx",
        "webpack-dev-server/client?http://localhost:8080",
        "webpack/hot/only-dev-server",
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.min.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,

        hot: true,
        port: 8080,
    },
    devtool: "inline-source-map",
};
