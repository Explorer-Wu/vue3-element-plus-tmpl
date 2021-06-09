// 本地环境配置
module.exports = {
  env: 'development',
  mock: true,
  title: '开发',
  baseUrl: 'http://localhost:9018', // 项目地址
  // baseApi: 'http://localhost:9018/api', // 本地api请求地址,注意：如果使用了代理，请设置成'/'
  authUrl: 'http://127.0.0.1:9010',
  wsUrl: 'ws://127.0.0.1:3661',
  $cdn: 'https://example.cn'
}