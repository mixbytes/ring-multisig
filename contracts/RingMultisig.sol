pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "mobius-truffle-mixbytes/contracts/LinkableRing.sol";
import {bn256g1 as Curve} from 'mobius-truffle-mixbytes/contracts/bn256g1.sol';

contract RingMultisig is Ownable {
    using LinkableRing for LinkableRing.Data;

    constructor(
        uint256[] _publicKeysX,
        uint256[] _publicKeysY,
        uint256 _threshold,
        bytes32 _guid
    ) public {
        require(_publicKeysX.length == _publicKeysY.length);
        require(_publicKeysX.length >= _threshold);

        threshold = _threshold;

        ringData.initialize(_guid, _publicKeysX.length);
        for (uint i; i<_publicKeysX.length; i++) {
            ringData.addParticipant(_publicKeysX[i], _publicKeysY[i]);
        }
        assert(ringData.isFull());
    }

    /************************** PROPERTIES **************************/

    uint256 public threshold;
    LinkableRing.Data ringData;


    /************************** PUBLIC **************************/

    function addSign(uint256[32] _sign) public onlyOwner {

    }

    function getPublicKeysCount() public view returns (uint256) {
        return ringData.pubkeys.length;
    }

    function getPublicKey(uint256 i) public view returns (uint256 x, uint256 y) {
        return (ringData.pubkeys[i].X, ringData.pubkeys[i].Y);
    }

    function getMessage() public view returns (bytes32) {
        return ringData.message();
    }

}
