const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 8066;
console.log("env:", process.env.NODE_ENV)
module.exports = {
  outputDir: process.env.OUTPUT_DIR,
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    host: '0.0.0.0',
    hot: true,
    // disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // proxy: {
    //   '/api': {
    //     target: process.env.VUE_APP_PROXYURL,
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   },
    // }
  },
  css: {
    sourceMap: process.env.NODE_ENV !== 'production',
    // requireModuleExtension: false,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
        // css: {
        //   modules: {
        //     localIdentName: '[name]-[hash]',
        //   },
        //   localsConvention: 'camelCaseOnly',
        // },
      },
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@public': resolve('public'),
        '@env': resolve('env'),
      },
    },
  },
};
