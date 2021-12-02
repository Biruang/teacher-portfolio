const path = require('path')

module.exports = (env) => {
  const isProd = process.env.NODE_ENV === 'production'

  const modules = {
    js: {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
        {
          loader: '@linaria/webpack-loader',
          options: { sourceMap: !isProd },
        },
      ],
    },
    css: {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
      ],
    },
  }

  const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
    fallback: {
      fs: false,
    },
  }

  return {
    modules,
    resolve,
  }
}
