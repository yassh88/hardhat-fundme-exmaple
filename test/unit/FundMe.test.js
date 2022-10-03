const { assert, expect } = require("chai")
const { deployments, ethers, network, getNamedAccounts } = require("hardhat")

describe("Fund Me", () => {
  let deployer
  let fundMe
  let MockV3Aggregator
  const sendValue = ethers.utils.parseEther("1")
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture("all")
    fundMe = await ethers.getContract("FundMe", deployer)
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })
  describe("Constractor", () => {
    it("check MockV3Aggregator address", async () => {
      const priceFeed = await fundMe.priceFeed()
      assert.equal(priceFeed, MockV3Aggregator.address)
    })
    it("check owner address", async () => {
      const deployerAddress = await fundMe.owner_adrs()
      assert.equal(deployerAddress, deployer)
    })
  })
  describe("Fund", () => {
    it("Fund Revert with msg", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "Value should be more then 1 Ether"
      )
    })
    it("Fund success", async () => {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.getFundByAddress(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })
    it("Fund success", async () => {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.getFundAddressByIndex(0)
      assert.equal(deployer, response)
    })
  })
  describe("Withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue })
    })
    it("Withdraw fail", async () => {
      const startBalance = await fundMe.provider.getBalance(fundMe.address)
      const startDeployerBalance = await fundMe.provider.getBalance(deployer)
      const tr = await fundMe.withdraw()
      const tRicpt = await tr.wait(1)
      const { gasUsed, effectiveGasPrice } = tRicpt
      gasCost = gasUsed.mul(effectiveGasPrice)
      const endstartBalance = await fundMe.provider.getBalance(fundMe.address)
      const endstartDeployerBalance = await fundMe.provider.getBalance(deployer)
      assert.equal(endstartBalance, 0)
      assert.equal(
        endstartDeployerBalance.add(gasCost).toString(),
        startBalance.add(startDeployerBalance).toString()
      )
    })
  })
})
