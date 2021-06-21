import Fetch from './fetch';

const requestLis = [{
  name: 'login',
  url: '/auth/login',
  method: 'post',
  isformdata: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}, {
  name: 'logout',
  url: '/auth/logout',
  method: 'post',
  // baseurl: process.env.VUE_APP_AuthURL
}, {
  name: 'getValidCode', // 获取图片验证码
  url: 'auth/photocode',
  method: 'post',
  responseType: "arraybuffer",
}, {
  name: 'getRsaKey', // 获取公钥
  url: 'auth/rsaKey',
  method: 'get',
}, {
  name: 'getArticleList', // 获取新闻列表
  url: '/api/articles',
  method: 'get',
}];

interface ApiConfig {
  [propName: string]: Function | any;
}

interface ReqOpts {
  paramId?: string;
  params?: any;
  data?: any;
}

const Api: ApiConfig = {};
requestLis.forEach((req: any) => {
  const {name, headers, url, method, isformdata } = req;

  Api[name] = (opts: ReqOpts) => { // , headers: object  process.env.VUE_APP_BaseURL
    // const requrl = process.env.VUE_APP_BaseURL + url;
    let queryData = {}
    console.log('opts:', opts);
    if (opts?.params) {
      queryData = {
        params: {
          ...opts.params
        }
      }
    } else if(opts?.data){
      // delete删除请求(参数可以放在url上, 也可以和post一样放在请求体中)
      queryData = { data: opts.data }
    }
    
    return Fetch({
      method: method || 'get',
      url: (opts?.paramId) ? url + opts.paramId : url,
      ...queryData,
      isformdata
      // baseURL: baseurl,
    })
  };
});

export default Api;
