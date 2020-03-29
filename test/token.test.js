const PGold = artifacts.require("PGold");
let catchRevert = require("./exceptionsHelpers.js").catchRevert;

// TOKEN DETAILS
const SUPPLY = 35e6; // (four point two million)
const NAME = "Pyrrhos Gold";
const SYMBOL = "PGOLD";
const DECIMALS = 4;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

contract("PGold Token", ([owner, user1, user2, user3, random]) => {
  let pgold;

  const getLastEvent = async eventName => {
    const events = await pgold.getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: "latest"
    });
    return events.pop().returnValues;
  };

  beforeEach(async () => {
    pgold = await PGold.new();
  });

  describe("Token::Deployment", () => {
    it("Correct Name", async () => {
      const name = await pgold.name();
      assert.equal(name, NAME, "incorrect name");
    });

    it("Correct Symbol", async () => {
      const symbol = await pgold.symbol();
      assert.equal(symbol, SYMBOL, "incorrect symbol");
    });

    it("Correct Decimals", async () => {
      let x = await pgold.decimals();
      assert.equal(x.toNumber(), DECIMALS, "incorrect decimals");
    });

    it("Correct Initial Supply", async () => {
      let initialSupply = await pgold.totalSupply();
      initialSupply = initialSupply.toString() / 10 ** DECIMALS;
      assert.equal(initialSupply, SUPPLY, "incorrect initial supply");
    });
  });

  describe("Token::Minting", () => {
    it("only address with minter role can mint tokens", async () => {
      await catchRevert(
        pgold.mint(user1, 5 * 10 ** DECIMALS, { from: random })
      );
      await pgold.mint(user1, 5 * 10 ** DECIMALS, { from: owner });

      const totalSupply = await pgold.totalSupply();
      assert.equal(
        totalSupply,
        (SUPPLY + 5) * 10 ** DECIMALS,
        "incorrect supply"
      );
    });

    it("only existing minter can add a new minter", async () => {
      await catchRevert(pgold.addMinter(user2, { from: random }));
      await pgold.addMinter(user2, { from: owner });

      const isMinter = await pgold.isMinter(user2);
      assert(isMinter);

      await pgold.mint(user1, 5 * 10 ** DECIMALS, { from: user2 });
    });

    it("correct transfer event when minting", async () => {
      await pgold.mint(user1, 5 * 10 ** DECIMALS, { from: owner });

      const { from, to, value } = await getLastEvent("Transfer");

      assert.equal(from, ZERO_ADDRESS);
      assert.equal(to, user1);
      assert.equal(value, 5 * 10 ** DECIMALS);
    });
  });

  describe("Token::Transfer", () => {
    it("cannot transfer a tokens not owned", async () => {
      await catchRevert(pgold.transfer(user1, 1, { from: random }));
      await pgold.mint(user1, 5 * 10 ** DECIMALS, { from: owner });
      await pgold.transfer(user2, 1, { from: user1 });
    });
    it("can delegate PGOLD transfer", async () => {
      await pgold.mint(user1, 5 * 10 ** DECIMALS, { from: owner });
      await pgold.approve(user2, 1000, { from: user1 });

      await pgold.transferFrom(user1, user3, 1000, { from: user2 });
      const balance = await pgold.balanceOf(user3);
      assert.equal(balance, 1000, "incorrect user3 balance");
    });
  });
});
