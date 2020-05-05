
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

pragma solidity ^0.5.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/GSN/Context.sol

pragma solidity ^0.5.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: @openzeppelin/contracts/ownership/Ownable.sol

pragma solidity ^0.5.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: @openzeppelin/contracts/math/SafeMath.sol

pragma solidity ^0.5.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     *
     * _Available since v2.4.0._
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: @openzeppelin/contracts/utils/ReentrancyGuard.sol

pragma solidity ^0.5.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * _Since v2.5.0:_ this module is now much more gas efficient, given net gas
 * metering changes introduced in the Istanbul hardfork.
 */
contract ReentrancyGuard {
    bool private _notEntered;

    constructor () internal {
        // Storing an initial non-zero value makes deployment a bit more
        // expensive, but in exchange the refund on every call to nonReentrant
        // will be lower in amount. Since refunds are capped to a percetange of
        // the total transaction's gas, it is best to keep them low in cases
        // like this one, to increase the likelihood of the full refund coming
        // into effect.
        _notEntered = true;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_notEntered, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _notEntered = false;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _notEntered = true;
    }
}

// File: contracts/lib/AddressSet.sol

pragma solidity ^0.5.0;


/**
 * @notice Key sets with enumeration and delete. Uses mappings for random
 * and existence checks and dynamic arrays for enumeration. Key uniqueness is enforced.
 * @dev Sets are unordered. Delete operations reorder keys. All operations have a
 * fixed gas cost at any scale, O(1).
 * author: Rob Hitchens
 */

library AddressSet {
    struct Set {
        mapping(address => uint256) keyPointers;
        address[] keyList;
    }

    /**
     * @notice insert a key.
     * @dev duplicate keys are not permitted.
     * @param self storage pointer to a Set.
     * @param key value to insert.
     */

    function insert(Set storage self, address key) internal {
        require(
            !exists(self, key),
            "AddressSet: key already exists in the set."
        );
        self.keyPointers[key] = self.keyList.push(key) - 1;
    }

    /**
     * @notice remove a key.
     * @dev key to remove must exist.
     * @param self storage pointer to a Set.
     * @param key value to remove.
     */

    function remove(Set storage self, address key) internal {
        require(
            exists(self, key),
            "AddressSet: key does not exist in the set."
        );
        uint256 last = count(self) - 1;
        uint256 rowToReplace = self.keyPointers[key];
        if (rowToReplace != last) {
            address keyToMove = self.keyList[last];
            self.keyPointers[keyToMove] = rowToReplace;
            self.keyList[rowToReplace] = keyToMove;
        }
        delete self.keyPointers[key];
        self.keyList.length--;
    }

    /**
     * @notice count the keys.
     * @param self storage pointer to a Set.
     */

    function count(Set storage self) internal view returns (uint256) {
        return (self.keyList.length);
    }

    /**
     * @notice check if a key is in the Set.
     * @param self storage pointer to a Set.
     * @param key value to check.
     * @return bool true: Set member, false: not a Set member.
     */

    function exists(Set storage self, address key)
        internal
        view
        returns (bool)
    {
        if (self.keyList.length == 0) return false;
        return self.keyList[self.keyPointers[key]] == key;
    }

    /**
     * @notice fetch a key by row (enumerate).
     * @param self storage pointer to a Set.
     * @param index row to enumerate. Must be < count() - 1.
     */

    function keyAtIndex(Set storage self, uint256 index)
        internal
        view
        returns (address)
    {
        return self.keyList[index];
    }

    /**
     * @notice destroy the Set. The Set will have zero members.
     * @dev does not prune mapped data. Enumerate keys and delete individually
     * to fully remove.
     * @param self storage pointer to a Set.
     */

    function nukeSet(Set storage self) public {
        delete self.keyList;
    }
}

// File: contracts/lib/UintSet.sol

pragma solidity ^0.5.0;


/**
 * @notice Key sets with enumeration and delete. Uses mappings for random
 * and existence checks and dynamic arrays for enumeration. Key uniqueness is enforced.
 * @dev Sets are unordered. Delete operations reorder keys. All operations have a
 * fixed gas cost at any scale, O(1).
 * author: Rob Hitchens
 */

