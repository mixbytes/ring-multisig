pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../RingMultisigned.sol";

contract Jury is Ownable, RingMultisigned {

    constructor() public {
        judgments.push( // dummy
            Judgment(
                '',
                new bytes32[](0),
                0,
                false
            )
        );
    }

    /************************** STRUCTURES **************************/

    struct Judgment {
        string judgmentMatter;
        bytes32[] publicKeys;
        uint256 juryThreshold;
        bool isGuilty;
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
            bytes32[] publicKeys, //todo correct type
            uint juryThreshold,
            bool isGuilty,
            uint alreadyMadeDecision
        )
    {
        judgmentMatter = judgments[_num].judgmentMatter;
        publicKeys = judgments[_num].publicKeys;
        juryThreshold = judgments[_num].juryThreshold;
        isGuilty = judgments[_num].isGuilty;
        alreadyMadeDecision = 0; // todo
    }

    /************************** PUBLIC **************************/

    function add(string _judgmentMatter, bytes32[] _publicKeys, uint256 _juryThreshold) public onlyOwner {
        require( 0 == judgmentsIndex[ hash(_judgmentMatter) ] );
        require(_publicKeys.length>=_juryThreshold);

        judgments.push(
            Judgment(
                _judgmentMatter,
                _publicKeys,
                _juryThreshold,
                false
            )
        );

        judgmentsIndex[ hash(_judgmentMatter) ] = judgments.length - 1;
    }

    function guilty(bytes32 _judgmentsHash, bytes32[32] _signature)
        public
        correctJudgmentHash(_judgmentsHash)
        ringMultisigned(
            _judgmentsHash,
            _signature,
            judgments[ judgmentsIndex[_judgmentsHash] ].juryThreshold
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
