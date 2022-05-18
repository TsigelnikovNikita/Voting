const {ethers} = require("hardhat");
const {expect} = require("chai");

require("chai").use(require('chai-as-promised'));

describe("Vote.getter functions", () => {
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

    describe("Vote.getVote", () => {
        it("getVote() should throw an exception if vote with such ID doesn't exists", async () => {
            await expect(voting.getVote(1))
                .to.be.rejectedWith(Error)
                .then((error) => {
                    expect(error.message).to.contain('Voting: vote with such ID doesn\'t exists');
                });
        });
    });

    describe("Vote.getCandidateID", () => {
        it("getCandidateID() should throw an exception if vote with such ID doesn't exists", async () => {

            await expect(voting.getCandidateID(1, candidates[0]))
                .to.be.rejectedWith(Error)
                .then((error) => {
                    expect(error.message).to.contain('Voting: vote with such ID doesn\'t exists');
                });
        });

        it("getCandidateID() should throw an exception if candidate with such address doesn't exists", async () => {
            await voting.createVote("VoteName", "voteDescription", candidates);

            await expect(voting.getCandidateID(0, ethers.constants.AddressZero))
                .to.be.rejectedWith(Error)
                .then((error) => {
                    expect(error.message).to.contain('Voting: candidate with such address doesn\'t exists');
                });
        });
    });
})
