pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../RingMultisigned.sol";
import "../RingMultisig.sol";

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
            uint256[] publicKeys, //todo correct type
            uint256 juryThreshold,
            bool isGuilty,
            uint256 alreadyMadeDecisions
        )
    {
        judgmentMatter = judgments[_num].judgmentMatter;

        publicKeys = new uint256[](judgments[_num].ringMultisig.getPublicKeysCount());
        for (uint i=0; i<publicKeys.length; i++) {
            publicKeys[i] = judgments[_num].ringMultisig.publicKeys(i);
        }
        juryThreshold = judgments[_num].ringMultisig.juryThreshold();
        isGuilty = judgments[_num].isGuilty;
        alreadyMadeDecisions = 0; // todo
    }

    /************************** PUBLIC **************************/

    function add(string _judgmentMatter, uint256[] _publicKeys, uint256 _juryThreshold) public onlyOwner {
        require( 0 == judgmentsIndex[ hash(_judgmentMatter) ] );
        require(_publicKeys.length>=_juryThreshold);

        judgments.push(
            Judgment(
                _judgmentMatter,
                false,
                new RingMultisig(_publicKeys, _juryThreshold) // todo proxy
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
