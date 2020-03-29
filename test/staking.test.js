const PGold = artifacts.require("PGold");
const Staking = artifacts.require("Staking");
let catchRevert = require("./exceptionsHelpers.js").catchRevert;

require("./utils");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

contract("Staking", ([owner, user1, user2, user3, random]) => {
  let staking;

  const getLastEvent = async eventName => {
    const events = await staking.getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: "latest"
    });
    return events.pop().returnValues;
  };

  before(async () => {
    pgold = await PGold.new();
    staking = await Staking.new(pgold.address, owner);

    await pgold.approve(staking.address, 1e9 * 10 ** 4);
    await pgold.transfer(user1, 10000 * 10 ** 4);
    await pgold.transfer(user2, 10000 * 10 ** 4);
  });

  describe("Register", () => {
    it("user can register to the platform", async () => {
      await staking.register(ZERO_ADDRESS);
    });

    it("correct NewUser event", async () => {
      const { user, referrer } = await getLastEvent("NewUser");

      assert.equal(referrer, ZERO_ADDRESS);
      assert.equal(user, owner);
    });

    it("user can register with ref address", async () => {
      await staking.register(owner, { from: user1 });
    });

    it("correct NewUser event", async () => {
      const { user, referrer } = await getLastEvent("NewUser");

      assert.equal(referrer, owner);
      assert.equal(user, user1);
    });

    it("correct referee info", async () => {
      const {
        referrer,
        activeStakes,
        amountReferees,
        isRegistered
      } = await staking.getUserInfo(user1);

      assert.equal(referrer, owner);
      assert.equal(activeStakes, 0);
      assert.equal(amountReferees, 0);
      assert.equal(isRegistered, true);
    });

    it("correct referrer info", async () => {
      const {
        referrer,
        activeStakes,
        amountReferees,
        isRegistered
      } = await staking.getUserInfo(owner);

      assert.equal(referrer, ZERO_ADDRESS);
      assert.equal(activeStakes, 0);
      assert.equal(amountReferees, 1);
      assert.equal(isRegistered, true);
    });

    it("should revert if user tries to register again", async () => {
      await catchRevert(
        staking.register(owner, { from: user1 }),
        "revert You cannot register again"
      );
    });
  });

  const STAKE_AMOUNT = 100 * 10 ** 4;
  describe("Staking", () => {
    it("user cant create stake without approving token transfer", async () => {
      await catchRevert(
        staking.stake(STAKE_AMOUNT, 1, { from: user1 }),
        "revert ERC20: transfer amount exceeds allowance"
      );
    });

    it("user can create stake ", async () => {
      await pgold.approve(staking.address, STAKE_AMOUNT, { from: user1 });
      await staking.stake(STAKE_AMOUNT, 1, { from: user1 });
    });

    it("correct Staked event", async () => {
      const { user, stakeId, amountToken, option } = await getLastEvent(
        "Staked"
      );
      assert.equal(user, user1);
      assert.equal(stakeId, 1);
      assert.equal(amountToken, STAKE_AMOUNT);
      assert.equal(option, 1);
    });

    it("correct stake info", async () => {
      const { activeStakes } = await staking.getUserInfo(user1);

      const { amountStaked, rate } = await staking.getStakeDetails(user1, 1);

      assert.equal(activeStakes, 1);
      assert.equal(amountStaked, STAKE_AMOUNT);
      assert.equal(rate.toString(), 5000); // 3% option1 + 2% for using ref link
    });
  });

  describe("Unstaking", () => {
    it("user cant unstake before time expires", async () => {
      await catchRevert(
        staking.unstake(1, { from: user1 }),
        "revert Stake time not finished"
      );
    });

    it("user can unstake after expiration", async () => {
      // 6 months after
      await advanceTimeAndBlock(180 * 24 * 60 * 60);
      await staking.unstake(1, { from: user1 });
    });

    it("correct Unstaked event", async () => {
      const block = await web3.eth.getBlock("latest");

      const { amountStaked, timeStaked, rate } = await staking.getStakeDetails(
        user1,
        1
      );
      const reward = await staking.calculateRewards(user1, 1);
      const { user, stakeId, amountToken } = await getLastEvent("Unstaked");

      assert.equal(user, user1);
      assert.equal(stakeId, 1);
      assert.equal(
        amountToken,
        Math.floor(
          +amountStaked +
            Number(
              (amountStaked * (block.timestamp - timeStaked) * rate) /
                100000 /
                (365 * 24 * 60 * 60)
            )
        )
      );
    });
  });
});
