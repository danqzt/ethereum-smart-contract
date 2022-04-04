
// Load compiled artifacts
const TutToken = artifacts.require('TutToken');

contract('TutToken', function ([ creator, other ]) {

    const NAME = 'TutToken';
    const SYMBOL = 'TUT';
    const TOTAL_SUPPLY = web3.utils.toBN('10000000000000000000000');
  
    beforeEach(async function () {
      this.token = await TutToken.new(NAME, SYMBOL, TOTAL_SUPPLY, { from: creator });
    });
  
    it('retrieve returns a value previously stored', async function () {
      // Use large integer comparisons
      expect((await this.token.totalSupply()).toString()).to.be.equal(TOTAL_SUPPLY.toString());
    });
  
    it('has a name', async function () {
      expect(await this.token.name()).to.be.equal(NAME);
    });
  
    it('has a symbol', async function () {
      expect(await this.token.symbol()).to.be.equal(SYMBOL);
    });
  
    it('assigns the initial total supply to the creator', async function () {
      expect((await this.token.balanceOf(creator)).toString()).to.be.equal(TOTAL_SUPPLY.toString());
    });
  });