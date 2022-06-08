# Voting Smart Contract

### Description of smart contract
This smart contract is designed for votes creating with a candidates list
(addresses of candidates actually). Everyone can vote for candidate of
voting sending 0.01 ether to the pool of vote. The winner of voting takes out
the pool of vote except fee of vote creator then the vote will end.

### Stack
The smart contract is written using Solidity for the Ethereum blockchain. 
I used to [hardhat](https://hardhat.org/) as a development environment framework.

### How to install
- First you need to clone this repo to your machine:<br>
  ```git clone https://github.com/TsigelnikovNikita/votingSmartContract.git```
- Then you need to install all requirements from package.json:<br>
   ```npm install```
- After that you need to check that you have an installed hardhat framework:<br>
  ```npx hardhat```
- The last one is just compiling the contract!:<br>
  ```npx hardhat compile ```

If you have got ```Compiled 5 Solidity files successfully``` output that's
mean that everything is okay, and you can use Voting Smart Contract! 

### Unit-tests
This contract has a lot of unit-test with 100% coverage. You can run these using:<br>
```npx hardhat test```

Also, you may want to check coverage. You can do it using:<br>
```npx hardhat coverage```

This command will print the result in the standard output. You also may check
it using coverage/index.html file.

### How to deploy it
If you want to deploy the smart-contract to:
- the built-in hardhat network: you don't need to add anything.
- the rinkeby network: you need to add two variables to the .env file:<br>
```SIGNER_PRIVATE_KEY=<YOUR_SIGNER_PRIVATE_KEY>```<br>
```RINKEBY_NETWORK_URI=<RINKEBY_NETWORK_URI>```<br>
- the another network: you need to add SIGNER_PRIVATE_KEY and this network uri
as variable to the .env file:<br>
```<YOUR_NETWORK>_NETWORK_URI=<URI_OF_YOUR_NETWORK>```<br>
And then add the new network to the hardhat.config.js file.

So after that you can deploy contract use scripts/deploy.js script. Run this
command:<br>
```npx hardhat run scripts/deploy.js --network <NETWORK_NAME>```<br>
Where NETWORK_NAME its name of your network.<br>
Again: you may don't add --network parameter if you want to use built-in hardhat
network.

If you have such output:<br>
```Voting deployed to: <CONTRACT_ADDRESS>```<br>
that's mean that everything is okay, and you can use the contract!

Last thing that you need to do is add CONTRACT_ADDRESS form the previous output
to the .env file:<br>
```CONTRACT_ADDRESS=<CONTRACT_ADDRESS>```

###How to use it
If you execute such command:<br>
```npx hardhat```<br>
You can find five additional tasks in the list:
- createVote
- doVote
- endVote
- withdrawAvailableFee
- getVote

You can find additional information about all of these tasks using:<br>
```npx hardhat <TASK_ANAME> help```

### Proposal and remarks
It's just a study work. If you have any proposals or remarks please feel free
and let me know about it.
