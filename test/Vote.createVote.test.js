const {ethers} = require("hardhat");
const {expect} = require("chai");

require("chai").use(require('chai-as-promised'));

const VOTE_DURATION = 259200; // 3 days
async function getBlockTimestamp(bn) {
    return (
        await ethers.provider.getBlock(bn)
    ).timestamp;
}

describe("Vote.createVote", () => {
    let votingOwner;
    let voting;
    let participant;
    let candidates = ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
                    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
                    "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
                    "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
                    "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"];

    beforeEach(async () => {
        [votingOwner, participant] = await ethers.getSigners();

        const VotingFactory = await ethers.getContractFactory("Voting", votingOwner);
        voting = await VotingFactory.deploy();
        await voting.deployed();
    });

    it("Should throw an exception if not owner is trying to create a vote", async () => {
        await expect(voting.connect(participant).createVote("VoteName", "voteDescription", [ethers.constants.AddressZero]))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain('Ownable: caller is not the owner');
            });
    });

    it("Should throw an exception if amount of candidates less than 2", async () => {
        await expect(voting.connect(votingOwner).createVote("VoteName", "voteDescription", [ethers.constants.AddressZero]))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain('Voting: amount of candidates must be at least 2');
            });
    });

    it("Should throw an exception if voteName is empty", async () => {
        await expect(voting.connect(votingOwner).createVote("", "voteDescription", [ethers.constants.AddressZero, ethers.constants.AddressZero]))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain('Voting: voteName can\'t be an empty');
            });
    });

    it("Should throw an exception if voteDescription is empty", async () => {
        await expect(voting.connect(votingOwner).createVote("VoteName", "", [ethers.constants.AddressZero, ethers.constants.AddressZero]))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain('Voting: voteDescription can\'t be an empty');
            });
    });

    it("Should create votes correctly", async () => {
        const votesAmount = 5;

        for (j = 0; j < votesAmount; j++) {
            const voteName = "VoteName" + j;
            const voteDescription = "voteDescription" + j;

            const tx = await voting.createVote(voteName, voteDescription, candidates);
            const vote = await voting.getVote(j);

            await expect(tx)
                .to.emit(voting, "VoteIsCreated")
                .withArgs(j, voteName, await getBlockTimestamp(tx.blockNumber) + VOTE_DURATION);

            for (i = 0; i < candidates.length; i++) {
                expect(vote.candidates[i].addr).to.eq(candidates[i]);
                expect(vote.candidates[i].voteOf).to.eq(0);
            }

            expect(vote.participants).to.empty;
            expect(vote.name).to.eq(voteName);
            expect(vote.description).to.eq(voteDescription);
            expect(vote.pool).to.eq(0);
            expect(vote.endTime).to.eq(await getBlockTimestamp(tx.blockNumber) + VOTE_DURATION);
            expect(vote.isEnded).to.eq(false);
        }
    });
});
