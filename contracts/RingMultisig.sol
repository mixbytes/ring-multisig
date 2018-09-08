pragma solidity ^0.4.24;

contract RingMultisig {
    constructor(
        uint256[] _publicKeys,
        uint256 _juryThreshold
    ) public {
        publicKeys = _publicKeys;
        juryThreshold = _juryThreshold;
    }

    /************************** PROPERTIES **************************/

    uint256[] public publicKeys;
    uint256 public juryThreshold;

    /************************** PUBLIC **************************/

    function getPublicKeysCount() public view returns (uint256) {
        return publicKeys.length;
    }

}
