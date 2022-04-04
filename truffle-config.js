require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const {NFT_API_URL, INFURA_API_KEY, MNEMONIC } = process.env;



module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "ganache-cli",
      port: 8545,
      network_id: "57771",
      websockets: true,
      provider: () => {
        const Web3 = require('./node_modules/web3');
        return new Web3.providers.WebsocketProvider("ws://ganache-cli:8545");
      }
    },
    ropsten: {
      provider: function(){
        return new HDWalletProvider(MNEMONIC, NFT_API_URL)
      },
      gasPrice: 25000000000,
      network_id: "3"
    },
    kovan: {
      provider: function(){
        return new HDWalletProvider(
          MNEMONIC, INFURA_API_KEY
        )
      },
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",  // Fetch exact version from solc-bin (default: truffle's version)
      optimizer:{
        enable: true,
        runs: 200
      }
  }
 }
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
