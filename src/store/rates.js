export default {
  state: {
    ratesList: {},
  },
  mutations: {
    setRatesList(state, payload) {
      state.ratesList = payload;
    },
  },
  actions: {},
  getters: {
    getRatesList: (state) => state.ratesList,
  },
};
