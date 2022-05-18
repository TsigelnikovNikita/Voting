require("@nomiclabs/hardhat-waffle");
require('hardhat-dependency-compiler');
require("hardhat-gas-reporter");
require('solidity-coverage');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  dependencyCompiler: {
    paths: [
      '@openzeppelin/contracts/access/Ownable.sol',
    ],
  }
};
