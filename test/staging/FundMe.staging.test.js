const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
console.log(
  "developmentChains.includes(network.name)",
  developmentChains.includes(network.name)
)
developmentChains.includes(network.name)
  ? describe.skip
  : describe("stagging testing", async () => {
      let fundMe
      let setEthValue
      beforeEach(async () => {
        const deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
        setEthValue = await ethers.utils.parseEther("1")
      })
      it("allow fund and withdraw", async () => {
        const fundTxResponse = await fundMe.fund({ value: setEthValue })
        await fundTxResponse.wait(1)
        const withdrawTxResponse = await fundMe.withdraw()
        await withdrawTxResponse.wait(1)
        const endBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endBalance.toString(), "0")
      })
    })
