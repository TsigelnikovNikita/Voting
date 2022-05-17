//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint32 constant public VOTE_DURATION = 3 days;

    // fee of every vote that owner 
    uint8 constact public FEE = 10; // 10%

    // amount of vee that owner can withdraw
    uint availableFee;

    struct Candidate {
        address addr;
        uint32 amountOfVote;
    }

    struct Vote {
        Candidate[] candidates;
        string name;
        uint pool;
        uint64 endOfVote;
        bool isEnded;
        mapping (address => bool) alreadyVoted;
    }

    Vote[] public votes;
}
