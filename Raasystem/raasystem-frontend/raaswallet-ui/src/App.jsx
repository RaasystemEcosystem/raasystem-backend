import React from "react";
import WalletActions from "./components/WalletActions";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter flex flex-col items-center justify-center p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Raaswallet</h1>
        <p className="text-gray-400 max-w-md">
          Non-custodial crypto wallet for gold-backed Raaskoin, Raastoken, and seamless payments in the Raasystem ecosystem.
        </p>
      </header>
      <WalletActions />
      <footer className="mt-12 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Raasystem Team
      </footer>
    </div>
  );
}

export default App;


