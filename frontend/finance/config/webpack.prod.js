const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');

const deps = require('../package.json').dependencies;

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/finance/latest/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'finance',
      filename: 'remoteEntry.js',
      exposes: { './FinanceApp': './src/bootstrap' },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
