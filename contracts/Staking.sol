pragma solidity ^0.5.10;

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
        uint256 stakeId,
        uint256 amountToken,
        uint256 timestamp,
        uint256 rate
    );
    event Unstaked(
        address indexed user,
        uint256 stakeId,
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
    mapping(address => mapping(uint256 => Stake)) userStakesById;

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

    /// @notice initialize contract
    constructor(address _pgold, address _pool) public {
        pgold = IERC20(_pgold);
        pool = _pool;
    }

    // GETTERS

    /// @notice Get stake expiration time
    /// @param stakeId id of the stake to query
    function getStakeEndTime(address user, uint256 stakeId)
        public
        view
        returns (uint256 endTime)
    {
        Stake memory _stake = userStakesById[user][stakeId];

        // Testing timeframes
        if (_stake.option == 1) endTime = _stake.timeStaked.add(6 * 30 minutes);
        if (_stake.option == 2)
            endTime = _stake.timeStaked.add(12 * 30 minutes);
        if (_stake.option == 3)
            endTime = _stake.timeStaked.add(18 * 30 minutes);

        // if (_stake.option == 1) endTime = _stake.timeStaked.add(6 * 30 days);
        // if (_stake.option == 2) endTime = _stake.timeStaked.add(12 * 30 days);
        // if (_stake.option == 3) endTime = _stake.timeStaked.add(18 * 30 days);
    }

    /// @notice Calculate available rewards of a stake
    function calculateRewards(address user, uint256 stakeId)
        public
        view
        returns (uint256 rewards, bool canClaim)
    {
        Stake memory _stake = userStakesById[user][stakeId];

        uint256 secondsPassed = block.timestamp.sub(_stake.timeStaked);

        rewards = _stake
            .amountStaked
            .mul(secondsPassed)
            .mul(_stake.rate)
            .div(1000) // format rate to decimal
            .div(100) // format to percentage
            .div(365 days); // format per second
        if (block.timestamp > getStakeEndTime(user, stakeId)) {
            canClaim = true;
        }
    }

    /// @notice Get User Info
    function getUserInfo(address user)
        external
        view
        returns (
            address referrer,
            uint256 activeStakes,
            uint256 amountReferees,
            bool isRegistered
        )
    {
        User storage _user = userByAddress[user];

        referrer = _user.referrer;
        activeStakes = _user.stakes.count();
        isRegistered = _user.registered;
        amountReferees = _user.referees.count();
    }

    /// @notice Get Stake Details
    function getStakeDetails(address user, uint256 stakeId)
        external
        view
        returns (
            uint256 amountStaked,
            uint256 currentRewards,
            uint256 stakeEndTime,
            uint256 timeStaked,
            uint256 rate,
            bool claimed,
            bool canClaim,
            uint8 option
        )
    {
        Stake storage _stake = userStakesById[user][stakeId];

        amountStaked = _stake.amountStaked;
        timeStaked = _stake.timeStaked;
        rate = _stake.rate;
        claimed = _stake.claimed;
        option = _stake.option;

        (currentRewards, canClaim) = calculateRewards(user, stakeId);
        stakeEndTime = getStakeEndTime(user, stakeId);
    }

    // MAIN FUNCTIONS

    /// @notice User Registration with referral Id
    /// @param refAddress user's referrer address
    function register(address refAddress) external {
        User memory user = userByAddress[msg.sender];

        require(!user.registered, "You cannot register again");

        // If user registers with a referral link
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

    /// @dev internal function to create user
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

        // Calculate stake rate for given option
        uint256 refereesCountReward = user.referees.count().mul(1000); // add +1% for each referee
        uint256 refLinkReward = user.referrer != address(0) ? 2000 : 0; // add +2% if used ref link
        uint256 stakeRate = rates[option].add(refereesCountReward).add(
            refLinkReward
        );

        // If rate greater than 15% lower it to 15%
        if (stakeRate > 15000) stakeRate = 15000;

        userStakesById[msg.sender][user.totalStakes] = Stake(
            amount,
            block.timestamp,
            stakeRate,
            false,
            option
        );

        user.stakes.insert(user.totalStakes);

        emit Staked(
            msg.sender,
            user.totalStakes,
            amount,
            block.timestamp,
            stakeRate
        );
    }

    /// @notice Unstake specific stake of PGOLD Tokens
    function unstake(uint256 stakeId) external nonReentrant {
        User storage user = userByAddress[msg.sender];
        Stake storage _stake = userStakesById[msg.sender][stakeId];

        require(!_stake.claimed, "Staked already claimed");
        require(user.stakes.exists(stakeId), "Not stake owner");

        (uint256 rewards, bool canClaim) = calculateRewards(
            msg.sender,
            stakeId
        );

        require(!canClaim, "Stake time not finished");

        // Send staked amount from contract
        require(
            pgold.transferFrom(address(this), msg.sender, _stake.amountStaked),
            "ERC20 transfer failed"
        );

        // Send rewards from pool address
        require(
            pgold.transferFrom(pool, msg.sender, rewards),
            "ERC20 transfer failed"
        );

        emit Unstaked(
            msg.sender,
            stakeId,
            _stake.amountStaked.add(rewards),
            block.timestamp
        );
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
