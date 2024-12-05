// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LiveNFTAuction {
    struct Auction {
        address artist;
        string name;
        uint256 highestBid;
        address highestBidder;
        bool isLive;
        uint256 minBidIncrement;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount;

    event AuctionStarted(uint256 auctionId, string name, address artist, uint256 minBidIncrement);
    event BidPlaced(uint256 auctionId, uint256 bid, address bidder);
    event AuctionFinalized(uint256 auctionId, address winner);

    modifier onlyArtist(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].artist, "Only the artist can perform this action");
        _;
    }

    modifier auctionIsLive(uint256 auctionId) {
        require(auctions[auctionId].isLive, "Auction is not live");
        _;
    }

    function startAuction(string memory name, uint256 minBidIncrement) public {
        auctionCount++;
        auctions[auctionCount] = Auction({
            artist: msg.sender,
            name: name,
            highestBid: 0,
            highestBidder: address(0),
            isLive: true,
            minBidIncrement: minBidIncrement
        });
        emit AuctionStarted(auctionCount, name, msg.sender, minBidIncrement);
    }

    function placeBid(uint256 auctionId) public payable auctionIsLive(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.value >= auction.highestBid + auction.minBidIncrement, "Bid too low");

        if (auction.highestBid > 0) {
            // Refund the previous highest bidder
            payable(auction.highestBidder).transfer(auction.highestBid);
        } 

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(auctionId, msg.value, msg.sender);
    }

    function finalizeAuction(uint256 auctionId) public onlyArtist(auctionId) auctionIsLive(auctionId) {
        Auction storage auction = auctions[auctionId];
        auction.isLive = false;

        // Transfer funds to the artist
        if (auction.highestBid > 0) {
            payable(auction.artist).transfer(auction.highestBid);
        }

        emit AuctionFinalized(auctionId, auction.highestBidder);
    }
}
