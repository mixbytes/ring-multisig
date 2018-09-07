pragma solidity ^0.4.24;

contract RingMultisigned {
    constructor() public {

    }




    modifier ringMultisigned(bytes32 topic, byte[] signature, uint256 threshold) {
        _;
    }
}
