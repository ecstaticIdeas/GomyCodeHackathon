import QRCode from "react-qr-code";
import { useState, useEffect } from 'react';
import { useWeb3 } from './context/Web3Context';
import { BlockchainService } from './services/BlockChainService';
import { Wallet, History, Ticket, QrCode, CheckCircle, CreditCard } from 'lucide-react';

// 1. Define the Props Interface
interface DashboardProps {
  currentRole: "loading" | "guest" | "customer" | "vendor" | "organizer";
}

// 2. Accept the props in the component
export default function Dashboard({ currentRole }: DashboardProps) { 
  const { account, signer, connectWallet, isConnected } = useWeb3();
  const [balance, setBalance] = useState("0.0");
  const [ticketCount, setTicketCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  
  // Form States
  const [payAmount, setPayAmount] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");

  useEffect(() => {
    if (signer && account) refreshData();
  }, [signer, account]);

  const refreshData = async () => {
    if (!signer || !account) return;
    // Note: We pass null for provider because we only need signer for these actions
    const service = new BlockchainService(signer);
    
    const bal = await service.getVendorBalance(account);
    setBalance(bal);
    
    const tix = await service.getMyTickets();
    setTicketCount(tix);

    const hist = await service.getVendorHistory(account);
    setHistory(hist);
  };

  const handleBuyTicket = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const service = new BlockchainService(signer);
      await service.buyTicket("ipfs://metadata-url");
      alert("🎟️ Ticket Purchased!");
      refreshData();
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handlePayVendor = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const service = new BlockchainService(signer);
      await service.payVendor(vendorAddress, payAmount);
      alert("💸 Payment Sent!");
      refreshData();
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const service = new BlockchainService(signer);
      await service.withdrawVendorFunds();
      alert("💰 Funds Withdrawn!");
      refreshData();
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!signer) return;
    try {
      const service = new BlockchainService(signer);
      await service.registerAsVendor();
      alert("✅ You are now a registered vendor!");
      // Force page reload to update roles
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  // 3. THIS IS THE CRITICAL MISSING PIECE: THE RETURN STATEMENT
  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              VendorChain
            </h1>
            <p className="text-slate-400 mt-1">Decentralized Event Settlement</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="font-mono text-sm text-cyan-400">{account?.slice(0,6)}...{account?.slice(-4)}</p>
          </div>
        </header>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* === CUSTOMER PANEL (Visible to Customers & Organizers) === */}
          {(currentRole === "customer" || currentRole === "organizer") && (
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl relative">
              {currentRole === "organizer" && <div className="absolute top-4 right-4 bg-blue-500 text-xs px-2 py-1 rounded">Admin View</div>}
              
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <Ticket className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Customer Hub</h2>
              </div>
              
              <div className="mb-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-sm text-cyan-400 font-bold uppercase tracking-wider mb-1">My Tickets</p>
                  <p className="text-4xl font-extrabold text-white">{ticketCount}</p>
                </div>
                <button 
                  onClick={handleBuyTicket}
                  disabled={loading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                >
                  {loading ? "..." : "Buy (1 ETH)"}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pay Vendor
                </h3>
                <input 
                  className="w-full p-4 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-slate-500" 
                  placeholder="Vendor Address (0x...)" 
                  value={vendorAddress}
                  onChange={(e) => setVendorAddress(e.target.value)}
                />
                <div className="flex gap-4">
                  <input 
                    className="w-1/2 p-4 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-slate-500" 
                    placeholder="Amount" 
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <button 
                    onClick={handlePayVendor}
                    disabled={loading}
                    className="w-1/2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-green-900/20"
                  >
                    Pay Now
                  </button>
                </div>
              </div>

              {/* === 👇 THIS IS THE NEW "BECOME A VENDOR" SECTION 👇 === */}
              {currentRole === "customer" && (
                <div className="mt-8 p-4 bg-purple-900/20 border border-dashed border-purple-500/50 rounded-xl text-center">
                  <h4 className="text-purple-300 font-bold mb-1">Are you selling at this event?</h4>
                  <p className="text-slate-400 text-xs mb-3">Vendors get instant payouts and detailed sales tracking.</p>
                  <button 
                    onClick={handleRegister}
                    className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    Activate Vendor Account
                  </button>
                </div>
              )}
              {/* ======================================================= */}

            </div>
          )}

          {/* === VENDOR PANEL (Visible to Vendors & Organizers) === */}
          {(currentRole === "vendor" || currentRole === "organizer") && (
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
              {currentRole === "organizer" && <div className="absolute top-4 right-4 bg-purple-500 text-xs px-2 py-1 rounded">Admin View</div>}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4 relative">
                <QrCode className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Vendor Portal</h2>
              </div>
              
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-900/50 to-slate-900 rounded-xl border border-purple-500/30">
                <p className="text-sm text-purple-400 font-bold uppercase tracking-wider mb-1">Pending Balance</p>
                <div className="flex justify-between items-end">
                  <p className="text-4xl font-extrabold text-white">{parseFloat(balance).toFixed(4)} <span className="text-lg text-slate-500">ETH</span></p>
                  <button 
                    onClick={handleWithdraw}
                    disabled={loading || parseFloat(balance) === 0}
                    className="text-sm bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 flex flex-col items-center justify-center bg-white p-3 rounded-xl">
                  {account && <QRCode value={account} size={80} />}
                  <p className="text-[10px] text-slate-900 font-bold mt-2 uppercase tracking-wide">Scan Me</p>
                </div>

                <div className="col-span-2 flex flex-col h-40">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <History className="w-3 h-3" /> Recent Transactions
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {history.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 text-xs border border-dashed border-slate-700 rounded-lg">
                        No Data
                      </div>
                    ) : (
                      history.map((tx) => (
                        <div key={tx.hash} className="bg-slate-900/50 p-2 rounded border border-slate-700 flex justify-between items-center">
                          <div>
                            <p className="text-green-400 font-bold text-sm">+{parseFloat(tx.amount).toFixed(2)}</p>
                            <p className="text-[10px] text-slate-500 truncate w-16">{tx.hash}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700">
                              -{parseFloat(tx.fee).toFixed(3)} Fee
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Remove the old register button since it's now in the customer view logic */}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}