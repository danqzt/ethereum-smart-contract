// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

library ConvertLib{
	function convert(uint amount,uint conversionRate) public pure returns (uint convertedAmount)
	{
		return amount * conversionRate;
	}
	function etherToWei(uint sumInEth) public pure returns(uint){
		return sumInEth * 1 ether;
	}

	function minutesToSeconds(uint timeInMin) public pure returns(uint){
		return timeInMin * 1 minutes;
	}
}
