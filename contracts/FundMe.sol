// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./PriceConvert.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract FundMe {
  using PriceConvert for uint256;
  uint256 public constant MINIMUM_USD = 50 * 10**18;

  address public immutable owner_adrs;

  AggregatorV3Interface public immutable priceFeed;

  address[] private funder;
  mapping(address => uint256) private funderMap;

  modifier onlyOwner() {
    require(owner_adrs == msg.sender, "only owner can withdraw");
    _;
  }

  constructor(address _priceFeed) {
    owner_adrs = msg.sender;
    priceFeed = AggregatorV3Interface(_priceFeed);
  }

  function fund() public payable {
    console.log("msg.sender-----", msg.sender);
    require(
      msg.value.getConversion(priceFeed) >= MINIMUM_USD,
      "Value should be more then 1 Ether"
    );
    funder.push(msg.sender);
    funderMap[msg.sender] += msg.value;
  }

  function getFundByAddress(address fAddress) public view returns (uint256) {
    return funderMap[fAddress];
  }

  function getFundAddressByIndex(uint256 index) public view returns (address) {
    return funder[index];
  }

  function withdraw() public onlyOwner {
    for (uint256 i = 0; i < funder.length; i++) {
      funderMap[funder[i]] = 0;
    }
    funder = new address[](0);
    // payable(msg.sender).transfer(address(this).balance);
    bool result = payable(msg.sender).send(address(this).balance);
    require(result, "send fail");
    (bool resultCal, ) = payable(msg.sender).call{value: address(this).balance}(
      ""
    );
    require(resultCal, "send fail");
  }
}
