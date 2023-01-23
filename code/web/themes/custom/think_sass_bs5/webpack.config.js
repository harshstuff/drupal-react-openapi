const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
var DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  entry: {
    think_sass_bs5: "./js/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  plugins: [
    new DashboardPlugin({}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, "dist/"),
            },
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1, url: false },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8090,
    webSocketServer: "ws",
    devMiddleware: {
      index: false, // specify to enable root proxying
      publicPath: "/themes/custom/think_sass_bs5/dist/",
    },
    proxy: {
      context: () => true,
      secure: false, // had an expression which was resolving to true
      target: "http://localhost:8080",
    },
    allowedHosts: "all",
    host: "0.0.0.0",
    hot: true,
  },
};
