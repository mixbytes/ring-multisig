pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../RingMultisigned.sol";
import "../RingMultisig.sol";


/**
 * Example of RingMultisig usage with one-time contract
 *
 */
contract Single is RingMultisig {

    constructor(
        string _judgmentMatter,
        uint256[] _publicKeysX,
        uint256[] _publicKeysY,
        uint256 _juryThreshold,
        uint256 _deadline
    )
        public
        RingMultisig(_publicKeysX, _publicKeysY, _juryThreshold, hash(_judgmentMatter))
    {
        judgmentMatter = _judgmentMatter;
        deadline = _deadline;
    }

    /************************** PROPERTIES **************************/

    bool public isGuilty;
    uint256 public deadline;
    string public judgmentMatter;

    /************************** MODIFIERS **************************/

    modifier beforeDeadline() {
        require(deadline > now);
        _;
    }

    /************************** EXTERNAL **************************/

    function getJudgment()
        external
        view
        returns (
            string _judgmentMatter,
            uint256[] _publicKeysX,
            uint256[] _publicKeysY,
            uint256 _juryThreshold,
            bool _isGuilty,
            uint256 _alreadyMadeDecisions,
            bytes32 _message //unique hash used to create ring signature
        )
    {
        _judgmentMatter = judgmentMatter;

        _publicKeysX = new uint256[](getPublicKeysCount());
        _publicKeysY = new uint256[](getPublicKeysCount());
        for (uint i=0; i<_publicKeysX.length; i++) {
            (_publicKeysX[i], _publicKeysY[i]) = getPublicKey(i);
        }
        _juryThreshold = threshold;
        _isGuilty = isGuilty;
        _alreadyMadeDecisions = getTagsCount();
        _message = getMessage();
    }

    /************************** PUBLIC **************************/

    /**
     * Jury "vote" by this method. `ringMultisigned` checks signature correctness and
     * runs method after threshold reached
     */
    function guilty(uint256[2] _tagPoint, uint256[] ctlist)
        public
        beforeDeadline()
        ringMultisigned(
            _tagPoint, ctlist
        )
    {
        isGuilty = true;
    }


    /************************** INTERNAL **************************/


    function hash(string _str) internal pure returns (bytes32) {
        return keccak256(
            bytes(_str)
        );
    }
}
