pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../RingMultisigned.sol";
import "../RingMultisig.sol";
import {bn256g1 as Curve} from 'mobius-truffle-mixbytes/contracts/bn256g1.sol';

contract Jury is Ownable, RingMultisigned {

    constructor() public {
        judgments.push( // dummy
            Judgment(
                '',
                false,
                RingMultisig(0x0)
            )
        );
    }

    /************************** STRUCTURES **************************/

    struct Judgment {
        string judgmentMatter;
        bool isGuilty;
        RingMultisig ringMultisig;
    }

    /************************** PROPERTIES **************************/

    Judgment[] judgments;
    mapping(bytes32=>uint) judgmentsIndex;

    /************************** MODIFIERS **************************/

    modifier correctJudgmentHash(bytes32 _judgmentsHash) {
        require(0 != judgmentsIndex[_judgmentsHash]);
        _;
    }

    /************************** EXTERNAL **************************/

    function getJudgmentsCount() external view returns (uint256) {
        return judgments.length;
    }

    function getJudgment(uint _num)
        external
        view
        returns (
            string judgmentMatter,
            uint256[] publicKeysX,
            uint256[] publicKeysY,
            uint256 juryThreshold,
            bool isGuilty,
            uint256 alreadyMadeDecisions,
            bytes32 message
        )
    {
        judgmentMatter = judgments[_num].judgmentMatter;

        publicKeysX = new uint256[](judgments[_num].ringMultisig.getPublicKeysCount());
        publicKeysY = new uint256[](publicKeysX.length);
        for (uint i=0; i<publicKeysX.length; i++) {
            (publicKeysX[i], publicKeysY[i]) = judgments[_num].ringMultisig.getPublicKey(i);
        }
        juryThreshold = judgments[_num].ringMultisig.threshold();
        isGuilty = judgments[_num].isGuilty;
        alreadyMadeDecisions = 0; // todo
        message = judgments[_num].ringMultisig.getMessage();
    }

    /************************** PUBLIC **************************/

    function add(string _judgmentMatter, uint256[] _publicKeysX, uint256[] _publicKeysY, uint256 _juryThreshold) public onlyOwner {
        require( 0 == judgmentsIndex[ hash(_judgmentMatter) ] );
        require(_publicKeysX.length == _publicKeysY.length);
        require(_publicKeysX.length>=_juryThreshold);

        judgments.push(
            Judgment(
                _judgmentMatter,
                false,
                new RingMultisig(_publicKeysX, _publicKeysY, _juryThreshold, hash(_judgmentMatter)) // todo proxy
            )
        );

        judgmentsIndex[ hash(_judgmentMatter) ] = judgments.length - 1;
    }

    function guilty(bytes32 _judgmentsHash, bytes32[32] _signature)
        public
        correctJudgmentHash(_judgmentsHash)
        ringMultisigned(
            judgments[ judgmentsIndex[_judgmentsHash] ].ringMultisig,
            _signature
        )
    {
        judgments[ judgmentsIndex[_judgmentsHash] ].isGuilty = true;
    }


    /************************** INTERNAL **************************/


    function hash(string _str) internal pure returns (bytes32) {
        return keccak256(
            bytes(_str)
        );
    }
}
