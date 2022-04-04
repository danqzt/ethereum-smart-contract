
// Load compiled artifacts
const MyNFT = artifacts.require('MyNFTv2');
const { toBN } = web3.utils;

contract('MyNFT', (accounts) => {

    const NAME = 'DaqNFT';
    const SYMBOL = 'DFT';
    const owner = accounts[0];
    const dan = accounts[1];
    const cyn = accounts[2];
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert cid own -- Reason given: cid own.';

    beforeEach(async function () {
      this.token =  await MyNFT.new();
      await this.token.initialize("DaqNFT", "DFT", {from: owner});
    });
    
    it('has a name', async function () {
      expect(await this.token.name()).to.be.equal(NAME);
    });
  
    it('has a symbol', async function () {
      expect(await this.token.symbol()).to.be.equal(SYMBOL);
    });
  
    it('mint 1', async function () {
      let nft1 = "dan-nft1";
      await this.token.mintNFT(dan, nft1);
      const tokenUrl = await this.token.tokenURI(1);
      console.log("TOKEN URL: " + tokenUrl);
      expect(tokenUrl).to.equal(`https://ipfs.io/ipfs/${nft1}`);
      expect((await this.token.ownerOf(1))).to.equal(dan);
    });

    it('mint 2', async function () {
        let nft2 = "dan-nft2";
        await this.token.mintNFT(dan, `dan-nft1`);
        await this.token.mintNFT(dan, nft2);
        expect((await this.token.balanceOf(dan)).toString()).to.be.equal('2');
        expect((await this.token.ownerOf(2))).to.be.equal(dan);
      });

    it('transfer from', async function () {
      //const owner1 = await this.token.owner();
      //console.log(`contract owner:${owner1} and i want ownder ${owner} `);
      let nft2 = "dan-nft2";
      await this.token.mintNFT(dan, "dan-nft1");
      await this.token.mintNFT(dan, nft2);
      await this.token.approve(owner, 2, {from: dan});
      await this.token.transferFrom(dan,cyn,2);
      expect((await this.token.balanceOf(dan)).toString()).to.be.equal('1');
      expect((await this.token.ownerOf(2))).to.be.equal(cyn);
    });

    it('error cid own', async function () {
      try{

        const nft2 = "dan-nft2";
        await this.token.mintNFT(dan, "dan-nft1");
        await this.token.mintNFT(dan, nft2);
        await this.token.mintNFT(cyn, nft2);
        expect.fail();
      }catch(ex){
        expect(ex.message).to.equal(ERROR_MSG);
      }
    });

      it('calculate gas price', async function () {
        //initial balance
        const initial = toBN(await web3.eth.getBalance(owner));
        console.log(`Initial: ${initial.toString()}`);

        const nft1 = "dan-nft2";
        const receipt = await this.token.mintNFT(dan, nft1);
        const gasUsed = toBN(receipt.receipt.gasUsed);
        console.log(`GasUsed: ${receipt.receipt.gasUsed}`);

        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = toBN(tx.gasPrice);
        console.log(`GasPrice: ${tx.gasPrice}`);

        // Final balance
        const final = toBN(await web3.eth.getBalance(owner));
        console.log(`Final: ${final.toString()}`);
        assert.equal(final.add(gasPrice.mul(gasUsed)).toString(), initial.toString(), "Must be equal");
    });

    

  });