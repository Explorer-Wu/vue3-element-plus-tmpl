module.exports = {
  // parser: 'sugarss',
  // map: false,
  plugins: {
    'autoprefixer': { 
      // browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'Android >= 4.0', 'iOS >= 8'],
    },
    // 'postcss-pxtorem': {
    //   rootValue: 20,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
    //   // unitPrecision: 5, // 允许REM单位增长的十进制数字
    //   propList: ['*'],  // ['font', 'font-size', 'line-height', 'letter-spacing'],
    //   selectorBlackList: [/^html$/], // 要忽略的选择器，保留为px
    //   replace: true, // 替换包含rems的规则，而不添加后备
    //   mediaQuery: true, // 允许在媒体查询中转换px
    //   minPixelValue: 2, // 设置要替换的最小像素值
    //   // 要忽略并保留为px的文件路径
    //   // exclude: /src\/assets\/styles/i
    // }
    // 'postcss-flexbugs-fixes': {},
    // "postcss-import": {},
    // "postcss-url": {},
    // "postcss-cssnext": {},
    // "postcss-nested": {},
  }
}