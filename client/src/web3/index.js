import { STAKING_CONTRACT, ZERO_ADDRESS } from "./constants";

export const getUserInfo = async (user) => {
  const userInfo = await window.staking.methods.getUserInfo(user).call();
  const balance = await window.token.methods.balanceOf(user).call();
  userInfo.balance = +balance / 10 ** 4;
  return userInfo;
};

export const register = async (referrer = ZERO_ADDRESS, account) => {
  await window.staking.methods.register(referrer).send({ from: account });
};

export const checkApproval = async (account, amount) => {
  const allowance = await window.token.methods
    .allowance(account, STAKING_CONTRACT)
    .call();

  if (allowance < amount)
    await window.token.methods
      .approve(STAKING_CONTRACT, -1)
      .send({ from: account });
};

export const createStake = async (amount, option, account) => {
  const stakeAmount = amount * 10 ** 4;

  await checkApproval(account, stakeAmount);
  await window.staking.methods
    .stake(stakeAmount, option)
    .send({ from: account });
};

export const endStake = async (stakeId, account) => {
  await window.staking.methods.unstake(stakeId).send({ from: account });

  return true;
};

const calculateEndTime = ({ option = 1, timestamp }) => {
  const MONTHS = 30 * 24 * 30 * 30;
  const startTime = Number(timestamp);
  switch (Number(option)) {
    case 1:
      return startTime + 6 * MONTHS;
    case 2:
      return startTime + 12 * MONTHS;
    case 3:
      return startTime + 18 * MONTHS;
    default:
      return 0;
  }
};

export const getStakeList = async (account) => {
  const events = await window.staking.getPastEvents("Staked", {
    filter: { user: account },
    fromBlock: 0,
  });

  let unstakeEvents = await window.staking.getPastEvents("Unstaked", {
    filter: { user: account },
    fromBlock: 0,
  });

  unstakeEvents = unstakeEvents.map((e) => e.returnValues.stakeId);

  return events.map(({ returnValues }) => {
    return {
      id: returnValues.stakeId,
      amount: returnValues.amountToken / 10 ** 4,
      rate: `${Number(returnValues.rate / 1000).toFixed(2)} %`,
      startTime: returnValues.timestamp,
      endTime: calculateEndTime(returnValues),
      claimed: unstakeEvents.includes(returnValues.stakeId),
    };
  });
};

export const getStakeDetails = async (account, stakeId) => {
  const stakeInfo = await window.staking.methods
    .getStakeDetails(account, stakeId)
    .call();
  stakeInfo.amountStaked = stakeInfo.amountStaked / 10 ** 4;
  stakeInfo.currentRewards = stakeInfo.currentRewards / 10 ** 4;
  stakeInfo.id = stakeId;
  return stakeInfo;
};
