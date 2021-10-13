pragma solidity >= 0.6.0;

contract CrowdFunding{

    enum State {Ongoing,Failed, Succeeded, PaidOut}

    string name;
    uint targetAmount;
    uint fundingDeadline;
    address public beneficiary;
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

    constructor(
        string memory _name,
        uint _targetAmountEth,
        uint _durationInMin,
        address _beneficiary
    ) public {

        name = _name;
        targetAmount = _targetAmountEth * 1 ether;
        fundingDeadline = currentTime() + _durationInMin * 1 minutes;
        beneficiary = _beneficiary;
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
    }
    function beforeDeadline() public view returns(bool){
         return currentTime() < fundingDeadline;
    }
}