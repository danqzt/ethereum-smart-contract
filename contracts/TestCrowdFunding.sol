pragma solidity >=0.6.0;

import "./CrowdFunding.sol";

contract TestCrowdFunding is CrowdFunding {
    uint time;

    constructor(
        string memory _name,
        uint _targetAmountEth,
        uint _durationInMin,
        address _beneficiary
    ) CrowdFunding(_name, _targetAmountEth, _durationInMin, _beneficiary) public {
    }
    
    function currentTime() public view override returns(uint){
        return time;
    }

    function setCurrentTime(uint newTime) public {
        time = newTime;
    }

}