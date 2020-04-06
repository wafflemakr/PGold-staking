const PGold = artifacts.require("PGold");
const Staking = artifacts.require("Staking");

const TOKEN_ADDRESS = "0x1A228cc444c434C6D3F15BcE7808E1B6C3a4B4Da";

module.exports = async function (deployer, network, accounts) {
  let pgold;

  if (network === "development") {
    await deployer.deploy(PGold);
    await deployer.deploy(Staking, PGold.address, accounts[0]);
    pgold = await PGold.deployed();
  } else {
    await deployer.deploy(Staking, TOKEN_ADDRESS, accounts[0]);
    pgold = await PGold.at(TOKEN_ADDRESS);
  }

  // Approve Staking contract to spend owners tokens
  console.log(
    "Approving Staking contract to spend PGold Tokens from Pool address"
  );
  await pgold.approve(Staking.address, web3.utils.toBN(35e6) * 10 ** 4);
};
