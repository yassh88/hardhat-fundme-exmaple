// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvert {
  function getPrice(AggregatorV3Interface priceFeed)
    public
    view
    returns (uint256)
  {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price * 1e10);
  }

  function getVersion(AggregatorV3Interface priceFeed)
    public
    view
    returns (uint256)
  {
    return priceFeed.version();
  }

  function getConversion(uint256 ethAmout, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    return (ethAmout * getPrice(priceFeed)) / 1e18;
  }
}
