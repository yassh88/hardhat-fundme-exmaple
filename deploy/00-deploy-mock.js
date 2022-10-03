const { network } = require("hardhat")
const {
  developmentChains,
  DECIMALS,
  INITIAL_PRICE
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  if (developmentChains.includes(network.name)) {
    console.log("local networ deploying mock")
    const MockV3Aggregator = await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE]
    })
    console.log("mocking done")
    console.log("------------")
  }
  console.log("mocking deployment done")
  // const address = "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e"
}
module.exports.tags = ["all", "mocks"]
