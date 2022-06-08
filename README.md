# Voting Smart Contract

### Description of smart contract
This smart contract is designed for votes creating with a candidates list
(addresses of candidates actually). Everyone can vote for participant of
voting sending at least 0.01 ether in the pool of vote. The winner of
voting takes out the pool of vote except fee of vote creator then the vote
will end.

### Stack
The smart contract is written using Solidity for the Ethereum blockchain. 
I used to [hardhat](https://hardhat.org/) as a development environment framework.

### How to install
- First you need to clone this repo to your machine:<br>
  ```git clone https://github.com/TsigelnikovNikita/votingSmartContract.git```
- Then you need to install all requirements from package.json:<br>
   ```npm install```
- Also, you need to define at least one environment variable in the .env file:<br>
  ```SIGNER_PRIVATE_KEY=<your private key>```
- After that you need to check that you have an installed hardhat framework:<br>
  ```npx hardhat```
- The last one is just compiling the contract!:<br>
  ```npx hardhat compile ```

If you have got ```Compiled 5 Solidity files successfully``` output that's mean that everything is okay, and you can use Vote
Smart Contract! 

### Unit-tests
This contract has a lot of unit-test with 100% coverage. You can run these using:<br>
```npx hardhat test```

Also, you may want to check coverage. You can do it using:<br>
```npx hardhat coverage```

This command will print the result in the standard output. You also may check it using coverage/index.html file.

### How to deploy it
If you don't want to use a built-in hardhat network you need to add another one environment variable to the .env
file:<br>
```<YOUR_NETWORK>_NETWORK_URI=<URI_OF_YOUR_NETWORK>```<br>
where YOUR_NETWORK is a network name (i.e. ganache or rinkeby).

hardhat.config.js have configuration for two networks: __Ganache__ and __Rinkeby__. If you want to add some another one
please feel free.

So after that you may deploy contract use scripts/deploy.js script. Run this command:<br>
```npx hardhat run scripts/deploy.js --network <NETWORK_NAME>```<br>
Again: you may don't add --network parameter if you want to use built-in hardhat network.

If you have such output:<br>
```Voting deployed to: <CONTRACT_ADDRESS>```<br>
that's mean that everything is okay, and you can use the contract!

Last thing that you need to do is add CONTRACT_ADDRESS form the previous output to the .env file:<br>
```CONTRACT_ADDRESS=<CONTRACT_ADDRESS>```

###How to use it
If you execute such command:<br>
```npx hardhat```<br>
You can find six additional tasks in the list:
- createVote
- doVote
- endVote
- getAvailableFee
- getFee
- getVoteInfo

You can find additional information about all of this tasks using:<br>
```npx hardhat <TASK_ANAME> help```

### Proposal and remarks
It's just a study work. If you have any proposals or remarks please feel free and let me know about it.
