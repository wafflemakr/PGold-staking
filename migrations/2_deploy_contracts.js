const PGold = artifacts.require("PGold");
const Staking = artifacts.require("Staking");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(PGold);
  await deployer.deploy(Staking, PGold.address, accounts[1]);

  // Approve Staking contract to spend owners tokens
  const pgold = await PGold.deployed();
  await pgold.approve(Staking.address, web3.utils.toBN(35e6) * 10 ** 4);
};
