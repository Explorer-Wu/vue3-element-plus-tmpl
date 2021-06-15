import Axios from 'axios';
import CookieStorage from '@/utils/cookiestorage';
// import { convertRes2Blob } from '@/utils/index'
import qs from 'qs';
import { envConfig } from '@/envconfig';

const env = process.env.NODE_ENV;
console.log('env:', env, envConfig.baseUrl);
const isProd = env === 'production';

// 是否开启请求锁。
let fetchLock = true;

// 创建axios实例
const AxiosInstance = Axios.create({
  baseURL: envConfig.baseUrl,
  // 是否跨域携带cookie
  withCredentials: true,
  // 请求超时
  timeout: 10000,
  headers: {
    'cache-control': 'no-cache',
    // 'x-channel': 'PC'
  }
});

const ApiCache = {
  cachMap: new Map() /** 缓存列表 */,
  fetchQueue: [] /** 请求任务队列 */,
  /** 新增任务 */
  addTask(config, cancelToken) {
    this.fetchQueue.push({ original: `${config.url}&${config.method}`, cancelToken });
  },
  /** 删除任务 */
  deleteTask(config, start, cancelToken) {
    let cancel = false;
    for (let i in this.fetchQueue) {
      if (this.fetchQueue[i]['original'] === `${config.url}&${config.method}`) {
        this.fetchQueue[i].cancelToken(`cancel ${config.url}`);
        this.fetchQueue.splice(i, 1);
        cancel = true;
        break;
      }
    }
    if (!cancel && start) {
      this.deleteCach(config, cancelToken);
    }
  },
  /** 创建key */
  createKey(config) {
    let str = '';
    config.url && (str += config.url);
    if (config.method) {
      str += ',method:' + config.method;
      if (config.method === 'get' || config.params) {
        str += ',data:' + qs.stringify(config.params) + '';
      } else {
        str += ',data:' + config.data;
      }
    }
    return str;
  },
  /** 删除缓存 */
  deleteCach(config, cancelToken) {
    let cachMap = this.cachMap;
    const key = this.createKey(config),
      now = new Date().getTime();
    let cach = cachMap.get(key) || {};
    if (cach && cach.expirationTime && now <= cach.deadline && cach.data) {
      cach.cach = true;
      cancelToken(cach.data);
    }
  },
  /** 新增缓存 */
  addCach(config) {
    // , cancel
    const key = this.createKey(config),
      expirationTime = config.headers.expirationTime || 0;
    if (expirationTime) {
      this.cachMap.set(key, {
        expirationTime,
        deadline: new Date().getTime() + expirationTime,
        data: config.data || ''
      }); // , cancel
    }
  },
  /** 更新缓存 */
  updateCach(res) {
    if (!res || !res.config) {
      return false;
    }
    const key = this.createKey(res.config),
      oldVal = this.cachMap.get(key);
    if (!oldVal) {
      return false;
    }
    this.cachMap.set(key, {
      expirationTime: oldVal.expirationTime,
      deadline: oldVal.deadline,
      data: res
    });
  }
};

