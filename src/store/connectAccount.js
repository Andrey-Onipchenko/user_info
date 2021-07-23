export default {
  state: {
    address: null,
    provider: null,
    signer: null,
  },
  mutations: {
    setAddress(state, payload) {
      state.address = payload;
    },
    setProvider(state, payload) {
      state.provider = payload;
    },
    setSigner(state, payload) {
      state.signer = payload;
    },
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
  },
  actions: {
    async checkConnectAccountAction({ commit }, provider) {
      const accounts = await provider.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else {
        commit("setAddress", accounts[0]);
      }
    },

    async connectAccountAction({ commit }, provider) {
      try {
        const account = await provider.request({
          method: "eth_requestAccounts",
        });
        commit("setAddress", account[0]);
      } catch (err) {
        console.log(err);
      }
    },
  },
  getters: {
    getState: (state) => state,
    getAddress: (state) => state.address,
    getSigner: (state) => state.signer,
  },
};
