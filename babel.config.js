module.exports = {
  // [["env", { "modules": false }]]
  presets: ['@vue/cli-plugin-babel/preset'],
  env: {
    test: {
      presets: [['env', { targets: { node: 'current' } }]]
    },
    development: {
      plugins: [
        'dynamic-import-node'
        // [
        //   'component',
        //   {
        //     libraryName: 'element-plus',
        //     styleLibraryName: 'theme-chalk'
        //   }
        // ]
      ]
    }
  }
  // plugins: [
  //   [
  //     "import",
  //     {
  //       libraryName: 'element-plus',
  //       customStyleName: (name) => {
  //         name = name.slice(3)
  //         return `element-plus/packages/theme-chalk/src/${name}.scss`;
  //       },
  //     },
  //   ],
  // ],
};
