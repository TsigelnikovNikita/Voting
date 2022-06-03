require("dotenv").config();

task("createVote", "Allow to create new vote. Only owner can create the vote")
    .addParam("voteName", "The name of your vote. Cannot be an empty.")
    .addOptionalParam("voteDescription", "The description of your vote.")
    .addParam("candidates", "List of addresses of voting candidates. " +
        "You need to pass at least two address. Also you need to pass addresses separated by space in the quotes. " +
        "Addresses of candidates must be unique")
    .setAction(async (taskArgs) => {
        const VotingFactory = await ethers.getContractFactory("Voting");
        const voting = await VotingFactory.attach(process.env.CONTRACT_ADDRESS);

        const addreses = taskArgs.participants.split(' ');
        await voting.createVote(taskArgs.voteName, "", addreses)
            .then(async () => {
                const eventFilter = voting.filters.VoteIsCreated();
                const event = (await voting.queryFilter(eventFilter)).pop();
                console.log(`Vote with '${event.args.voteName}' name and ${event.args.voteID} ID was successfully created`);
            }, (error) => {
                console.log(error.message)
            });
    });
