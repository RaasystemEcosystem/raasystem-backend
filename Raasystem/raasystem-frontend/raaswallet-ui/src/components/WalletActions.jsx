import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";

function WalletActions() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        setError("User denied wallet connection");
      }
    } else if (window.xdc) {
      try {
        const accounts = await window.xdc.request({ method: "xdc_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        setError("User denied wallet connection");
      }
    } else {
      setError("No compatible wallet found. Please install MetaMask or XDCPay.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-xl font-semibold mb-4">Raaswallet</h2>
      {walletAddress ? (
        <>
          <p>Your Wallet Address:</p>
          <p className="break-all my-2 font-mono text-sm">{walletAddress}</p>
          <div className="flex justify-center mt-4">
            <QRCode value={walletAddress} size={128} />
          </div>
        </>
      ) : (
        <>
          <p>No wallet connected.</p>
          <button
            onClick={connectWallet}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold"
          >
            Connect Wallet
          </button>
          {error && <p className="mt-3 text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}

export default WalletActions;

