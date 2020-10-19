//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

// A 0xc783df8a850f42e7F7e57013759C285caa701eB6
// B 0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4
// C 0xE5904695748fe4A84b40b3fc79De2277660BD1D3

interface Branch {
  function execute() external;
}

contract Root {

  string salt = 'random string make bytecode hash unique';

  // after block 10, the second tree can be executed
  uint public constant deadline = 10;

  address public constant alice = 0xc783df8a850f42e7F7e57013759C285caa701eB6;
  address payable public constant branch_a = 0x1342a132CD0BAF55E181705803664CCE0004CB29;
  address payable public constant branch_b = 0x7De3E5f09604075369F5F429ec0196348D656d64;

  function execute() public {
      if (msg.sender == alice) {
          branch_a.transfer(address(this).balance);
          // selfdestruct?
      } else if (block.number > deadline) {
          branch_b.transfer(address(this).balance);
          // selfdestruct?
      }
  }  
}

