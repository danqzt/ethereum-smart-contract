const MyNFT = artifacts.require("MyNFT");
const MyNFTv2 = artifacts.require("MyNFTv2");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function(deployer) {
  //initial deployment
   //const myNFT = await deployProxy(MyNFT, ["DaqNFT", "DFT"], {deployer, initializer: 'initialize'});
   //console.log("myNFT address:" + myNFT.address);

   //upgrade the cotract
   //const myNFT = await MyNFT.deployed();
   //console.log("myNFT address:" + myNFT.address);
   //pass the transparent proxy adddress.
   const instance = await upgradeProxy("0x3c82516E1B3F73B71f16EB3483c7852c485D8231", MyNFTv2, { deployer });
   console.log("Upgraded:", instance.address);
} 