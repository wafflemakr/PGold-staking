import { STAKING_CONTRACT, TOKEN_ADDRESS, ZERO_ADDRESS } from "./constants";
import erc20Abi from "./abis/erc20";
import stakingAbi from "./abis/staking";

const Web3 = window.Web3;

export const getUserInfo = async user => {
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

  console.log(allowance, amount);

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

export const getStakeList = async account => {
  const events = await window.staking.getPastEvents("Staked", {
    filter: { user: account },
    fromBlock: 0
  });

  return events.map(({ returnValues }) => {
    return {
      id: returnValues.stakeId,
      amount: returnValues.amountToken / 10 ** 4,
      rate: `${Number(returnValues.rate / 1000).toFixed(2)} %`,
      startTime: returnValues.timestamp,
      endTime: returnValues.timestamp
    };
  });
};

export const getStakeDetails = async (account, stakeId) => {
  const stakeInfo = await window.staking.methods
    .getStakeDetails(account, stakeId)
    .call();
  console.log(stakeInfo);
  stakeInfo.amountStaked = stakeInfo.amountStaked / 10 ** 4;
  stakeInfo.currentRewards = stakeInfo.currentRewards / 10 ** 4;
  stakeInfo.id = stakeId;
  return stakeInfo;
};
