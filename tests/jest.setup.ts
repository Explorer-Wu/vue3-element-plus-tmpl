// import 'jsdom-global/register'
import {
  mount,
  shallowMount,
  RouterLinkStub,
  VueWrapper,
  DOMWrapper,
  config,
  flushPromises,
  MountingOptions
} from '@vue/test-utils';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { createStore, createLogger } from 'vuex';
import { storeConfig } from '@/store';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import _ from 'lodash';
import 'jest-canvas-mock';

if (typeof window !== 'undefined') {
  window._ = _;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MainLayout,
    meta: {
      // auth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    props: true,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: 'tables',
        name: 'tables',
        component: Tables
      },
      {
        path: 'mobiletpls',
        name: 'mobiletpls',
        component: Mobiletpls
      },
      {
        path: '/error',
        name: '404',
        component: () => import('@/views/error/error.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/views/home'
  },
  // {
  //   path: '*',
  //   redirect: '/error',
  // },
  {
    name: 'NotFound',
    path: '/:path(.*)+',
    // redirect: '/error',
    redirect: {
      name: '404'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
