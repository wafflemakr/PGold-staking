pragma solidity 0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./lib/AddressSet.sol";
import "./lib/UintSet.sol";


/**
@notice contract for staking
 */
contract Staking is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using AddressSet for AddressSet.Set;
    using UintSet for UintSet.Set;

    // EVENTS

    event NewUser(address user, address referrer);
    event Staked(
        address indexed user,
        uint256 amountToken,
        uint256 timestamp,
        uint8 option
    );
    event Unstaked(
        address indexed user,
        uint256 amountToken,
        uint256 timestamp
    );

    // VARIABLES

    IERC20 public pgold;
    address public pool;
    uint256 public totalUsers;
    bool public isPaused;

    uint256[] rates = [0, 3000, 4500, 6500];

    struct Stake {
        uint256 amountStaked;
        uint256 timeStaked;
        uint256 rate;
        bool claimed;
        uint8 option;
        /**
            OPTIONS

            (1) Lock Tokens For 6 months = 3% anually
            (2) Lock Tokens For 12 months = 4.5% anually
            (3) Lock Tokens For 18 months = 6.5% anually

         */
    }

    struct User {
        address referrer;
        uint256 totalStakes;
        bool registered;
        AddressSet.Set referees;
        UintSet.Set stakes;
    }

    mapping(address => User) userByAddress;
    mapping(uint256 => Stake) stakeById;

    modifier onlyActive() {
        require(!isPaused, "contract is not active");
        _;
    }

    modifier onlyRegistered() {
        require(!isPaused, "contract is not active");
        _;
    }

    modifier validOption(uint8 option) {
        require(
            option == 1 || option == 2 || option == 3,
            "Invalid Staking option"
        );
        _;
    }

    constructor(address _pgold, address _pool) public {
        pgold = IERC20(_pgold);
        pool = _pool;
    }

    /// @notice Get stake expiration time
    /// @param stakeId id of the stake to query
    function getStakeEndTime(uint256 stakeId)
        public
        view
        returns (uint256 endTime)
    {
        Stake memory _stake = stakeById[stakeId];

        // Testing timeframes
        if (_stake.option == 1) endTime = _stake.timeStaked.add(6 * 60 seconds);
        if (_stake.option == 2)
            endTime = _stake.timeStaked.add(12 * 60 seconds);
        if (_stake.option == 3)
            endTime = _stake.timeStaked.add(18 * 60 seconds);

        // if (_stake.option == 1) endTime = _stake.timeStaked.add(6 * 30 days);
        // if (_stake.option == 2) endTime = _stake.timeStaked.add(12 * 30 days);
        // if (_stake.option == 3) endTime = _stake.timeStaked.add(18 * 30 days);
    }

    /// @notice Calculate available rewards of a stake
    function calculateRewards(uint256 stakeId)
        public
        view
        returns (uint256 rewards)
    {
        Stake memory _stake = stakeById[stakeId];

        if (block.timestamp > getStakeEndTime(stakeId)) {
            uint256 timePassed = block.timestamp.sub(_stake.timeStaked);

            rewards = _stake
                .amountStaked
                .mul(timePassed)
                .mul(rates[_stake.option])
                .div(1000)
                .div(365 days);
        }
    }

    /// @notice User Registration with referral Id
    /// @param refAddress user's referrer address
    function register(address refAddress) external {
        // If register with a referral link, address is not empty
        if (refAddress != address(0)) {
            User storage user = userByAddress[refAddress];
            if (user.registered) {
                // Add user as referral
                user.referees.insert(msg.sender);
            }
        }
        _createUser(refAddress);

        emit NewUser(msg.sender, refAddress);
    }

    function _createUser(address refAddress) internal {
        // Create new ref Id for user
        totalUsers++;
        AddressSet.Set memory _referees;
        UintSet.Set memory _stakes;
        userByAddress[msg.sender] = User(
            refAddress,
            0,
            true,
            _referees,
            _stakes
        );
    }

    /// @notice Stake PGOLD Tokens for a given timeframe
    function stake(uint256 amount, uint8 option)
        external
        onlyActive
        onlyRegistered
        validOption(option)
    {
        // Deposit user's
        require(
            pgold.transferFrom(msg.sender, address(this), amount),
            "ERC20 transfer failed"
        );

        User storage user = userByAddress[msg.sender];
        user.totalStakes++;

        uint256 amountReferees = user.referees.count();

        uint256 stakeRate = rates[option].add(amountReferees.mul(1000));

        // If rate greater than 15% lower it to 15%
        if (stakeRate > 15000) stakeRate = 15000;

        stakeById[user.totalStakes] = Stake(
            amount,
            block.timestamp,
            stakeRate,
            false,
            option
        );

        user.stakes.insert(user.totalStakes);

        emit Staked(msg.sender, amount, block.timestamp, option);
    }

    /// @notice Unstake specific stake of PGOLD Tokens
    function unstake(uint256 stakeId) external nonReentrant {
        User storage user = userByAddress[msg.sender];
        Stake storage _stake = stakeById[stakeId];

        require(!_stake.claimed, "Staked already claimed");
        require(user.stakes.exists(stakeId), "Not stake owner");
        require(
            block.timestamp > getStakeEndTime(stakeId),
            "Stake time not finished"
        );

        uint256 rewards = calculateRewards(stakeId);

        uint256 amountToSend = _stake.amountStaked.add(rewards);

        if (amountToSend > pgold.balanceOf(address(this))) {
            // Send staked amount + rewards to user from pool address
            require(
                pgold.transferFrom(pool, msg.sender, amountToSend),
                "ERC20 transfer failed"
            );
        } else {
            // Send staked amount + rewards to user from pool this contract
            require(
                pgold.transferFrom(address(this), msg.sender, amountToSend),
                "ERC20 transfer failed"
            );
        }

        emit Unstaked(msg.sender, amountToSend, block.timestamp);
    }

    // OWNER SETTINGS

    /// @notice Pause staking
    function pauseContract() external onlyOwner onlyActive {
        require(!isPaused, "contract is already paused");
        isPaused = true;
    }

    /// @notice Upause staking
    function unPauseContract() external onlyOwner {
        require(isPaused, "contract is already unpaused");
        isPaused = true;
    }

    /// @notice Set new token address
    function setTokenAddress(IERC20 _pgold) external onlyOwner {
        pgold = _pgold;
    }

    /// @notice Set pool address where contract can transfer tokens from
    function setPoolAddress(address _pool) external onlyOwner {
        pool = _pool;
    }
}
