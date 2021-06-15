import Fetch from './fetch';

const requestLis = [{
  name: 'login',
  url: '/auth/login',
  method: 'post',
  // baseurl: process.env.VUE_APP_AuthURL
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
}];

interface ApiConfig {
  [propName: string]: Function | any;
}

const Api: ApiConfig = {};
requestLis.forEach((req: any) => {
  Api[req.name] = (data: object, urlqs: boolean) => { // , headers: object  process.env.VUE_APP_BaseURL
    // const requrl = process.env.VUE_APP_BaseURL + req.url;
    let queryData = {}
    console.log('requrl:', process.env);
    // headers: (headers as any) || {},
    // fetchLock: false
    if (urlqs) {
      queryData = {
        params: {
          ...data
        }
      }
    } else {
      // delete删除请求(参数可以放在url上, 也可以和post一样放在请求体中)
      queryData = { data }
    }
    
    return Fetch({
      method: req.method || 'get',
      url: req.url,
      ...queryData,
      baseURL: req.baseurl,
    })
  };
});

export default Api;
