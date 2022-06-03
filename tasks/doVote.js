require("dotenv").config();

task("doVote", "Allow to vote for a voting participant")
    .addParam("voteId", "ID of the vote.")
    .addParam("candidate", "address of the candidate.")
    .setAction(async (taskArgs) => {
        const options = {
            value: ethers.utils.parseEther("0.01")
        };

        const VotingFactory = await ethers.getContractFactory("Voting");
        const voting = await VotingFactory.attach(process.env.CONTRACT_ADDRESS);

        await voting.doVote(taskArgs.voteId, taskArgs.candidate, options)
            .then(() => {
                console.log(`Your vote is accepted!`);
            }, (error) => {
                console.log(error.message)
            });
    });
