const {ethers} = require("hardhat");
const {expect} = require("chai");
const { BigNumber } = require("ethers");

require("chai").use(require('chai-as-promised'));

const VOTE_DURATION = 259200; // 3 days

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

describe("Vote.endVote", () => {
    const votingFee = ethers.utils.parseEther("0.01");
    let votingOwner;
    let voting;
    let participant;
    let candidates = ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
                    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
                    "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
                    "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
                    "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                    "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
                    "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"];

    beforeEach(async () => {
        [votingOwner, participant] = await ethers.getSigners();

        const VotingFactory = await ethers.getContractFactory("Voting", votingOwner);
        voting = await VotingFactory.deploy();
        await voting.deployed();

        await voting.connect(votingOwner).createVote("VoteName", "voteDescription", candidates);
    });

    it("Should throw an exception if vote doesn't exists", async () => {
        await expect(voting.endVote(1))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote with such ID doesn't exists");
            });
    });

    it("Should throw an exception if vote is not ended yet", async () => {
        await expect(voting.endVote(0))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote is still in the proccessing");
            });
    });

    it("Should throw an exception vote is already was ended", async () => {
        await voting.connect(participant).doVote(0, candidates[0], {value: votingFee});

        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);

        await voting.endVote(0);

        await expect(voting.endVote(0))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote is already ended");
            });
    });

    it("Should emit an event about vote is Ended", async () => {
        await voting.connect(participant).doVote(0, candidates[0], {value: votingFee});

        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);


        await expect(voting.endVote(0))
            .emit(voting, "VoteIsEnded")
            .withArgs(0, candidates[0], votingFee.mul(90).div(100));
    });

    it("Should transfer 90% of the winning to the winner and saves 10% of the winning", async () => {
        const candidateSigner = await ethers.getSigner(candidates[0]);
        const expectedWinning = votingFee.mul(90).div(100);
        await voting.connect(participant).doVote(0, candidates[0], {value: votingFee});

        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);

        await expect(await voting.endVote(0))
            .to.changeEtherBalances([voting, candidateSigner], [expectedWinning.mul(-1), expectedWinning]);
    });
});
