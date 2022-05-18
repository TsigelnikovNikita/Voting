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
        uint32 voteOf;
    }

    struct Vote {
        address[] candidates;
        mapping (address => uint32) voteOf;
        string name;
        string description;
        uint pool;
        uint64 endTime;
        bool isEnded;
        mapping(address => bool) alreadyVoted;
    }

    Vote[] public votes;

    function createVote(
        string calldata voteName,
        string calldata voteDescription,
        address[] calldata candidateAddrs
        )
        external
        onlyOwner
    {
        require(candidateAddrs.length >= 2, "Voting: amount of candidates must be at least 2");
        require(bytes(voteName).length > 0, "Voting: voteName can't be an empty");
        require(bytes(voteDescription).length > 0, "Voting: voteDescription can't be an empty");
        Vote storage vote = votes.push();

        vote.name = voteName;
        vote.description = voteDescription;
        vote.endTime = uint64(block.timestamp + VOTE_DURATION);
        vote.candidates = candidateAddrs;
    }

    function getVote(uint voteID)
        external
        view
        returns(
            Candidate[] memory candidates,
            string memory name,
            string memory description,
            uint pool,
            uint64 endTime,
            bool isEnded) {
        Vote storage vote = votes[voteID];
        candidates = new Candidate[](vote.candidates.length);

        for (uint i = 0; i < vote.candidates.length; i++) {
            candidates[i] = Candidate({
                addr: vote.candidates[i],
                voteOf: vote.voteOf[vote.candidates[i]]
            });
        }

        return (candidates, vote.name, vote.description, vote.pool, vote.endTime, vote.isEnded);
    }
}