library UintSet {
    struct Set {
        mapping(uint256 => uint256) keyPointers;
        uint256[] keyList;
    }

    /**
     * @notice insert a key.
     * @dev duplicate keys are not permitted.
     * @param self storage pointer to a Set.
     * @param key value to insert.
     */

    function insert(Set storage self, uint256 key) internal {
        require(!exists(self, key), "UintSet: key already exists in the set.");
        self.keyPointers[key] = self.keyList.push(key) - 1;
    }

    /**
     * @notice remove a key.
     * @dev key to remove must exist.
     * @param self storage pointer to a Set.
     * @param key value to remove.
     */

    function remove(Set storage self, uint256 key) internal {
        require(exists(self, key), "UintSet: key does not exist in the set.");
        uint256 last = count(self) - 1;
        uint256 rowToReplace = self.keyPointers[key];
        if (rowToReplace != last) {
            uint256 keyToMove = self.keyList[last];
            self.keyPointers[keyToMove] = rowToReplace;
            self.keyList[rowToReplace] = keyToMove;
        }
        delete self.keyPointers[key];
        self.keyList.length--;
    }

    /**
     * @notice count the keys.
     * @param self storage pointer to a Set.
     */

    function count(Set storage self) internal view returns (uint256) {
        return (self.keyList.length);
    }

    /**
     * @notice check if a key is in the Set.
     * @param self storage pointer to a Set.
     * @param key value to check.
     * @return bool true: Set member, false: not a Set member.
     */

    function exists(Set storage self, uint256 key)
        internal
        view
        returns (bool)
    {
        if (self.keyList.length == 0) return false;
        return self.keyList[self.keyPointers[key]] == key;
    }

    /**
     * @notice fetch a key by row (enumerate).
     * @param self storage pointer to a Set.
     * @param index row to enumerate. Must be < count() - 1.
     */

    function keyAtIndex(Set storage self, uint256 index)
        internal
        view
        returns (uint256)
    {
        return self.keyList[index];
    }

    /**
     * @notice destroy the Set. The Set will have zero members.
     * @dev does not prune mapped data. Enumerate keys and delete individually
     * to fully remove.
     * @param self storage pointer to a Set.
     */

    function nukeSet(Set storage self) public {
        delete self.keyList;
    }
}

// File: contracts/Staking.sol

pragma solidity ^0.5.10;








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
        uint256 rate,
        uint8 option
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

        if (_stake.option == 1) endTime = _stake.timeStaked.add(6 * 30 days);
        if (_stake.option == 2) endTime = _stake.timeStaked.add(12 * 30 days);
        if (_stake.option == 3) endTime = _stake.timeStaked.add(18 * 30 days);
    }

    /// @notice Calculate available rewards of a stake
    function calculateRewards(address user, uint256 stakeId)
        public
        view
        returns (uint256 rewards, bool canClaim)
    {
        Stake memory _stake = userStakesById[user][stakeId];

        uint256 secondsPassed = block.timestamp.sub(_stake.timeStaked);

        if (_stake.claimed) {
            rewards = 0;
            canClaim = false;
        } else {
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
        Stake memory _stake = userStakesById[user][stakeId];

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
        nonReentrant
    {
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

        // Deposit user's
        require(
            pgold.transferFrom(msg.sender, address(this), amount),
            "ERC20 transfer failed"
        );

        emit Staked(
            msg.sender,
            user.totalStakes,
            amount,
            block.timestamp,
            stakeRate,
            option
        );
    }

    /// @notice Unstake specific stake of PGOLD Tokens
    function unstake(uint256 stakeId) external nonReentrant {
        User storage user = userByAddress[msg.sender];
        Stake memory _stake = userStakesById[msg.sender][stakeId];

        require(!_stake.claimed, "Staked already claimed");
        require(user.stakes.exists(stakeId), "Not stake owner");

        (uint256 rewards, bool canClaim) = calculateRewards(
            msg.sender,
            stakeId
        );

        require(canClaim, "Stake time not finished");

        _stake.claimed = true;

        // Send staked amount from contract
        require(
            pgold.transfer(msg.sender, _stake.amountStaked),
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

    /// @notice Set pool address where contract can transfer tokens from
    function setPoolAddress(address _pool) external onlyOwner {
        pool = _pool;
    }

    /// @notice Fallback function
    function() external payable {
        revert();
    }
}