const StreamPost = config => {
  const url = config.url;
  const data = JSON.parse(config.data);
  const form = document.createElement('form');
  form.action = url;
  form.method = 'post';
  form.style.display = 'none';
  Object.keys(data).forEach(key => {
    const input = document.createElement('input');
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });
  const button = document.createElement('input');
  button.type = 'submit';
  form.appendChild(button);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

const StreamGet = config => {
  const params = [];
  for (const item in config.params) {
    params.push(`${item}=${config.params[item]}`);
  }
  const url = params.length
    ? `${config.baseURL + config.url}?${params.join('&')}`
    : `${config.baseURL + config.url}`;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  iframe.onload = function () {
    document.body.removeChild(iframe);
  };
  document.body.appendChild(iframe);
};

// 设置请求拦截器
AxiosInstance.interceptors.request.use(
  config => {
    // 去除没有值的属性
    for (const key in config.data) {
      const val = config.data[key];
      if (val === undefined || val === '' || val == null) {
        delete config.data[key];
      }
    }

    // if(config.baseURL) {
    // }

    // 请求锁
    fetchLock = config.fetchLock ? config.fetchLock : true;
    if (fetchLock) {
      config.cancelToken = new Axios.CancelToken(c => {
        /** 删除任务 | 缓存 */
        ApiCache.deleteTask(config, true, c);
        /** 新增任务 */
        ApiCache.addTask(config, c);
      });
    }
    /** 新增缓存 */
    ApiCache.addCach(config);

    config.headers.expirationTime = void 0;
    // 判断是否需要token，如果存在的话，则每个http header都加上token
    if (config.usetoken) {
      // CookieStorage.getTokenCookie('access_token')
      let getToken = localStorage.getItem('access_token');
      getToken && (config.headers.Authorization = `Bearer ${getToken}`); // CookieStorage.getSession('access_token')
      Reflect.deleteProperty(config, 'usetoken');
    }
    // 处理请求之前的配置
    console.log('interceptors_config:', config);
    return config;
  },
  err => {
    // 请求错误处理
    console.log('request_err:', err);
    return Promise.reject(err);
  }
);

// 设置响应拦截器
AxiosInstance.interceptors.response.use(
  response => {
    // responseLock(response.config);
    if (fetchLock) {
      ApiCache.deleteTask(response.config, false);
    }
    ApiCache.updateCach(response);
    // 处理字节流
    if (response.headers && response.headers['content-type'] === 'application/octet-stream') {
      const config = response.config;
      if (config.method === 'post') {
        StreamPost(config);
      } else if (config.method === 'get') {
        StreamGet(config);
        // convertRes2Blob(response, 'read')
        return response;
      }
      return;
    } else {
      // message.destroy()  // 销毁message组件
      if (response.data.access_token) {
        CookieStorage.setCookie('user_token', response.data.access_token);
      }
      //处理响应数据
      !isProd && console.log('interceptors.res:', response);
      return response;
    }
  },
  error => {
    let errMsg;
    if (error.response) {
      // const ErrRes = error.response 
      const { status, data } = error.response;
      !isProd && console.log('interceptors.err:', status, error.config);

      switch (status) {
        case 401:
          // 返回 401 清除过期token信息并跳转到登录页面
          localStorage.removeItem('access_token');
          localStorage.removeItem('username');
          errMsg = '用户没有权限访问，或权限被占用，请登录账户！';
          // alert("401-errMsg:" + errMsg)
          // console.log("interceptors.err-data:", data)
          // if (data.loginurl && typeof window !== "undefined") {
          //   window.location.href = `${data.loginurl}`
          // }
          error.response.msg = errMsg;
          // alert('没有权限访问', errMsg)
          setTimeout(() => {
            if (process.env.NODE_ENV === 'development') {
              // console.log("BASE_URL:", process.env.BASE_URL)
              window.location.href = `${process.env.BASE_URL}/login`;
            } else {
              window.location.href = `${data.loginurl}/login`;
            }
          }, 3000);
          break;
        case 403:
          localStorage.removeItem('access_token');
          errMsg = '该服务资源无权限访问！';
          // alert("403-errMsg:" + errMsg)
          error.response.msg = errMsg;
          break;
        default:
          break;
      }
    }
    // 处理响应失败
    return Promise.reject(error.response || error.msg); // 返回接口返回的错误信息
  }
);

export default function Fetch(options) {
  return AxiosInstance(options)
    .then(response => {
      const { status, data, error } = response;
      const success = status === 200 ? true : false;
      if (!success && typeof window !== 'undefined') {
        throw error; // message.error(error +', 请求失败！');
      }

      return Promise.resolve({
        ...data
      });
    })
    .catch(error => {
      return Promise.reject(error);
    });
}
