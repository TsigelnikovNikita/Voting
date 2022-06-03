const hre = require("hardhat");

async function main() {
    const votingFactory = await hre.ethers.getContractFactory("Voting");
    await hre.storageLayout.export();

    const voting = await votingFactory.deploy();
    await voting.deployed();
    console.log("Voting deployed to:", voting.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});