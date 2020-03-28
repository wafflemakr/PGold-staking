pragma solidity 0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./lib/AddressSet.sol";


/**
@notice contract for staking
 */
contract Staking is Ownable {
    using SafeMath for uint256;

    using AddressSet for AddressSet.Set;

    // EVENTS

    event NewUser(address user, address referrer);
    event Staked(address user, uint256 amountToken, uint256 timestamp);
    event Unstaked(address user, uint256 amountToken, uint256 timestamp);

    // VARIABLES

    IERC20 public pgold;
    uint256 public totalUsers;
    bool public isPaused;

    struct Stakes {
        uint256 stakeId;
        uint256 amountStaked;
        uint256 timeStaked;
        uint8 option;
    }

    struct User {
        address referrer;
        bool registered;
        AddressSet.Set referees;
    }

    mapping(address => User) userByAddress;

    modifier onlyActive() {
        require(!isPaused, "contract is not active");
        _;
    }

    modifier onlyRegistered() {
        require(!isPaused, "contract is not active");
        _;
    }

    constructor(address _pgold) public {
        pgold = IERC20(_pgold);
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

        // Create new ref Id for user
        totalUsers++;
        AddressSet.Set memory _referees;
        userByAddress[msg.sender] = User(refAddress, true, _referees);

        emit NewUser(msg.sender, refAddress);
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
