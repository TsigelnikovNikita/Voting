require("dotenv").config();

task("withdrawAvailableFee", "Allow to withdraw passed amount of available fee.")
    .addOptionalParam("amount", "Amount of fee that you want to withdraw. If not set, will be withrdawed all available fee")
    .setAction(async () => {
        const VotingFactory = await ethers.getContractFactory("Voting");
        const voting = await VotingFactory.attach(process.env.CONTRACT_ADDRESS);

        await voting.withddrawAvailableFee()
            .then((result) => {
                console.log(`You have successfuly withdrew fee!`)
            }, (error) => {
                console.log(error.message)
            });
    });
