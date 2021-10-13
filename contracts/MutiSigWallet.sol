pragma solidity >= 0.6.0;
//pragma experimental ABIEncoderV2;

contract MultigWallet{
    uint minApprovers;
    address payable beneficiery;
    address payable owner;
    
    mapping (address => bool) approvedBy;
    mapping (address => bool) isApprover;
    uint approvalSum;
    
    constructor(
        address[] memory _approvers,
        uint _minApprovers,
        address _beneficiery) public payable {
            
            require(_minApprovers <= _approvers.length, "approver length not match");
            minApprovers = _minApprovers;
            beneficiery = payable(_beneficiery);
            owner = payable(msg.sender);
            for(uint i = 0; i < _approvers.length; i++){
                approvedBy[_approvers[i]] = false;
                isApprover[_approvers[i]] = true;
            }
    }
    
    function approve() public {
        require(isApprover[msg.sender], "Unauthorized");
        
        //check if the approver has approve
        if(!approvedBy[msg.sender]){
            approvedBy[msg.sender] = true;
            approvalSum++;
        }
        
        //send when number of approver is met
        if(approvalSum == minApprovers){
            beneficiery.send(address(this).balance);
            selfdestruct(owner);
        }
        
    }
    
    function reject() public {
        require(isApprover[msg.sender], "Unauthorized");
        selfdestruct(owner);
    }
}