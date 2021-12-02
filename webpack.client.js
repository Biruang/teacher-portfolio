const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackConfig = require('./webpack.config')

module.exports = (env, argv) => {
  const watchMode = argv.liveReload || false
  const modeEnv = argv.mode || 'development'
  process.env.NODE_ENV = modeEnv
  const isProd = modeEnv === 'production'
  const config = webpackConfig(modeEnv)

  const optimizations = {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [],
  }

  if (isProd) {
    optimizations.minimizer.push(new UglifyJsPlugin())
  }

  return {
    mode: modeEnv,
    entry: './src/index.tsx',
    devServer: {
      compress: true,
      port: 4200,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    resolve: config.resolve,
    module: {
      rules: [config.modules.js, config.modules.css, config.modules.static],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './public',
            to: './',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new WebpackNotifierPlugin({ alwaysNotify: false }),
    ],
    entry: {
      main: './index.tsx',
    },
    output: {
      filename: watchMode
        ? 'assets/[name].[hash].js'
        : 'assets/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
    },
    performance: {
      hints: false,
    },
    optimization: optimizations,
  }
}
