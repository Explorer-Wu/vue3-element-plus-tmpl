<template>
  <el-menu
    ref="mainMenu"
    class="el-menu-vertical"
    v-if="menuType === 'main'"
    :default-active="activeName"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isFold"
    unique-opened="true"
    background-color="#0a1e50"
    text-color="#fff"
    active-text-color="#ffd06b"
    collapse-transition="true"
    router="true"
  >
    <div class="head-logo">
      <img src="../assets/images/logo.png" alt="logo" />
      <span class="title">Electron-Vue-Tpl</span>
    </div>
    <template v-for="item in navItems">
      <el-submenu v-if="item.children" :index="item.path" :key="item.path">
        <template #title>
          <i :class="item.iconClass"></i>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item-group>
          <!-- <template #title>分组一</template> -->
          <el-menu-item v-for="chitem in item.children" :key="chitem.path" :index="chitem.path">{{ chitem.title }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else :key="item.path" :index="item.path">
        <i :class="item.iconClass"></i>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    onUnmounted,
    reactive,
    computed,
    toRefs,
    toRaw,
    ref,
    getCurrentInstance
  } from 'vue';
  // import { useRouter } from "vue-router";
  export default defineComponent({
    name: 'MenuNav',
    props: {
      // ["isFold"]
      isFold: Boolean
    },
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;

      console.log('route.path:', proxy, context);
      const state = reactive({
        activeName: proxy.$route.path,
        menuType: 'main',
        navItems: [
          {
            iconClass: 'el-icon-house',
            title: '首页',
            path: '/views/home'
          },
          {
            iconClass: 'el-icon-pie-chart',
            title: 'Echart图表',
            children: [
              {
                title: '通用图表',
                path: '/views/charts/index'
              },
              {
                title: 'D3图表',
                path: '/views/charts/d3charts'
              }
            ]
          },
          {
            iconClass: 'el-icon-tickets',
            title: '表单展示',
            path: '/views/forms'
          },
          {
            iconClass: 'el-icon-s-grid',
            title: '表格展示',
            path: '/views/tables'
          },
          {
            iconClass: 'el-icon-picture-outline',
            title: '图片展示',
            path: '/views/pictures'
          },
          {
            iconClass: 'el-icon-user',
            title: '用户管理',
            path: '/views/users'
          },
          {
            iconClass: 'el-icon-s-tools',
            title: '设置',
            path: '/views/settings'
          }
        ],
        backUrl: '',
        userName: ''
      });

      const methods = {
        handleOpen(key, keyPath) {
          console.log('href-path:', key, keyPath);
          proxy.$router.push({ path: keyPath });
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        refreshMenu(route) {
          console.log('lo-route:', proxy._Lo.trimEnd(route.path, '/'));
          state.activeName = proxy._Lo.trimEnd(route.path, '/');
        }
      };

      onMounted(() => {
        // const userInfo: any = JSON.parse(<string>localStorage.getItem('user_info'))
        // console.log("userInfo",  userInfo)
        // state.userName = userInfo.name
        console.log('methods:', methods.refreshMenu);
        methods.refreshMenu(proxy.$route);
        //      this.$router.afterEach((to, from) => {
        //        this.refreshMenu(to)
        //      })
      });

      // onUnmounted(() => {
      // });

      return {
        ...toRefs(state),
        ...methods
      };
    }
  });
</script>

<style lang="scss" scoped>
  .el-menu-vertical {
    // width: 80px;
    height: 100vh;
    // min-height: 400px;
    background-color: #0a1e50;
    text-align: left;
    color: #fff;
    &:not(.el-menu--collapse) {
      width: 230px;
    }
    // > li {
    //   line-height: 36px;
    // }
  }
</style>
