const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  let ethUSDPriceFeedAddress
  // const address = "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e"
  if (developmentChains.includes(network.name)) {
    let ethAggregator = await deployments.get("MockV3Aggregator")
    ethUSDPriceFeedAddress = ethAggregator.address
  } else {
    ethUSDPriceFeedAddress = networkConfig[chainId].ethUSDPriceFeed
  }
  const args = [ethUSDPriceFeedAddress]
  console.log("ethUSDPriceFeedAddress------", ethUSDPriceFeedAddress)
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
    await verify(fundMe.address, args)
  }
}
module.exports.tags = ["all", "FundMe"]
