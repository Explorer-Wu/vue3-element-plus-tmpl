import type { App, createApp } from 'vue';
import { NavigationGuardNext } from "vue-router";
import _ from 'lodash';
import dayjs from 'dayjs';
import VuexRouterSync from 'vuex-router-sync';
// import Fetch from '@/api/fetch';
import Api from '@/api/Apis';
import EventBus from './eventbus';
// import CookieStorage from '@/utils/cookiestorage';

const GeneralPlugin = {
  install(app: App): void {
    // 全局实例方法
    app.config.globalProperties.$EventBus = new EventBus();
    app.config.globalProperties.$dayjs = dayjs;
    app.config.globalProperties._Lo = _;
    // app.config.globalProperties.$fetch = Fetch;
    // 全局的api
    // app.config.globalProperties.$ApiAuth = new ApiAuth(BaseURl.ipAuth);
    // app.config.globalProperties.$Api = new Api(BaseURl.ipCommon);
    app.config.globalProperties.$Api = Api;
    
    // app.provide('i18n', options)
    // app.directive('my-directive', {
    //   mounted (el, binding, vnode, oldVnode) {
    //     // some logic ...
    //   }
    //   ...
    // })

    // 全局混入，注入组件选项
    // app.mixin(MixinsGlobal);
  },
};

/**
 * @description 加载所有 Plugins
 * @param  {ReturnType<typeofcreateApp>} app 整个应用的实例
 */
export function LoadAllPlugins(app: ReturnType<typeof createApp>, store: any, router: any) { // (app: any, store: any, router: any)
  app.use(GeneralPlugin);
  
  const files = require.context('./', true, /\.ts$/)
  files.keys().forEach(key => {
    if (typeof files(key).default === 'function') {
      if (key !== './index.ts' && key !== './eventbus.ts') files(key).default(app)
    }
  })

  router.beforeEach((to, from, next: NavigationGuardNext) => {
    const title = to.meta && to.meta.title;
    if (title) {
      // document.title = title;
    }
  
    // 判断该路由是否需要登录权限
    // console.log("router-auth:", store.state.auth, localStorage.getItem('access_token'))
    if (to.matched.some(record => record.meta.auth) && !store.state.auth.authenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
    next();
  });
  // 全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
  // router.afterEach((to, from) => {
  //   console.log("afterEach:", to)
  // })

  VuexRouterSync.sync(store, router);
  app.use(store).use(router).mount("#app");
}