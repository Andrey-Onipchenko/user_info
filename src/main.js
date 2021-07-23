import Vue from "vue";
import { ethers } from "ethers";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.prototype.$ethers = ethers;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
