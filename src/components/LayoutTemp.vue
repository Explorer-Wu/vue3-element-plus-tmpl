<template>
    <el-container class="layout">
      <el-aside 
        ref="leftMenu"
        class="layout-left-side"
        :width="collapsedWd"
      >
        <MenuNav :isFold="isCollapsed"></MenuNav>
      </el-aside>
      <el-container>
        <el-header>
          <HeadBar
            @collapsedEv="collapsedSider"
            :isRotate="isCollapsed"
            :username="username"
          ></HeadBar>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
      <!-- <ModalModifyPasswd/>
      <ModalLogout/> -->
    </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs, toRaw, ref, UnwrapRef, getCurrentInstance } from 'vue';
// import { useRouter } from "vue-router";
import HeadBar from "./HeadBar.vue";
import MenuNav from "./MenuNav.vue";

// import ModalModifyPasswd from "@/components/Modals/ModalModifyPasswd"
// import ModalLogout from "@/components/Modals/ModalLogout"
// import cookiestorage from '@/utils/cookiestorage'
interface LayoutState {
  isCollapsed: boolean;
  collapsedWd: string;
  username: string;
}

export default defineComponent({
  name: "MainLayout",
  components: { HeadBar, MenuNav },
  setup(props: any, context: any) {
    // console.log("UnwrapRef", UnwrapRef);
    const { proxy } = getCurrentInstance() as any;
    const state: LayoutState = reactive({
      isCollapsed: false,
      collapsedWd: '230px',
      username: '',
    });

    const methods = {
      collapsedSider() {
        state.isCollapsed = !state.isCollapsed
        state.collapsedWd = state.isCollapsed ? '64px' : '230px'
      },
    };

    onMounted(() => {
      // cookiestorage.getCookie('sessionid')
      // Cookies.setCookie('sessionid', sessionid, "d7");//用户名密码存1年
      // this.username = cookiestorage.getCookie('username')
      // console.log("ipWs", BaseURl.ipWs, BaseURl)
      // methods.createWebSocket()
    });

    return {
      ...toRefs(state),
      ...methods
    };
  },
});
</script>

<style lang="scss" scoped>
// .layout {
//     position: relative;
//     // height: 100vh;
//     overflow: hidden;
//     // border: 1px solid #d7dde4;
//     background: #f9f9f5;
//     &-left-side {
//       width: 230px;
//     }
// }
.el-header {
  height: 50px !important;
  padding: 0 10px;
  // background: #fff;
  box-shadow: 0 0 0 5px rgba(5, 14, 65, 0.8);
  border-bottom: 1px solid #ddd;
}
.el-footer {
  background-color: #B3C0D1;
  height: 38px !important;
  line-height: 38px;
  color: #333;
  text-align: center;
}

.el-aside {
  // background-color: rgb(10, 30, 80);
  float: left;
  // width: 200px;
  height: 100vh;
  // box-shadow: 0 0 2px 3px rgba(0, 0, 0, .1); 
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}

#user-info {
  float: right;
}

#user-info-box {
  height: 40px;
  border: 1px solid #f0f0f8;
  margin-top: 10px;
  line-height: 40px;
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;
}

#logout-item {
  background: #a9d96c;
  width: 200px;
  padding: 15px 10px;
  line-height: 20px;
  color: white;
  text-align: center;
}

// body > .el-container {
//   margin-bottom: 40px;
// }
</style>
