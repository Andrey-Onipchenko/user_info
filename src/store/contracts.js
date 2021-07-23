export default {
  state: {
    contractsObject: {},
  },
  mutations: {
    setContractsObject(state, payload) {
      state.contractsObject = payload;
    },
  },
  actions: {},
  getters: {
    getContractsObject: (state) => state.contractsObject,
  },
};
