require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
const RCP_PRIVATE_KEY = `0x${process.env.RCP_PRIVATE_KEY}`
const RCP_GOERLI_URL = process.env.RCP_GOERLI_URL
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: RCP_GOERLI_URL,
      accounts: [RCP_PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    }
  },
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }]
  }
}
