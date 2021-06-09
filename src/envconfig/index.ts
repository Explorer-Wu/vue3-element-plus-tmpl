export interface IConfig {
  env: string // 开发环境
  mock?: string // mock数据
  title: string // 项目title
  baseUrl?: string // 项目地址
  baseApi?: string // api请求地址
  authUrl?: string
  wsUrl?: string
  $cdn: string // cdn公共资源路径
}

// 根据环境引入不同配置 process.env.NODE_ENV
export const envConfig: IConfig = require('./env.' + process.env.NODE_ENV)
// console.log(process.env.NODE_ENV)