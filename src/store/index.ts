import { createStore, createLogger } from 'vuex';
import auth from './modules/auth';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    // b: dialogload
  },
  /**
   * If strict mode should be enabled  开启严格模式
   * 不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。
   */
  strict: debug,
  plugins: debug ? [createLogger()] : []
});