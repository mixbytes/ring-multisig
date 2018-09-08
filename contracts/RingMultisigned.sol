pragma solidity ^0.4.24;

import "./RingMultisig.sol";

contract RingMultisigned {
    constructor() public {

    }




    modifier ringMultisigned(RingMultisig ringMultisig, bytes32[32] signature) {
        _;
    }
}
