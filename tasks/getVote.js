require("dotenv").config();

function candidatesToString(candidates) {
    let result = "";

    for (const candidate of candidates) {
        result +=
            "\taddress: " + candidate.addr +
            "\n\tamount of vote: " + candidate.voteOf + "\n";
    }
    return result.slice(0, -1);
}

function participantToString(participants) {
    let result = "";

    for (const participant of participants) {
        result +=
            "\taddress: " + participant.addr +
            "\n\tvote for: " + participant.voteFor + "\n";
    }
    return result.slice(0, -1);
}

task("getVote", "Allow to get info about vote")
    .addParam("voteId", "The ID of your vote")
    .setAction(async (taskArgs) => {
        const VotingFactory = await ethers.getContractFactory("Voting");
        const voting = await VotingFactory.attach(process.env.CONTRACT_ADDRESS);

        await voting.getVote(taskArgs.voteId)
            .then((result) => {
                const participants = participantToString(result.participants);
                const output = 
`Name: ${result.name}
Description: ${result.description ? result.description.length > 0 : "none"}
Pool: ${ethers.utils.formatEther(result.pool)} ether
End time of vote: ${new Date(result.endTime * 1000)}
Candidates:
${candidatesToString(result.candidates)}
Participants:
${participants ? participants.length > 0 : "\tnone"}`

                console.log(output);
            }, (error) => {
                console.log(error.message)
            });
    });
