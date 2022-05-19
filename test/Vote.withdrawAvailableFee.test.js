const {ethers} = require("hardhat");
const {expect} = require("chai");
const { BigNumber } = require("ethers");

require("chai").use(require('chai-as-promised'));

const VOTE_DURATION = 259200; // 3 days

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

describe("Vote.withdrawAvailableFee", () => {
    const votingFee = ethers.utils.parseEther("0.01");
    let votingOwner;
    let voting;
    let participant;

    beforeEach(async () => {
        [votingOwner, participant] = await ethers.getSigners();

        const VotingFactory = await ethers.getContractFactory("Voting", votingOwner);
        voting = await VotingFactory.deploy();
        await voting.deployed();
    });

    it("Should throw an exception if availableFee is equal to zero", async () => {
        await expect(voting.connect(votingOwner).withdrawAvailableFee(0))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: you don't have such amount of available fee for withdraw");
            });
    });

    it("Should throw an exception if requested value is greater than availableFee", async () => {
        participant.sendTransaction({to: voting.address, value: votingFee});

        await expect(voting.connect(votingOwner).withdrawAvailableFee(votingFee.mul(2)))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Voting: you don't have such amount of available fee for withdraw");
            });
    });

    it("Should throw an exception if was called not by owner", async () => {
        participant.sendTransaction({to: voting.address, value: votingFee});

        await expect(voting.connect(participant).withdrawAvailableFee(votingFee.mul(2)))
            .to.be.rejectedWith(Error)
            .then((error) => {
                expect(error.message).to.contain("Ownable: caller is not the owner");
            });
    });
});
