pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";


/**
 * @title TAG Token Contract
 *
 * @author @wafflemakr
 *
 */
contract PGold is ERC20Detailed, ERC20Mintable, ERC20Burnable {
    constructor() public ERC20Detailed("Pyrrhos Gold", "PGOLD", 4) {
        _mint(msg.sender, 35e6 * 10**uint256(4));
    }
}
