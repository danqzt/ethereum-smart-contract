pragma solidity >= 0.6.0;

import "./ConvertLib.sol";

contract CrowdFunding{

    enum State {Ongoing,Failed, Succeeded, PaidOut}

    event CampaignFinish(
       address addr,
       uint totalCollected,
       bool succeeded
    );

    string name;
    uint targetAmount;
    uint fundingDeadline;
    address payable beneficiary;
    State public state;

    mapping(address => uint) amounts;
    bool collected;
    uint totalCollected;

    modifier inState(State expectedState){
        require(state == expectedState, "Inavlid state");
        _;
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function getTargetAmount() public view returns(uint){
        return targetAmount;
    }

    function getFundingDeadline() public view returns(uint){
        return fundingDeadline;
    }

    function getState() public view returns(State){
        return state;
    }

    function getContribAmt(address addr) public view returns(uint){
        return amounts[addr];
    }

    function getBeneficiary() public view returns(address){
        return beneficiary;
    }

    constructor(
        string memory _name,
        uint _targetAmountEth,
        uint _durationInMin,
        address _beneficiary
    ) public {

        name = _name;
        targetAmount = ConvertLib.etherToWei(_targetAmountEth);
        fundingDeadline = currentTime() + ConvertLib.minutesToSeconds(_durationInMin);
        beneficiary = payable(_beneficiary);
        state = State.Ongoing;
    }

    function currentTime() virtual internal view returns(uint){
        return block.timestamp;
    }

    function contribute() public payable inState(State.Ongoing){
        require(beforeDeadline(), "Overdue");
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;

        if(totalCollected >= targetAmount){
            collected = true;
        }
    }
    
    function finishCrowdFunding() public inState(State.Ongoing){
        require(!beforeDeadline(), "Cannot finish before deadline");
        if(!collected){
            state = State.Failed;
        }else{
            state = State.Succeeded;
        }

        emit CampaignFinish(address(this), totalCollected, collected);
    }
    function beforeDeadline() public view returns(bool){
         return currentTime() < fundingDeadline;
    }

    function collect() public inState(State.Succeeded){
        if(beneficiary.send(totalCollected)){
            state = State.PaidOut;
        }else{
            state = State.Failed;
        }

    }

    function withdraw() public inState(State.Failed){
        require(amounts[msg.sender] > 0, "Nothing contributed");
        uint contribution = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if(!(payable(msg.sender)).send(contribution)){
            amounts[msg.sender] = contribution;
        }
    }
}