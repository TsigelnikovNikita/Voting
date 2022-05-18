//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint32 constant public VOTE_DURATION = 3 days;

    uint8 constant public FEE = 10; // 10%

    // amount of vee that owner can withdraw
    uint availableFee;

    struct Candidate {
        address addr;
        uint32 amountOfVote;
    }

    struct Vote {
        Candidate[] candidates;
        string name;
        string description;
        uint pool;
        uint64 endOfVote;
        bool isEnded;
        // mapping(address => bool) alreadyVoted;
    }

    Vote[] public votes;

    function createVote(
        string calldata voteName,
        string calldata description,
        address[] calldata candidateAddrs
        )
        external
        onlyOwner
    {
        require(candidateAddrs.length >= 2, "Voting: amount of candidates must be at least 2");
        Vote storage vote = votes.push();

        vote.name = voteName;
        vote.description = description;
        vote.endOfVote = uint64(block.timestamp + VOTE_DURATION);

        for (uint i = 0; i < candidateAddrs.length; i++) {
            vote.candidates.push(Candidate({
                addr: candidateAddrs[i],
                amountOfVote: 0
            }));
        }
    }

    function getVote(uint voteID)
        external
        view
        returns(
            Candidate[] memory candidates,
            string memory name,
            uint pool,
            uint64 endOfVote,
            bool isEnded) {
        Vote storage vote = votes[voteID];
        return (vote.candidates, vote.name, vote.pool, vote.endOfVote, vote.isEnded);
    }
}
