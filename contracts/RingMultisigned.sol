pragma solidity ^0.4.24;

import "./RingMultisig.sol";

/**
 * Used as base class for contracts which use multiple ring multisigs
 */
contract RingMultisigned {
    constructor() public {

    }

    modifier ringMultisigned(RingMultisig _ringMultisig, uint256[2] _tagPoint, uint256[] _ctlist) {
        require(_ringMultisig.getTagsCount() < _ringMultisig.threshold());

        require(_ringMultisig.isSignatureValid(_tagPoint, _ctlist));
        _ringMultisig.addTag(_tagPoint[0]);

        if(_ringMultisig.getTagsCount() >= _ringMultisig.threshold()) {
            _;
        }
    }
}
