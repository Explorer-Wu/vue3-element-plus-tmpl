const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

console.log('env:', process.env.NODE_ENV);
module.exports = {
  lintOnSave: process.env.VUE_APP_ENV === 'production',
  publicPath: './',
  productionSourceMap: false,
  outputDir: process.env.OUTPUT_DIR,
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    host: '0.0.0.0',
    hot: true,
    // disableHostCheck: true,
    port: process.env.port || 3000,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
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
    extract: false,
    sourceMap: process.env.NODE_ENV !== 'production',
    // requireModuleExtension: false,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
        // css: {
        //   modules: {
        //     localIdentName: '[name]-[hash]',
        //   },
        //   localsConvention: 'camelCaseOnly',
        // },
      }
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@public': resolve('public'),
        '@env': resolve('env'),
        api: resolve('./src/api')
      },
      extensions: ['.ts', '.tsx']
    },
    module: {
      rules: [
        // {
        //   test: /\.less/,
        //   exclude: /node_modules/,
        //   use: ['style-loader', 'css-loader', {
        //     loader: 'less-loader',
        //     options: {
        //       javascriptEnabled: true
        //     }
        //   }],
        // },
        {
          test: /\.(css|less)$/,
          use: [
            {
              loader: 'style-resources-loader',
              options: {
                patterns: [resolve('./src/assets/styles/var.less')]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new StylelintPlugin({
        context: 'src',
        files: ['**/*.{vue,html,css,less,scss,sass}'],
        fix: true // autofix
      })
    ]
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, './src/assets/images/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
    const fileRule = config.module.rule('file');
    fileRule.uses.clear();
    fileRule
      .test(/\.svg$/)
      .exclude.add(path.resolve(__dirname, './src/assets/images/svg'))
      .end()
      .use('file-loader')
      .loader('file-loader');
  }
};
