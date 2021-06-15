<template>
  <div class="login-main">
    <!-- <Footer /> -->
    <dl class="login-wrap">
      <dt>
        <h3>登 录</h3>
      </dt>
      <dd>
        <el-form
          ref="refFormLogin"
          class="login-form"
          :model="formLogin"
          :rules="ruleLogin"
          status-icon
        >
          <el-form-item prop="username">
            <el-input
              v-model="formLogin.username"
              :on-blur="searchSession"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="formLogin.password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>

          <div class="login-sub">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item class="checkbox-left">
                  <el-checkbox name="remember" v-model="remember" label="记住密码"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="login-form-forgot">
                  <!-- <el-checkbox name="autologin" v-model="autologin" label="自动登录"></el-checkbox> -->
                  <a href="#">忘记密码</a>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">登录</el-button>
            </el-form-item>
            <!-- <span>或 &emsp; </span> -->
            <!-- <a href="/register">注册</a> -->
          </div>
        </el-form>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    onUnmounted,
    computed,
    watch,
    nextTick,
    reactive,
    toRefs,
    toRaw,
    ref,
    UnwrapRef,
    getCurrentInstance
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  // import { envConfig } from '@/envconfig';
  import md5 from 'md5';
  import { encode, decode } from 'js-base64';
  import { validPattern } from '@/utils/pattern.js';
  // import CookieStorage from "@/utils/cookiestorage";
  import '@/assets/styles/components/login.scss';

  // import ModalModifyPasswd from "@/components/Modals/ModalModifyPasswd"
  // import ModalLogout from "@/components/Modals/ModalLogout"
  // import cookiestorage from '@/utils/cookiestorage'
  interface ExState {
    remember: boolean;
    ruleLogin: object;
    loginTime: any;
  }

  interface FormState {
    username: string;
    password: string;
    autos: Array<string>;
  }

  export default defineComponent({
    name: 'Login',
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;
      const refFormLogin = ref<string | number>('login');
      const formState: UnwrapRef<FormState> = reactive({
        username: '',
        password: '',
        autos: ['remember']
      });

      const validCode = val => {
        return validPattern.validVcode.test(val);
      };

      const exState: ExState = reactive({
        remember: false,
        ruleLogin: {
          username: [
            {
              required: true,
              message: '用户名不能为空！',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '密码不能为空！',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码输入不合法！',
              trigger: 'blur'
            }
          ],
          vcode: [{ required: true, validator: validCode, message: '验证码输入不合法！', triger: 'blur' }]
        },
        loginTime: null
      });
      const $store = useStore();
      const authenticated = computed(() => $store.state.auth.authenticated);
      watch([authenticated, exState.remember], ([auth, remember], [prevAuth, prevRemember]) => {
        if (auth === true) {
          proxy.$router.push('/views/dealalarm');
        }
      });

      const methods = {
        handleSubmit() {
          (refFormLogin.value as any).validate(async (valid: boolean) => {
            if (valid) {
              methods.subLogin();
            } else {
              context.$Message.error('登录验证失败!');
              (refFormLogin.value as any).resetFields();
            }
          });
        },
        subLogin() {
          const formLogin_md5 = {
            ...formState
            // password: md5(formState.password)
          };
          const encode_pwd = encode(formState.password);
          let account = localStorage.getItem('user_name');
          if (exState.remember) {
            //如果记住密码，存cookie
            localStorage.setItem('user_name', formState.username);
            localStorage.setItem('user_pwd', encode_pwd);
            localStorage.setItem(formState.username, encode_pwd);
          } else if (account) {
            localStorage.removeItem(account);
            localStorage.removeItem('user_name'); //删除用户名密码
            localStorage.removeItem('user_pwd');
          }

          methods.reqLogin(formLogin_md5);

          nextTick(() => {
            (refFormLogin.value as any).resetFields();
          });
        },
        async reqLogin(formDataMd5: any) {
          try {
            const loginRes = await proxy.$Api.login(formDataMd5.username, formDataMd5.password);
            console.log('loginRes:', loginRes);
            localStorage.setItem('user_info', JSON.stringify(loginRes.data.userInfo));
            console.log('log-authenticated0:', authenticated);
            $store.dispatch('auth/login', { token: loginRes.data.access_token });
            // CookieStorage.setCookie('UserName', res.data.data.userName, "d7");
          } catch (error) {
            context.$Message.error('用户名或密码有误!');
            // throw new Error(await error.msg);
          }
        },
        searchSession() {
          if (exState.remember && localStorage.getItem(formState.username)) {
            formState.password = decode(<any>localStorage.getItem(formState.username));
          } else {
            if (localStorage.getItem(formState.username)) {
              localStorage.removeItem(formState.username);
            }
            formState.password = '';
          }
        }
      };

      onMounted(() => {
        console.log('access_token:', localStorage.getItem('access_token'), authenticated);
        // 在页面加载时从cookie获取登录信息
        let account: string | null = localStorage.getItem('user_name');
        let password: string | null = localStorage.getItem('user_pwd');

        if (account && password) {
          // 如果存在赋值给表单，并且将记住密码勾选
          formState.username = account;
          formState.password = decode(password);
          exState.remember = true;
        }
      });

      onUnmounted(() => {
        clearTimeout(exState.loginTime);
      });

      return {
        ...toRefs(exState),
        formLogin: { ...formState },
        ...methods,
        authenticated,
        refFormLogin
      };
    }
  });
</script>
