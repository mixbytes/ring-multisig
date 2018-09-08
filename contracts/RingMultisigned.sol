pragma solidity ^0.4.24;

contract RingMultisigned {
    constructor() public {

    }




    modifier ringMultisigned(bytes32 topic, bytes32[32] signature, uint256 threshold) {
        _;
    }
}
