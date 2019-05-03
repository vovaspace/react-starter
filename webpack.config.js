const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const isDev = env === 'development';

  return {
    mode: isDev ? 'development' : 'production',
    entry: './src/index.jsx',
    output: {
      path: path.join(__dirname, '/build'),
      filename: 'app.js'
    },
    resolve: { extensions: ['.js', '.jsx'] },
    devtool: isDev ? 'inline-source-map' : false,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDev
              }
            },
            'css-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: './src/shared.scss'
              }
            }
          ]
        },

        // SVG sprite
        {
          test: /resources\/icons\/.*\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]'
              }
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { removeTitle: !isDev }
                ]
              }
            }
          ]
        },

        // Images
        {
          test: /\.(jpg|jpeg|gif|svg|png|webp)$/,
          exclude: [
            path.resolve(__dirname, 'src/resources/')
          ],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/'
              }
            }
          ]
        },

        // Fonts
        {
          test: /resources\/fonts\/.*\.(ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './assets/fonts/'
              }
            }
          ]
        },

        // Copy assets
        {
          test: /resources\/copy\/.*$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'app.css'
      })
    ],
    watch: isDev,
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 8080
    }
  };
};
