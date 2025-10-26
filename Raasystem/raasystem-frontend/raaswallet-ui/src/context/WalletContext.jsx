// src/context/WalletContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

const TOKEN_ADDRESSES = {
  RAAS: "xdc7e88Fb6dC8E1Df1099e92a806cEfC58f5F466993",  // Raaskoin
  RAAK: "xdc55CDF6069393F76E42323C046baEF62a818EF6d1",  // Raastoken
  USDT_XDC: "", // Add USDT-XDC address when available
};

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [balances, setBalances] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or XDC Wallet!");
      return;
    }
    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      const signer = await ethProvider.getSigner();
      const addr = await signer.getAddress();

      setProvider(ethProvider);
      setAddress(addr);
      setIsConnected(true);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  const fetchBalances = async () => {
    if (!provider || !address) return;

    const newBalances = {};
    for (const [token, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
      if (!tokenAddress) continue;
      try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const rawBalance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        newBalances[token] = Number(ethers.formatUnits(rawBalance, decimals));
      } catch (err) {
        console.error(`Error fetching ${token} balance:`, err);
      }
    }
    setBalances(newBalances);
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
    }
  }, [provider, address, isConnected]);

  return (
    <WalletContext.Provider value={{ connectWallet, address, balances, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
