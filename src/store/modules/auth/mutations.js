/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */
// import CookieStorage from "@/utils/cookiestorage";

import {
  CHECK,
  LOGIN,
  LOGOUT,
} from './mutation-types';

export default {
  [CHECK](state) {
    state.authenticated = !!localStorage.getItem('access_token');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  },

  [LOGIN](state, authtoken) {
    state.authenticated = true;
    localStorage.setItem('access_token', authtoken.token);
    state.autologin =  !authtoken.autolog ? false : true
    if (state.autologin === true) {
      localStorage.setItem('auto_login', JSON.stringify(authtoken.autolog));
    }
  },

  [LOGOUT](state) {
    state.authenticated = false;
    state.autologin = false;
    localStorage.removeItem('access_token');
    if (localStorage.getItem('auto_login')) localStorage.removeItem('auto_login');
  },
};