const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");
const autoprefixer = require("autoprefixer");
const DotenvPlugin = require("webpack-dotenv-extended-plugin");
const { getIfUtils, removeEmpty, propIf } = require("webpack-config-utils");

const PORT = 3000;
const HOST = "localhost";

const sourcePath = path.join(__dirname);
const appPath = path.join(__dirname, "./src");
const buildPath = path.join(__dirname, "./build");

module.exports = env => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return removeEmpty({
    entry: removeEmpty({
      app: removeEmpty([
        ifDevelopment(`webpack-dev-server/client?http://${HOST}:${PORT}`),
        ifDevelopment("webpack/hot/only-dev-server"),
        "./src/index"
      ])
    }),

    output: removeEmpty({
      filename: "static/js/bundle-[hash:8].js",
      publicPath: "/",
      path: buildPath
    }),

    devtool: propIf(env == "development", "eval", "source-map"),

    devServer: ifDevelopment({
      inline: true,
      host: HOST,
      port: PORT,
      historyApiFallback: true,
      hot: true,
      disableHostCheck: true,
      open: true,
      overlay: {
        warnings: true,
        errors: true
      }
    }),

    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(sourcePath, "node_modules"), appPath]
    },

    node: {
      fs: "empty"
    },

    module: {
      rules: removeEmpty([
        {
          test: /\.(js|jsx)$/,
          include: appPath,
          use: {
            loader: "babel-loader",
            options: removeEmpty({
              babelrc: false,
              presets: [
                [
                  "env",
                  {
                    targets: {
                      browsers: ["last 2 versions", "safari >= 7"]
                    }
                  }
                ],
                "react",
                "stage-0"
              ],
              plugins: propIf(
                env == "development",
                [
                  "react-hot-loader/babel",
                  "transform-decorators-legacy",
                  "transform-class-properties"
                ],
                ["transform-decorators-legacy", "transform-class-properties"]
              ),
              cacheDirectory: ifDevelopment(true),
              compact: ifProduction(true)
            })
          }
        },
        ifProduction({
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "postcss-loader", "less-loader"]
          })
        }),
        ifDevelopment({
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader?sourceMap",
            "postcss-loader",
            "less-loader?sourceMap"
          ]
        }),
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "static/media/img/",
            limit: 10000
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: "file-loader",
          options: {
            name: "static/media/fonts/[name].[ext]"
          }
        },
        {
          test: /\.md$/,
          loader: "file-loader",
          options: {
            name: "static/media/md/[name].[ext]"
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
      ])
    },

    plugins: removeEmpty([
      ifDevelopment(new CaseSensitivePathsWebpackPlugin()),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifProduction(new CleanWebpackPlugin(buildPath)),
      ifProduction(
        new UglifyJsPlugin({
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            mangle: { safari10: true },
            output: { comments: false }
          }
        })
      ),
      ifProduction(
        new ExtractTextPlugin({ filename: "static/css/bundle.css" })
      ),
      new HtmlWebpackPlugin(
        removeEmpty({
          path: propIf(env == "development", appPath, buildPath),
          hash: ifDevelopment(true),
          template: path.join(appPath, "index.html"),
          filename: "index.html",
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        })
      ),
      new webpack.LoaderOptionsPlugin(
        removeEmpty({
          minimize: ifProduction(true),
          debug: ifProduction(false),
          options: {
            postcss: [
              autoprefixer({
                browsers: ["last 3 version", "ie >= 10"]
              })
            ],
            context: sourcePath
          }
        })
      ),
      ifDevelopment(new webpack.NamedModulesPlugin()),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env)
      }),
      new DotenvPlugin({
        defaults: "./config/.env.defaults",
        path: "./config/.env.local"
      })
    ])
  });
};
