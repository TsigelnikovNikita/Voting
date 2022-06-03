require("dotenv").config();

task("endVote", "Allow to end the vote. You can finish vote only after three days since starting")
    .addParam("voteId", "ID of the vote.")
    .setAction(async (taskArgs) => {
        const VotingFactory = await ethers.getContractFactory("Voting");
        const voting = await VotingFactory.attach(process.env.CONTRACT_ADDRESS);

        await voting.endVote(taskArgs.voteId)
            .then(async () => {
                const eventFilter = voting.filters.VoteIsEnded();
                const event = (await voting.queryFilter(eventFilter)).pop();
                console.log(
`Vote with ${event.args.voteName} name and ${event.args.voteID} ID was successfully ended.
"The winner is ${event.args.winner.addr} with ${event.args.winning} winning`);
            }, (error) => {
                console.log(error.message)
            });
    });
