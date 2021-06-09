import * as lodash from 'lodash';

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "*.scss";

declare global { // 全局变量设置
  const _Lo: typeof lodash
}