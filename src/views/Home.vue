<template>
  <div class="home">
    <div class="container">
      <button @click="connectAccount">
        <template v-if="loading">Loading...</template>
        <template v-else>{{ btnText }}</template>
      </button>
      <template v-if="getAddress">
        <h3>Enter your address</h3>
        <input type="text" v-model="enterAddress" />
        <button @click="getUserInfo">getBalance</button>
      </template>
      <div class="">
        <div class="info" v-for="(info, inx) in userInfo" :key="inx">
          <img :src="info.img" alt="" />
          <div>
            <p>Name:</p>
            <p>{{ info.name }}</p>
          </div>
          <div>
            <p>Balance:</p>
            <p>{{ info.balance }}</p>
          </div>
          <div>
            <p>Decimals:</p>
            <p>{{ info.decimals }}</p>
          </div>
          <div>
            <p>TotalSupply:</p>
            <p>{{ info.totalSupply }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import contractsData from "@/utils/contracs/userInfo.js";
import detectEthereumProvider from "@metamask/detect-provider";
export default {
  name: "Home",
  data() {
    return {
      loading: false,
      tokenObject: [],
      userInfo: [],
      enterAddress: "",
    };
  },
  computed: {
    ...mapGetters(["getState", "getAddress", "getSigner"]),
    btnText() {
      if (this.getAddress) {
        return `${this.getAddress.slice(0, 6)}...${this.getAddress.slice(-6)}`;
      } else {
        return "Connect";
      }
    },
  },
  methods: {
    ...mapMutations(["setProvider", "setSigner", "setContractsObject"]),
    ...mapActions(["checkConnectAccountAction", "connectAccountAction"]),
    // -------------------------------------------------
    async checkProvider() {
      const provider = await detectEthereumProvider();
      if (!provider) {
        console.log('"Please install MetaMask!"');
      } else {
        await this.checkConnect();
      }
    },
    // -------------------------------------------------
    async checkConnect() {
      this.loading = true;
      await this.checkConnectAccountAction(window.ethereum);
      this.loading = false;
      const userProvider = new this.$ethers.providers.Web3Provider(
        window.ethereum
      );
      const userSigner = userProvider.getSigner();
      this.setProvider(userProvider);
      this.setSigner(userSigner);
    },
    // -------------------------------------------------
    async connectAccount() {
      this.loading = true;
      await this.connectAccountAction(window.ethereum);
      this.loading = false;
    },
    // -------------------------------------------------
    async createContractAll() {
      await Promise.all(
        contractsData.map((contract) => this.createContract(contract))
      );
      this.setContractsObject(this.tokenObject);
    },
    // -------------------------------------------------
    async createContract(contract) {
      const tokenInstance = await new this.$ethers.Contract(
        contract.address,
        JSON.stringify(contract.abi),
        this.getSigner
      );

      this.tokenObject.push({
        ...contract,
        contractInstance: tokenInstance,
      });
    },
    // -------------------------------------------------
    async getUserInfo() {
      this.tokenObject.forEach(async (token) => {
        let contractToken = token.contractInstance;
        let balance = await this.getUserBalance(contractToken);
        let decimals = await this.getUserDecimals(contractToken);
        let totalSupply = await this.getUserTotalSupply(contractToken);
        this.userInfo.push({
          name: token.name,
          img: token.img,
          balance: balance,
          decimals: decimals,
          totalSupply,
        });
      });
    },
    // -------------------------------------------------
    async getUserBalance(contractToken) {
      try {
        const balance = await contractToken?.balanceOf(this.enterAddress);
        return this.$ethers.utils.formatEther(balance.toString());
      } catch (err) {
        console.log("Error getBalance:", err);
      }
    },
    // -------------------------------------------------
    async getUserDecimals(contractToken) {
      try {
        const decimals = await contractToken?.decimals();
        return this.$ethers.utils.formatUnits(decimals.toString(), "wei");
      } catch (err) {
        console.log("Error getUserDecimals:", err);
      }
    },
    // -------------------------------------------------
    async getUserTotalSupply(contractToken) {
      try {
        const totalSupply = await contractToken?.totalSupply();
        return this.$ethers.utils.formatUnits(totalSupply.toString(), "ether");
      } catch (err) {
        console.log("Error getUserTotalSupply:", err);
      }
    },
  },
  async mounted() {
    await this.checkProvider();
    this.createContractAll();
  },
};
</script>
<style lang="scss">
.container {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}
input {
  margin-bottom: 25px;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-around;

  border: 2px solid black;
  margin-bottom: 15px;
  padding: 0 15px;
  p {
    text-align: center;
  }
  div,
  img {
    flex-basis: 0;
    flex-grow: 1;
  }
}
</style>
