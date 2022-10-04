// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./PriceConvert.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract FundMe {
  using PriceConvert for uint256;
  uint256 public constant MINIMUM_USD = 50 * 10**18;

  address private immutable s_owner_i;

  AggregatorV3Interface private immutable s_priceFeed;

  address[] private s_funder;
  mapping(address => uint256) private s_funderMap;

  modifier onlyOwner() {
    require(s_owner_i == msg.sender, "only owner can withdraw");
    _;
  }

  constructor(address _priceFeed) {
    s_owner_i = msg.sender;
    s_priceFeed = AggregatorV3Interface(_priceFeed);
  }

  function fund() public payable {
    console.log("msg.sender-----", msg.sender);
    require(
      msg.value.getConversion(s_priceFeed) >= MINIMUM_USD,
      "Value should be more then 1 Ether"
    );
    s_funder.push(msg.sender);
    s_funderMap[msg.sender] += msg.value;
  }

  function getFundByAddress(address fAddress) public view returns (uint256) {
    return s_funderMap[fAddress];
  }

  function getFundAddressByIndex(uint256 index) public view returns (address) {
    return s_funder[index];
  }

  function withdraw() public onlyOwner {
    for (uint256 i = 0; i < s_funder.length; i++) {
      s_funderMap[s_funder[i]] = 0;
    }
    s_funder = new address[](0);
    // payable(msg.sender).transfer(address(this).balance);
    bool result = payable(msg.sender).send(address(this).balance);
    require(result, "send fail");
    (bool resultCal, ) = payable(msg.sender).call{value: address(this).balance}(
      ""
    );
    require(resultCal, "send fail");
  }

  function chepWithdraw() public onlyOwner {
    address[] memory funders = s_funder;
    for (uint256 i = 0; i < funders.length; i++) {
      s_funderMap[funders[i]] = 0;
    }
    s_funder = new address[](0);
    // payable(msg.sender).transfer(address(this).balance);
    bool result = payable(msg.sender).send(address(this).balance);
    require(result, "send fail");
    (bool resultCal, ) = payable(msg.sender).call{value: address(this).balance}(
      ""
    );
    require(resultCal, "send fail");
  }

  function getVersion() public view returns (uint256) {
    return s_priceFeed.version();
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funder[index];
  }

  function getOwner() public view returns (address) {
    return s_owner_i;
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
