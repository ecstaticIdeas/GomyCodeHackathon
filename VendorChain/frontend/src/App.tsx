import { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { BlockchainService } from './services/BlockChainService';
import Login from './pages/Login';      // The new Landing Page
import Dashboard from './Dashboard';    // The new Dashboard File

function AppRoutes() {
  const { account, signer, connectWallet, isConnected } = useWeb3();
  const [role, setRole] = useState<"loading" | "guest" | "customer" | "vendor" | "organizer">("guest");

  useEffect(() => {
    if (isConnected && signer && account) {
      checkUserRole();
    }
  }, [isConnected, signer, account]);

  const checkUserRole = async () => {
    if (!signer || !account) return;
    setRole("loading");
      try {
      const service = new BlockchainService(signer);
      
      // 1. Check Owner (Organizer)
      const owner = await service.getOwner();
      if (owner.toLowerCase() === account.toLowerCase()) {
        setRole("organizer");
        return;
      }

      // 2. Check Vendor
      const isVendor = await service.isVendor(account);
      if (isVendor) {
        setRole("vendor");
        return;
      }

      // 3. Default to Customer
      setRole("customer");
    } catch (error) {
      console.error("Role check failed:", error);
      setRole("customer");
    }
  };

  // === THIS IS THE SWITCH ===
  
  // 1. Not Connected? -> Show Login Page
  if (!isConnected) {
    return <Login connectWallet={connectWallet} />;
  }

  // 2. Loading Role? -> Show Spinner
  if (role === "loading") {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // 3. Connected? -> Show Dashboard with specific Role
  return <Dashboard currentRole={role} />;
}

export default function App() {
  return (
    <Web3Provider>
      <AppRoutes />
    </Web3Provider>
  );
}