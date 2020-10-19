// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./lib/Create2.sol";

contract Factory {
    
    event Deployed(address deployed);

    function deploy(uint256 value, bytes32 salt, bytes memory code) public {
        emit Deployed(Create2.deploy(value, salt, code));
    }

    function computeAddress(bytes32 salt, bytes32 codeHash) public view returns (address) {
        return Create2.computeAddress(salt, codeHash);
    }

    receive() payable external {}
}
