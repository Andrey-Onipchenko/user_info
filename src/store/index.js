import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import connectAccount from "@/store/connectAccount.js";
import contracts from "@/store/contracts.js";

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connectAccount,
    contracts,
  },
});
