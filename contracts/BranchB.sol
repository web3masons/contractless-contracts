//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

contract BranchB {
  
  string salt = 'random string make bytecode hash unique';

  address payable constant bob = 0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4;
  address payable constant charlie = 0xE5904695748fe4A84b40b3fc79De2277660BD1D3;

  mapping (address => bool) _signers;

  function claim() public returns (bool success) {
    _signers[msg.sender] = true;
    if (_signers[bob] && _signers[charlie]) {
      bob.transfer(address(this).balance);
      return true;
    }
    return false;
  }

}