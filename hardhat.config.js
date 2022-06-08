require("@nomiclabs/hardhat-waffle");
require('hardhat-dependency-compiler');
require("hardhat-gas-reporter");
require('solidity-coverage');
require('hardhat-storage-layout');

require('./tasks/createVote');
require('./tasks/doVote');
require('./tasks/endVote');
require('./tasks/withdrawAvailableFee');
require('./tasks/getVote');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    rinkeby: {
      url: `${process.env.RINKEBY_NETWORK_URI}`,
      accounts: [`${process.env.SIGNER_PRIVATE_KEY}`]
    },
  },
  dependencyCompiler: {
    paths: [
      '@openzeppelin/contracts/access/Ownable.sol',
    ],
  }
};

// for case when user didn't define SIGNER_PRIVATE_KEY and RINKEBY_NETWORK_URI variables  
if (process.env.SIGNER_PRIVATE_KEY == undefined ||
    process.env.RINKEBY_NETWORK_URI == undefined) {
  delete module.exports.networks.rinkeby
}
