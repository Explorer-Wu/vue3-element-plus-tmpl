<template>
  <dl class="login-main">
    <dt>
      <div class="close" @click="windowAction('close')"/>
      <h3>登 录</h3>
    </dt>
    <dd>
      <h3 v-if="autoLoading">正在登录...</h3>
      <!-- status-icon属性为输入框校验结果的反馈图标 -->
      <el-form v-if="!autoLoading" ref="formLogin" class="login-form" :model="formLogin" :rules="ruleLogin" status-icon>
        <el-form-item prop="username">
          <el-input 
            v-model="formLogin.username"
            :on-blur="searchSession"
            placeholder="用户名"
            prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            type="password" 
            v-model="formLogin.password"
            placeholder="密码" 
            prefix-icon="el-icon-lock"
            autocomplete="off">
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
              <el-form-item class="checkbox-right">
                <el-checkbox name="autologin" v-model="autologin" label="自动登录"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </div>
      </el-form>
    </dd>
  </dl>
</template>

<script>
import { mapState } from 'vuex';
import md5 from "md5";
import { encode, decode } from 'js-base64';
// import { validPattern } from '@/utils/pattern.js'
// import CookieStorage from "@/utils/cookiestorage";
import "@/assets/styles/components/login.scss";

export default {
  data() {
    return {
      remember: false,
      autologin: false,
      autoLoading: false,
      formLogin: {
        username: "",
        password: "",
        autos: ["remember"]
      },
      ruleLogin: {
        username: [
          {
            required: true,
            message: "用户名不能为空！",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码输入不合法！",
            trigger: "blur"
          }
        ]
      },
      loginTime: null
    };
  },
  computed: {
    ...mapState('auth', {   // ...是对象展开运算符，es6语法
      authenticated: 'authenticated',  //相当于 firstMenu: state => state.firstNav,
    }),
  },
  watch: {
    authenticated(auth) {
      if (auth === true) {
        this.windowAction('login');
      }
    },
    remember(val) {
      if (val === false) {
        this.autologin = false
      }
    },
    autologin(val) {
      if (val === true) {
        this.remember = true
      }
    }
  },
  created() {
    this.$IpcRender.send('enter-or-exit', false)
    console.log("access_token:", localStorage.getItem('access_token'), this.authenticated)
    const that = this;
    // 在页面加载时从cookie获取登录信息
    let account = localStorage.getItem('user_name')
    let password = localStorage.getItem('user_pwd')

    if (!localStorage.getItem('access_token') && localStorage.getItem('auto_login')) {
      const userLogin = JSON.parse(localStorage.getItem('auto_login'))
      // alert(userLogin)
      console.log("userLogin:", userLogin)
      this.autoLoading = true;
      this.autologin = true;
      // this.reqLogin(userLogin);
      this.loginTime = setTimeout(() => {
        that.reqLogin(userLogin);
      }, 1000)
    }
    
    if (account) {  // 如果存在赋值给表单，并且将记住密码勾选
      this.formLogin.username = account
      this.formLogin.password = decode(password)
      this.remember = true
    } 
  },
  // mounted() {
  //   alert("Win_URL:", window.location.href)
  //   console.log("BASE_URL:", process.env.BASE_URL)
  //   alert(process.env.Server_LocalUrl)
  // },
  beforeDestroy() {
    clearTimeout(this.loginTime)
  },
  methods: {
    windowAction(windowAction){
      switch (windowAction) {
        case 'login':
          console.log("login-enter:", '/views')
          this.$router.replace({path: '/overview/index'})
          // this.$router.push("/views/dealalarm")
          // this.$IpcRender.send('enter-or-exit', true)
          break
        case 'close':
          this.$IpcRender.send("window-close")
          console.log('关闭')
          break
      }
    },
    handleSubmit() {
      // const self = this;
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          // this.$Message.success("Success!");
          this.subLogin();
        } else {
          this.$Message.error("登录验证失败!");
          this.$refs.formLogin.resetFields();
        }
      });
    },
    loginSucc(token, formdata) {
      console.log("log-authenticated0:", this.authenticated)
      if (this.autologin) {
        this.$store.dispatch("auth/login", { token: token, autolog: formdata });
      } else {
        this.$store.dispatch("auth/login", { token: token, autolog: false });
      }
      // this.$nextTick(function () {
      // })
    },
    subLogin() {
      const formLogin_md5 = {
        ...this.formLogin,
        // password: md5(this.formLogin.password)
      }
      const encode_pwd = encode(this.formLogin.password)
      let account = localStorage.getItem('user_name')
      if (this.remember) {
        //如果记住密码，存cookie
        localStorage.setItem('user_name', this.formLogin.username); 
        localStorage.setItem('user_pwd', encode_pwd);
        localStorage.setItem(this.formLogin.username, encode_pwd);
      } else if (account) {
        localStorage.removeItem(account)
        localStorage.removeItem('user_name') //删除用户名密码
        localStorage.removeItem('user_pwd')
      }

      this.reqLogin(formLogin_md5);

      this.$nextTick().then(() => {
        this.$refs.formLogin.resetFields();
      });
    },
    async reqLogin(formDataMd5) {
      try {
        const loginRes = await this.$ApiAuth.login(formDataMd5.username, formDataMd5.password);
        console.log("loginRes:", loginRes);
        localStorage.setItem('user_info', JSON.stringify(loginRes.data.userInfo))
        this.loginSucc(loginRes.data.access_token, formDataMd5);
         // CookieStorage.setCookie('UserName', res.data.data.userName, "d7");
      } catch (error) {
        this.$Message.error("用户名或密码有误!");
        // throw new Error(await error.msg);
      }
    },
    searchSession() {
      if (this.remember && localStorage.getItem(this.formLogin.username)) {
        this.formLogin.password = decode(localStorage.getItem(this.formLogin.username));
      } else {
        if (localStorage.getItem(this.formLogin.username)) {
          localStorage.removeItem(this.formLogin.username)
        }
        this.formLogin.password = "";
      }
    }
  }
};
</script>
