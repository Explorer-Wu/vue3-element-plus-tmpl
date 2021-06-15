import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from '@/components/LayoutTemp.vue';
import Login from '@/views/login/index.vue';
import Home from '@/views/home/index.vue';

const routes: Array<RouteRecordRaw> = [
  // Login
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },
  {
    path: '/views',
    redirect: '/views/home',
    name: 'Main',
    component: MainLayout,
    meta: {
      auth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    props: true,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
        },
      },
      // {
      //   path: 'charts',
      //   name: 'charts',
      //   component: Charts,
      // },
      {
        path: '/error',
        name: '404',
        component: () => import('@/views/error/error.vue')
      },
    ]
  },
  {
    path: '/',
    redirect: '/views/home',
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
      name: '404',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
