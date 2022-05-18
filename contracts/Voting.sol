//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    // Voting fee of participant for vote
    uint constant public VOTING_FEE = 0.01 ether;

    // Duration of every vote is three days since vote creating
    uint32 constant public VOTE_DURATION = 3 days;

    // Fee from each vote pool that owner gets
    uint8 constant public FEE = 10; // 10%

    // Amount of available ether that owner can withdraw.
    // Owner gets fee from vote only at the end of vote.
    uint availableEtherForWithdraw;

    struct Candidate {
        address addr;
        uint32 voteOf;
    }

    struct Vote {
        Candidate[] candidates;
        mapping(address => uint) indexOfCandidates;
        string name;
        string description;
        uint pool;
        uint endTime;
        bool isEnded;
        address[] participants;
        mapping(address => bool) alreadyVoted;
    }

    Vote[] public votes;


    /*
        MODIFIERS
    */
    modifier voteIsExist(uint voteID) {
        require(voteID < votes.length, "Voting: vote with such ID doesn't exists");
        _;
    }


    /*
        EVENTS
    */

    /**
     * @dev Emitted when new vote is created by {createVote} function.
     */
    event VoteIsCreated(uint indexed voteID, string voteName, uint endTime);


    /*
        FUNCTIONS
    */

    /**
     * @dev Creates a new vote with `voteName` as name, `voteDeiscription` as
     * description and `candidateAddres` as list of candidates. end time of
     * vote is equal to the current timestamp plus three days. 
     *
     * Requirements:
     * - `voteName` and `voteDescription` can't be an empty;
     * - `candidateAddres` size must beat least 2;
     *
     * IMPORTANT: the function doesn't check uniqueness of the voteName and
     * candidate addresses. It allows to create two votes with the same voteName.
     * Also you must not to send the equal candidate addresses in one vote!
     * Keep it in mind. 
     *
     * Emit an {VoteIsCreated} event.
     */
    function createVote(
        string calldata voteName,
        string calldata voteDescription,
        address[] calldata candidateAddrs
        )
        external
        onlyOwner
    {
        require(candidateAddrs.length >= 2,
                "Voting: amount of candidates must be at least 2");
        require(bytes(voteName).length > 0,
                "Voting: voteName can't be an empty");
        require(bytes(voteDescription).length > 0,
                "Voting: voteDescription can't be an empty");

        Vote storage vote = votes.push();

        vote.name = voteName;
        vote.description = voteDescription;
        vote.endTime = block.timestamp + VOTE_DURATION;

        for (uint i = 0; i < candidateAddrs.length;) {
            address candidates = candidateAddrs[i];
            vote.candidates.push(Candidate(
                candidates, 0
            ));
            vote.indexOfCandidates[candidates] = i;
            unchecked { ++i; }
        }

        emit VoteIsCreated(votes.length - 1, voteName, vote.endTime);
    }

    /**
     * @dev Returns information about the vote by voteID.
     * The function returns:
     *  - list of candidates
     *  - name of vote
     *  - description of vote
     *  - current pool of vote
     *  - current end time of vote
     *  - status of vote (is ended or not)
     *
     * Requirements:
     * - vote with `voteID` should be exists;
     *
     */
    function getVote(uint voteID)
        external
        view
        voteIsExist(voteID)
        returns(
            Candidate[] memory candidates,
            address[] memory participants,
            string memory name,
            string memory description,
            uint pool,
            uint endTime,
            bool isEnded)
    {    
        Vote storage vote = votes[voteID];

        return (vote.candidates, vote.participants, vote.name,
                vote.description, vote.pool, vote.endTime, vote.isEnded);
    }

    /**
     * @dev Allows to participant to vote for candidate.
     *
     * Requirements:
     * - vote with `voteID` should be exists;
     * - candidate with `candidate` address should be exists;
     * - msg.value must be equal to {VOTING_FEE};
     * - vote should be an active;
     * - participant (msg.sender) can't vote twice;
     *
     */
    function doVote(uint voteID, address candidate)
        public
        payable
        voteIsExist(voteID)
    {
        require(msg.value == VOTING_FEE, "Voting: voting fee should be equal to 0.01 ether");

        Vote storage vote = votes[voteID];

        require(vote.endTime >= block.timestamp, "Voting: voting time is over");
        require(!vote.alreadyVoted[msg.sender], "Voting: you already has voted");
        uint candidateIndex = vote.indexOfCandidates[candidate];
        if (candidateIndex == 0) {
            require(vote.candidates[0].addr == candidate, "Voting: candidate with such address doesn't exists");
        }

        vote.pool += msg.value;
        ++vote.candidates[candidateIndex].voteOf;

        vote.alreadyVoted[msg.sender] = true;
        vote.participants.push(msg.sender);
    }
}
