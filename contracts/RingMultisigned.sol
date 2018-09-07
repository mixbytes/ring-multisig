pragma solidity ^0.4.0;

contract RingMultisigned {
    function RingMultisigned(){

    }




    modifier ringMultisigned(bytes32 topic, byte[] signature, uint256 threshold) {
        _;
    }
}
