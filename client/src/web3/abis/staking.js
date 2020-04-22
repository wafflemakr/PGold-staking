export default [
  {
    constant: true,
    inputs: [],
    name: "pool",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "pgold",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isPaused",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalUsers",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_pgold",
        type: "address",
      },
      {
        name: "_pool",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "referrer",
        type: "address",
      },
    ],
    name: "NewUser",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "stakeId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "amountToken",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        name: "rate",
        type: "uint256",
      },
      {
        indexed: false,
        name: "option",
        type: "uint8",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "stakeId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "amountToken",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Unstaked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "getStakeEndTime",
    outputs: [
      {
        name: "endTime",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "calculateRewards",
    outputs: [
      {
        name: "rewards",
        type: "uint256",
      },
      {
        name: "canClaim",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
    ],
    name: "getUserInfo",
    outputs: [
      {
        name: "referrer",
        type: "address",
      },
      {
        name: "activeStakes",
        type: "uint256",
      },
      {
        name: "amountReferees",
        type: "uint256",
      },
      {
        name: "isRegistered",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "getStakeDetails",
    outputs: [
      {
        name: "amountStaked",
        type: "uint256",
      },
      {
        name: "currentRewards",
        type: "uint256",
      },
      {
        name: "stakeEndTime",
        type: "uint256",
      },
      {
        name: "timeStaked",
        type: "uint256",
      },
      {
        name: "rate",
        type: "uint256",
      },
      {
        name: "claimed",
        type: "bool",
      },
      {
        name: "canClaim",
        type: "bool",
      },
      {
        name: "option",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "refAddress",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "option",
        type: "uint8",
      },
    ],
    name: "stake",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pauseContract",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unPauseContract",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pool",
        type: "address",
      },
    ],
    name: "setPoolAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
