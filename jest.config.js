const path = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  // 测试根目录
  rootDir: path.resolve(__dirname, './'),
  // Jest 的检索文件的根目录， 类似于webpack的alias配置，可以自行定义多个路径别名
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  // 每次测试之后运行的代码，或者环境变量
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  // setupFiles: ["<rootDir>/tests/jest-setup.js"],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  // 测试环境： node/jsdom，可以使用 js 的注释语法指定 @jest 的测试环境
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  // 转换器
  transform: {
    // 将.js后缀的文件使用babel-jest处理
    '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
    // ".*\.(vue)$": "@vue/vue3-jest",
    '.*\\.html$': 'jest-raw-loader',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|jpeg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  // 转换器要忽略的路径(使用正则匹配)
  // 将不忽略 lodash-es, other-es-lib 这些es库, 从而使babel-jest去处理它们
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    // "<rootDir>/node_modules/(?!(lodash-es|other-es-lib))",
    // "<rootDir>/node_modules/(?!camelcase)",
    // "<rootDir>/node_modules/(?!echarts)",
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|less|sass|scss)$'
  ],
  // 模块路径， 一个可选的用来设置 NODE_PATH 环境变量的配置
  // 值为一个用来表示需要模块额外去查找的路径的绝对路径的数组
  // node默认引入模块是去查找node_modules下的模块，这个配置项可以配置一些别的查找路径。
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/src'],
  // 模块名映射
  moduleNameMapper: {
    // "^react-native$": "react-native-web",
    '^.+\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Used to dedupe `styled-component` when run `npm link` in development
    // '^styled-components$': '<rootDir>/node_modules/styled-components',
    // Support import ~
    '^~(.*)': '<rootDir>/node_modules/$1',
    '^@/(.*)': '<rootDir>/src/$1'
  },
  // 模块文件扩展
  moduleFileExtensions: [
    'tsx',
    'ts',
    'web.js',
    'js',
    'mjs',
    'cjs',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node'
  ],
  // 是否应该收集测试覆盖率
  collectCoverage: true,
  // Jest 输出覆盖的目录
  coverageDirectory: 'coverage',
  // cacheDirectory: "/private/var/folders/xg/9156vqlj1rzfw092vnc_d3f00000gn/T/jest_dx",
  // 从哪里收集测试覆盖率
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    // 'tests/**/*.{ts,tsx}', // js,jsx,
    '!src/assets/**',
    '!src/**/*.d.ts',
    '!types/**/*.d.ts'
    // "!mocks/**",
  ],
  // jest 指定覆盖率报告者
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],
  // 正则匹配忽略覆盖收集路径
  coveragePathIgnorePatterns: ['/node_modules/', '/public/', '/coverage/'],
  // 指定哪种程序确定代码覆盖率
  // coverageProvider: "v8" || "babel",
  // 自定义使用的监听文件变化的插件数组
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  // watchPathIgnorePatterns: [ "/node_modules/" ],
  testMatch: [
    './tests/*.ts?(x)',
    './tests/**/*.ts?(x)',
    '**/?(*.)+(spec|test|unit).ts?(x)' // 匹配测试文件 [jt]s?(x)
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  resetMocks: true,
  clearMocks: true,
  // Stop running tests after `n` failures
  bail: 1,
  verbose: true
};
