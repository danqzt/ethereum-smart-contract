const CrowdFunding = artifacts.require("TestCrowdFunding");

contract('CrowdFunding', (accounts) => {
    let contract;
    let creatorAddrs = accounts[0];
    let beneficiary = accounts[1];
    const ONE_ETH = 1000000000000000000;
    const ONGOING_STATE = '0';
    const FAILED_STATE = '1';
    const SUCCEEDED_STATE = '2';
    const PAIDOUT_STATE = '3';
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async () => {
        contract = await CrowdFunding.new('funding', 1, 10, beneficiary);
    })

    it('Initialize', async () => {
        let campaignName = await contract.getName();
        expect(campaignName).to.equal('funding');

        let targetAmount = await contract.getTargetAmount();
        expect(targetAmount.toString()).to.equal(ONE_ETH.toString());

        let fundingDeadline = await contract.getFundingDeadline();
        expect(fundingDeadline.toString()).to.equal('600');

        let state = await contract.getState();
        expect(state.toString()).to.equal(ONGOING_STATE);
    });

    it('fund contribute', async () => {
        await contract.contribute({
            value: ONE_ETH,
            from: creatorAddrs
        })

        let contributed = await contract.getContribAmt(creatorAddrs);
        expect(contributed.toString()).to.equal(ONE_ETH.toString());
    })

    it('cannot contribute after deadline', async () => {
        try{
           await contract.setCurrentTime(601);
           await contract.sendTransaction({
               value: ONE_ETH,
               from: creatorAddrs
           });
           expect.fail();
        }catch(error){
          expect(error.message).to.equal(ERROR_MSG);
        }
    })

    it('crowdfunding succeeded', async () => {
        await contract.contribute({
            value: ONE_ETH,
            from: creatorAddrs
        });
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.getState();
        expect(state.toString()).to.equal(SUCCEEDED_STATE);
    })

    it('crowdfunding fails', async () => {
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.getState();
        expect(state.toString()).to.equal(FAILED_STATE);
    })

    it('collected money paid out', async () => {
        await contract.contribute({
            value: ONE_ETH,
            from: creatorAddrs
        });
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let beneficiaryAddr = await contract.getBeneficiary();
        let initAmount = await web3.eth.getBalance(beneficiaryAddr);
        await contract.collect({from: creatorAddrs});

        let newBalance = await web3.eth.getBalance(beneficiaryAddr);
        expect((newBalance - initAmount).toString()).to.equal(ONE_ETH.toString());

        let state = await contract.getState();
        expect(state.toString()).to.equal(PAIDOUT_STATE);
    
    })
    it('withdraw fund', async () => {
        let initAmount = await web3.eth.getBalance(creatorAddrs);
        await contract.contribute({
            value: ONE_ETH - 354678,
            from: creatorAddrs
        });
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        await contract.withdraw({from: creatorAddrs});

        let newBalance = await web3.eth.getBalance(creatorAddrs);
        //expect(initAmount).to.equal(newBalance);

        let amt = await contract.getContribAmt(creatorAddrs);
        expect(amt.toString()).to.equal('0');
    
    })

    it('event emitted', async () => {
        //let watcher = contract.CampaignFinish();
        await contract.setCurrentTime(601);
        let watcher = await contract.finishCrowdFunding();
        
        let eventName = watcher.logs[0].event;
        let eventRes = watcher.logs[0].args;
        expect(Number.parseInt(eventRes.totalCollected)).to.equal(0);
        expect(eventRes.succeeded).to.equal(false);
    })
});