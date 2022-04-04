pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";


contract MyNFTv2 is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => bool) private _hashes;



    function initialize(string memory _name, string memory _symbol) public initializer {
        __Ownable_init();
      __ERC721_init(_name, _symbol);
      __ERC721URIStorage_init();
    }

    function mintNFT(address recipient, string memory cid)
        public onlyOwner returns(uint256)
    {
        require(!contains("http", cid), "Invalid token Uri");
        require(!_hashes[cid], "cid own");

         _hashes[cid] = true;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, generateTokenUri(cid));

        return newItemId;
    }

    function generateTokenUri(string memory cid) internal pure returns (string memory){
        return string(abi.encodePacked("https://ipfs.io/ipfs/", cid));
    }

    function contains (string memory what, string memory where) pure internal returns (bool){
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);

        bool found = false;
        for (uint i = 0; i < whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; j++)
                if (whereBytes [i + j] != whatBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;
    }
}
