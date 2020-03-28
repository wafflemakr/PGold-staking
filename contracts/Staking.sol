pragma solidity 0.5.7;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
@notice contract for staking
 */
contract Staking is Ownable {
    using SafeMath for uint256;


    // EVENTS
    
    event NewUser(address user, uint refId);
    event Staked(address user, uint256 amountToken, uint256 timestamp);
    event Unstaked(address user, uint256 amountToken, uint256 timestamp);

    // VARIABLES

    IERC20 public pgold;
    uint public totalUsers;
    bool public isPaused;

    mapping(uint => address) public refIds;
    mapping(address => address) public referrals;

    modifier onlyActive() {
        require(!isPaused, "contract is not active");
        _;
    }

    constructor(
        address _pgold
    ) public {
        pgold = IERC20(_pgold);
    }

    function register(uint _refId) external{

        // If register with a referral Id, store the user's referrer
        if(_refId > 0) referrals[msg.sender] = refIds[_refId];

        // Create new ref Id for user
        totalUsers++;
        refIds[totalUsers] = msg.sender;

        emit NewUser(msg.sender, totalUsers);
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
}