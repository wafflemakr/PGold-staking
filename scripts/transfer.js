const PGold = artifacts.require("PGold");

//truffle exec scripts/transfer.js <to> <amount> --network rinkeby

module.exports = async callback => {
  try {
    const token = await PGold.deployed();
    const to = process.argv[4];
    const amount = process.argv[5];

    console.log(`Sending tokens...`);
    await token.transfer(to, Number(amount) * 10 ** 4);

    console.log(`Done!`);

    callback();
  } catch (e) {
    callback(e);
  }
};
