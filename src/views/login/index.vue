<template>
  <div class="login-main">
    <!-- <Footer /> -->
    <dl class="login-wrap">
      <dt>
        <h3>登 录</h3>
      </dt>
      <dd>
        <el-form ref="refFormLogin" class="login-form" :model="formLogin" :rules="ruleLogin" status-icon>
          <el-form-item prop="username">
            <!-- :on-blur="searchSession" -->
            <el-input type="text" v-model="formLogin.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formLogin.password" placeholder="密码" prefix-icon="el-icon-lock" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-col :span="15">
              <el-form-item prop="photoCode">
                <!-- @keyup.enter="login" -->
                <el-input
                  type="text"
                  v-model="formLogin.photoCode"
                  placeholder="验证码"
                  style="width: 100%"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="8">
              <el-form-item>
                <img class="code-img" :src="formLogin.src" @click="refreshCodeImg" clearable />
              </el-form-item>
            </el-col>
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
  import { JSEncrypt } from 'jsencrypt';
  // import * as JSEncrypt from 'jsencrypt';
  // import md5 from 'md5';
  import { encode, decode } from 'js-base64';
  import { validPattern } from '@/utils/pattern.js';
  // import CookieStorage from "@/utils/cookiestorage";
  import '@/assets/styles/components/login.scss';

  // import ModalModifyPasswd from "@/components/Modals/ModalModifyPasswd"
  // import ModalLogout from "@/components/Modals/ModalLogout"
  // import cookiestorage from '@/utils/cookiestorage'
  interface RuleLogin {
    username: Array<any>,
    password: Array<any>,
    photoCode: Array<any>,
  }

  interface FormLogin {
    username: string;
    password: any;
    photoCode: string;
    src: string;
    timeStamp: number;
    autos: Array<string>;
  }

  interface FormState {
    formLogin: FormLogin;
    remember: boolean;
    ruleLogin: RuleLogin;
    loginTime: any;
    publicKey: any;
  }

  export default defineComponent({
    name: 'Login',
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;
      const refFormLogin = ref<string | number>('login');
      const validCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空！'));
        } else {
          if(!validPattern.validVcode.test(value)) {
            callback(new Error('验证码输入不合法！'));
          }
          callback();
        }
      };
      const formState: UnwrapRef<FormState> = reactive({
        formLogin: {
          username: '',
          password: '',
          photoCode: '',
          src: '',
          timeStamp: 0,
          autos: ['remember']
        },
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
            { required: true, message: '密码不能为空！', trigger: 'blur' },
            { min: 6, max: 18, message: '密码输入不合法！', trigger: 'blur' }
          ],
          photoCode: [
            { required: true, validator: validCode, triger: 'blur' }
          ]
        },
        publicKey: '',
        loginTime: null
      });

      const $store = useStore();
      const authenticated = computed(() => $store.state.auth.authenticated);
      watch([authenticated, formState.remember], ([auth, remember], [prevAuth, prevRemember]) => {
        if (auth === true) {
          proxy.$router.push('/views/dealalarm');
        }
      });

      const methods = {
        handleSubmit() {
          (refFormLogin.value as any).validate(async (valid: boolean) => {
            if (valid) {
              this.subLogin();
            } else {
              context.$Message.error('登录验证失败!');
              (refFormLogin.value as any).resetFields();
            }
          });
        },
        subLogin() {
          const formLogin_Rsa = {
            ...formState.formLogin
          };
          // const encode_pwd = encode(formState.formLogin.password);
          formLogin_Rsa.password = this.passwordEncryption(formState.formLogin.password + ',' + new Date().getTime());
          let account = localStorage.getItem('user_name');
          if (formState.remember) {
            //如果记住密码，存cookie
            localStorage.setItem('user_name', formState.formLogin.username);
            localStorage.setItem('user_pwd', formLogin_Rsa.password);
            localStorage.setItem(formState.formLogin.username, formLogin_Rsa.password);
          } else if (account) {
            localStorage.removeItem(account);
            localStorage.removeItem('user_name'); //删除用户名密码
            localStorage.removeItem('user_pwd');
          }

          methods.reqLogin(formLogin_Rsa);

          nextTick(() => {
            (refFormLogin.value as any).resetFields();
          });
        },
        async reqLogin(formData: any) {
          const { username, password, photoCode } = formData;
          try {
            const loginRes = await proxy.$Api.login({username, password, captcha: photoCode});
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
        //获取图片校验码
        refreshImgCode() {
          formState.formLogin.timeStamp = new Date().getTime();
          let params = {
            data: {
              timeStamp: formState.formLogin.timeStamp
            }
          };
          proxy.$Api.getValidCode(params).then(res => {
            let img = btoa(
              new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            formState.formLogin.src = 'data:image/png;base64,' + img;
          });
        },
        //密码加密方法
        passwordEncryption(userpassword) {
          this.getRsaKey();
          // console.log(formState.publicKey + ' ********后台获取公钥********** ');
          const encryptor = new JSEncrypt(); // 新建JSEncrypt对象
          encryptor.setPublicKey(formState.publicKey); // 设置公钥
          let passwordEncryp = encryptor.encrypt(userpassword); // 对密码进行加密
          console.log(passwordEncryp + ' ****************** ');
          return passwordEncryp;
        },
        // 从后台获取公钥
        async getRsaKey() {
          const { data } = await proxy.$Api.getRsaKey();
          formState.publicKey = data;
        }
        // searchSession() {
        //   if (formState.remember && localStorage.getItem(formState.formLogin.username)) {
        //     formState.formLogin.password = decode(<any>localStorage.getItem(formState.formLogin.username));
        //   } else {
        //     if (localStorage.getItem(formState.formLogin.username)) {
        //       localStorage.removeItem(formState.formLogin.username);
        //     }
        //     formState.formLogin.password = '';
        //   }
        // }
      };

      onMounted(() => {
        console.log('access_token:', localStorage.getItem('access_token'), authenticated);
        // 在页面加载时从cookie获取登录信息
        let account: string | null = localStorage.getItem('user_name');
        let password: string | null = localStorage.getItem('user_pwd');

        if (account && password) {
          // 如果存在赋值给表单，并且将记住密码勾选
          formState.formLogin.username = account;
          formState.formLogin.password = decode(password);
          formState.remember = true;
        }
      });

      onUnmounted(() => {
        clearTimeout(formState.loginTime);
      });

      return {
        ...toRefs(formState),
        ...methods,
        authenticated,
        refFormLogin
      };
    }
  });
</script>
