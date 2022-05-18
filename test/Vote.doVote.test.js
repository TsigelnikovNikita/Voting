const {ethers} = require("hardhat");
const {expect} = require("chai");

require("chai").use(require('chai-as-promised'));

const VOTE_DURATION = 259200; // 3 days
async function getBlockTimestamp(bn) {
    return (
        await ethers.provider.getBlock(bn)
    ).timestamp;
}

describe("Vote.doVote", () => {
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

        await voting.connect(votingOwner).createVote("VoteName", "voteDescription", candidates);
    });

    describe("Vote.doVoteByID", () => {
        it("doVoteByID() should throw an exception if voteID is incorrect", async () => {
            await expect(voting.doVoteByID(1, 1, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote with such ID doesn't exists");
            });
        });

        it("doVoteByID() should throw an exception if candiateID is incorrect", async () => {
            await expect(voting.doVoteByID(0, 12, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: candidate with such ID doesn't exists");
            });
        });

        it("doVoteByID() should throw an exception if voting fee is not enough", async () => {
            await expect(voting.doVoteByID(0, 1, {value: ethers.utils.parseEther("0.001")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting fee isn't enough");
            });
        });

        it("doVoteByID() should throw an exception if voting time is over", async () => {
            const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);

            await expect(voting.doVoteByID(0, 1, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting time is over");
            });
        });
        
        it("doVoteByID() should throw an exception if participant has already voted", async () => {
            await voting.doVoteByID(0, 1, {value: ethers.utils.parseEther("0.01")});

            await expect(voting.doVoteByID(0, 1, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: you already has voted");
            });
        });
    });

    describe("Vote.doVoteByAddress", () => {
        const candidate = candidates[0];

        it("doVoteByAddress() should throw an exception if voteID is incorrect", async () => {
            await expect(voting.doVoteByAddress(1, candidate, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: vote with such ID doesn't exists");
            });
        });

        it("doVoteByAddress() should throw an exception if candidateAddr is incorrect", async () => {
            await expect(voting.doVoteByAddress(0, ethers.constants.AddressZero, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: candidate with such address doesn't exists");
            });
        });

        it("doVoteByAddress() should throw an exception if voting fee is not enough", async () => {
            await expect(voting.doVoteByAddress(0, candidate, {value: ethers.utils.parseEther("0.001")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting fee isn't enough");
            });
        });

        it("doVoteByAddress() should throw an exception if voting time is over", async () => {
            const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + VOTE_DURATION + 1]);

            await expect(voting.doVoteByAddress(0, candidate, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: voting time is over");
            });
        });

        it("doVoteByAddress() should throw an exception if participant has already voted", async () => {
            await voting.doVoteByAddress(0, candidate, {value: ethers.utils.parseEther("0.01")});

            await expect(voting.doVoteByAddress(0, candidate, {value: ethers.utils.parseEther("0.01")}))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: you already has voted");
            });
        });
    });
});
