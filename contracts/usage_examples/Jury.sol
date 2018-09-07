pragma solidity ^0.4.24;

contract Jury {
    constructor() public {

    }

    struct Judgment {
        string judgmentMatter;
        uint256 juryCount;
        uint256 juryThreshold;
        bool isGuilty;
    }

    Judgment[] judgments;
    mapping(bytes32=>uint) judgmentsIndex;


}
