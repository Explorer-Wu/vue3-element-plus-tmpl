/**
 * pretiier 标准配置
 */
module.exports = {
  printWidth: 100, // 每行代码长度（默认80）
  // tab 用两个空格代替
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）
  // 不使用缩进符，而使用空格
  useTabs: false, // 是否使用tab进行缩进（默认false）
  singleQuote: true, // 使用单引号（默认false）
  // 仅在语法可能出现错误的时候才会添加分号
  semi: true, // 声明结尾使用分号(默认true)
  // 在ES5中有效的结尾逗号（对象，数组等）
  // trailingComma: "es5",
  trailingComma: 'none', // 多行使用拖尾逗号（默认none）
  wrap_line_lenght: 120,
  wrap_attributes: 'auto',
  bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
  jsxBracketSameLine: true, // 多行JSX中的>放置在最后一行的结尾，而不是另起一行（默认false）
  //箭头函数, 只有一个参数的是否带圆括号（默认avoid）; "always" 是需要带圆括号
  arrowParens: 'avoid', 
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 使用默认的折行标准 preserve
  proseWrap: 'always',
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 在Vue文件中缩进脚本和样式标签。
  vueIndentScriptAndStyle: true,
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 换行符使用 lf
  endOfLine: "lf",
  overrides: [
    {
      files: "prettier.config.js"
    }
  ]
}
