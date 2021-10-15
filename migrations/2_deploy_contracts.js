const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const CrowdFunding = artifacts.require("CrowdFunding.sol");
const TestCrowdFunding = artifacts.require("TestCrowdFunding.sol")

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.link(ConvertLib, CrowdFunding);
  deployer.link(ConvertLib, TestCrowdFunding);
};
