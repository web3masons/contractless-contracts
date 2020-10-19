//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

contract BranchA {

  string salt = 'random string make bytecode hash unique';

  address payable constant alice = 0xc783df8a850f42e7F7e57013759C285caa701eB6;

  function claim() public returns (bool success) {
    alice.transfer(address(this).balance);
    return true;
  }
}