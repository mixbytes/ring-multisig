pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../RingMultisigned.sol";
import "../RingMultisig.sol";


/**
 * Example of RingMultisig usage which runs several anonymous votes
 *
 */
contract Jury is Ownable, RingMultisigned {

    constructor() public {

    }

    /************************** STRUCTURES **************************/

    struct Judgment {
        string judgmentMatter;
        bytes32 judgmentMatterHash;
        bool isGuilty;
        RingMultisig ringMultisig;
        uint256 deadline;
        uint256 startedAt;
        address author;
    }

    /************************** PROPERTIES **************************/

    bytes32[] judgmentsIndexes;
    mapping(bytes32=>Judgment) judgments;

    /************************** MODIFIERS **************************/

    modifier correctJudgmentHash(bytes32 _judgmentsHash) {
        require(0 != uint256(judgments[_judgmentsHash].judgmentMatterHash));
        _;
    }

    modifier beforeDeadline(bytes32 _judgmentsHash) {
        require(judgments[_judgmentsHash].deadline > now);
        _;
    }

    /************************** EXTERNAL **************************/

    function getJudgmentsCount() external view returns (uint256) {
        return judgmentsIndexes.length;
    }

    function getJudgmentsIndexes() external view returns (bytes32[] res) { // todo offset&limit
        res = new bytes32[](judgmentsIndexes.length);
        for (uint i; i< res.length; i++) {
            res[i] = judgmentsIndexes[i];
        }
    }

    function getJudgment(bytes32 _index)
        external
        view
        returns (
            string judgmentMatter,
            uint256[] publicKeysX,
            uint256[] publicKeysY,
            uint256 juryThreshold,
            bool isGuilty,
            uint256 alreadyMadeDecisions,
            bytes32 signMessage, //unique hash used to create ring signature
            uint256 startedAt,
            uint256 deadline,
            address author
        )
    {
        judgmentMatter = judgments[_index].judgmentMatter;

        publicKeysX = new uint256[](judgments[_index].ringMultisig.getPublicKeysCount());
        publicKeysY = new uint256[](publicKeysX.length);
        for (uint i=0; i<publicKeysX.length; i++) {
            (publicKeysX[i], publicKeysY[i]) = judgments[_index].ringMultisig.getPublicKey(i);
        }
        juryThreshold = judgments[_index].ringMultisig.threshold();
        isGuilty = judgments[_index].isGuilty;
        alreadyMadeDecisions = judgments[_index].ringMultisig.getTagsCount();
        signMessage = judgments[_index].ringMultisig.getMessage();
        startedAt = judgments[_index].startedAt;
        deadline = judgments[_index].deadline;
        author = judgments[_index].author;
    }

    /************************** PUBLIC **************************/

    /**
     * Add new element to list of structures
     **/
    function add(
        string _judgmentMatter,
        uint256[] _publicKeysX,
        uint256[] _publicKeysY,
        uint256 _juryThreshold,
        uint256 deadline
    ) public /*onlyOwner*/ {
        require( 0 == uint256(judgments[ hash(_judgmentMatter) ].judgmentMatterHash) );
        require(_publicKeysX.length == _publicKeysY.length);
        require(_publicKeysX.length>=_juryThreshold);

        judgments[hash(_judgmentMatter)] =
            Judgment(
                _judgmentMatter,
                hash(_judgmentMatter),
                false,
                new RingMultisig(_publicKeysX, _publicKeysY, _juryThreshold, hash(_judgmentMatter)), // todo proxy
                deadline,
                now,
                msg.sender
            );

        judgmentsIndexes.push( hash(_judgmentMatter) );
    }

    /**
     * Jury "vote" by this method. `ringMultisigned` checks signature correctness and
     * runs method after threshold reached
     */
    function guilty(bytes32 _judgmentsHash, uint256[2] _tagPoint, uint256[] ctlist)
        public
        beforeDeadline(_judgmentsHash)
        correctJudgmentHash(_judgmentsHash)
        ringMultisigned(
            judgments[_judgmentsHash ].ringMultisig,
            _tagPoint, ctlist
        )
    {
        judgments[ _judgmentsHash ].isGuilty = true;
    }


    /************************** INTERNAL **************************/


    function hash(string _str) internal pure returns (bytes32) {
        return keccak256(
            bytes(_str)
        );
    }
}
