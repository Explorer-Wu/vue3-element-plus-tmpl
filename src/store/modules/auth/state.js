/* ============
 * State of the auth module
 * ============
 *
 * The initial state of the auth module.
 */
// import CookieStorage from "@/utils/cookiestorage";

export default {
  authenticated: !localStorage.getItem('access_token') ? false : true,
  autologin: localStorage.getItem('auto_login') ? true : false
};

