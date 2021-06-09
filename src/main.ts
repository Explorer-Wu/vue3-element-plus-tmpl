import { App as VueApp, createApp } from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { LoadAllPlugins } from "./plugins";

const vapp: VueApp<Element> = createApp(App);

LoadAllPlugins(vapp, store, router);

