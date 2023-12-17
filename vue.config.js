const path = require('path');

const publicPath = process.env.NODE_ENV === 'production' ? '/' : '/';
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',

  // (js/css/img/font/...)
  assetsDir: './static',

  //lintOnSave: process.env.NODE_ENV !== 'production',

  // https://cn.vuejs.org/v2/guide/installation.html#
  // compiler: false,

  transpileDependencies: [
    '@dfinity/agent',
    '@dfinity/auth-client',
    '@dfinity/authentication',
    '@dfinity/candid',
    '@dfinity/identity',
    '@dfinity/principal'
  ],

  productionSourceMap: false,

  //  https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
  },
  // CSS 相关选项
  css: {
    sourceMap: true,

    loaderOptions: {}
  },

  parallel: require('os').cpus().length > 1,

  // PWA。
  //  https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  pwa: {},

  //  webpack-dev-server 。
  // devServer: {
  //   disableHostCheck: true,
  //   host: '0.0.0.0',
  //   port: 8081,
  //   https: false,
  //   hotOnly: false,
  //   // eslint-disable-next-line no-dupe-keys
  //   open: true,
  // },
  // // eslint-disable-next-line no-dupe-keys
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
  //
  // pluginOptions: {}
};
