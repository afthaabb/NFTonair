"use client"
import React, { useState, useEffect } from "react";

const NFTLiveAuctionPlatform: React.FC = () => {
  const [isUserView, setIsUserView] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);

  // Handle View Switching
  const toggleView = () => {
    setIsUserView(!isUserView);
  };

  // Handle Wallet Connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (error) {
        console.error("User rejected connection:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Handle Go Live Toggle
  const toggleLiveStream = () => {
    setIsLive(!isLive);
  };

  // Update Viewer Count when Live
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isLive) {
      intervalId = setInterval(() => {
        setViewerCount(Math.floor(Math.random() * 100));
      }, 5000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isLive]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="p-4 glassmorphism fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">NFTonair</h1>
          <div className="flex gap-4">
            <button
              onClick={connectWallet}
              className={`px-4 py-2 rounded-lg transition ${
                walletConnected
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {walletConnected ? "Connected" : "Connect Wallet"}
            </button>
            <button
              onClick={toggleView}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {isUserView ? "Switch to Artist View" : "Switch to User View"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 container mx-auto p-4">
        {isUserView ? (
          // User View
          <div className="grid md:grid-cols-2 gap-6">
            {/* Live Streams Section */}
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Live Auctions</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
                  <h3 className="font-bold">Artist: CryptoCreator</h3>
                  <p className="text-sm text-gray-600">Current Bid: 2.5 ETH</p>
                  <button
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                    disabled={!walletConnected}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>

            {/* Past Bids Section */}
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Your Bid History</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">NFT #1234</h3>
                      <p className="text-sm text-gray-600">Your Bid: 1.8 ETH</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Artist View
          <div className="grid md:grid-cols-2 gap-6">
            {/* Streaming Controls */}
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Stream Controls</h2>
              <button
                onClick={toggleLiveStream}
                className={`px-6 py-3 rounded-lg w-full mb-4 transition ${
                  isLive
                    ? "bg-gray-600 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isLive ? "End Stream" : "Go Live"}
              </button>
              <div className="space-y-2">
                <p>
                  Current Viewers: <span>{viewerCount}</span>
                </p>
                <p>Active Bids: <span>0</span></p>
              </div>
            </div>

            {/* Current Auction Details */}
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Current Auction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Starting Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border p-2"
                    placeholder="ETH Amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Duration</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border p-2"
                    placeholder="Minutes"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                  Start Auction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTLiveAuctionPlatform;
