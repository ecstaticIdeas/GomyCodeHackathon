// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VendorTicket is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public immutable TICKET_PRICE;
    uint256 public immutable MAX_SUPPLY;

    event TicketMinted(address indexed recipient, uint256 tokenId);

    constructor(uint256 _price, uint256 _maxSupply) 
        ERC721("AfroFest2026", "AFRO") 
        Ownable(msg.sender) 
    {
        TICKET_PRICE = _price;
        MAX_SUPPLY = _maxSupply;
    }

    function mintTicket(string memory uri) external payable nonReentrant {
        require(msg.value >= TICKET_PRICE, "Insufficient Funds");
        require(_nextTokenId < MAX_SUPPLY, "Sold Out");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit TicketMinted(msg.sender, tokenId);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}
