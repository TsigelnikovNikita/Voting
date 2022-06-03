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
  dependencyCompiler: {
    paths: [
      '@openzeppelin/contracts/access/Ownable.sol',
    ],
  }
};
