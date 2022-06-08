const {ethers} = require("hardhat");
const {expect} = require("chai");
const { BigNumber } = require("ethers");

require("chai").use(require('chai-as-promised'));

const VOTE_DURATION = 259200; // 3 days

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

describe("Vote.doVote", () => {
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

    it("Should throw an exception if voteID is incorrect", async () => {
        await expect(voting.doVote(1, candidates[0], {value: votingFee}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote with such ID doesn't exists");
            });
    });

    it("Should throw an exception if candiateID is incorrect", async () => {
        await expect(voting.doVote(0, ethers.constants.AddressZero, {value: votingFee}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: candidate with such address doesn't exists");
            });
    });

    it("Should throw an exception if voting fee isn't equal to 0.01", async () => {
        await expect(voting.doVote(0, candidates[0], {value: ethers.utils.parseEther("0.001")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting fee must be equal to 0.01 ether");
            });

        await expect(voting.doVote(0, candidates[0], {value: ethers.utils.parseEther("0.11")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting fee must be equal to 0.01 ether");
            });
    });

    it("Should throw an exception if voting time is over", async () => {
        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);

        await expect(voting.doVote(0, candidates[0], {value: votingFee}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting time is over");
            });
    });

    it("Should throw an exception if participant has already voted", async () => {
        await voting.doVote(0, candidates[0], {value: votingFee});

        await expect(voting.doVote(0, candidates[0], {value: votingFee}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: you already has voted");
            });
    });

    it("Should transfer voting fee from participant to Voting smart-contract", async () => {
        const tx = await voting.connect(participant).doVote(0, candidates[0], {value: votingFee});
        await expect(tx)
            .to.changeEtherBalances([participant, voting], [votingFee.mul(-1), votingFee]);
    });

    it("Should work correctly", async () => {
        const testCasesAmount = 10;

        // we need list of participants because we aren't able to vote from one address twice
        const participants = (await ethers.getSigners()).slice(5, 5 + testCasesAmount);
        let expectedVotingResult = new Array(candidates.length).fill(0);

        for (const participant of participants) {
            const candiateID = getRandInt(0, candidates.length);
            await voting.connect(participant).doVote(0, candidates[candiateID], {value: votingFee});
            expectedVotingResult[candiateID]++;
        }

        const vote = await voting.getVote(0);

        expect(vote.pool).to.eq(votingFee.mul(testCasesAmount));

        // checking that votes were recorded currectly
        for(let i = 0; i < vote.candidates.length; i++) {
            expect(vote.candidates[i].voteOf).to.eq(expectedVotingResult[i]);
        }

        // checking that participants were recorded currectly
        for(let i = 0; i < vote.participants.length; i++) {
            expect(vote.participants[i]).to.eq(participants[i].address);
        }
    });
});
