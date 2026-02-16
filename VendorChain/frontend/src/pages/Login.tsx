import { Wallet, ShoppingBag, Store } from 'lucide-react';

interface LoginProps {
  connectWallet: () => void;
}

export default function Login({ connectWallet }: LoginProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>

      <div className="z-10 w-full max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            VendorChain
          </h1>
          <p className="text-slate-400 text-xl">
            The Official Event Settlement Partner for <span className="text-white font-bold">TicketSasa</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* OPTION 1: CUSTOMER */}
          <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 hover:border-cyan-500 transition-all group cursor-pointer" onClick={connectWallet}>
            <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
              <ShoppingBag className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Goer</h2>
            <p className="text-slate-400 mb-6">
              Redirected from TicketSasa? Connect to view your tickets and pay vendors instantly.
            </p>
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Wallet className="w-5 h-5" /> Connect Wallet
            </button>
          </div>

          {/* OPTION 2: VENDOR */}
          <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 hover:border-purple-500 transition-all group cursor-pointer" onClick={connectWallet}>
            <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Store className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Vendor</h2>
            <p className="text-slate-400 mb-6">
              Selling goods at the event? Register here to receive payments and track your 80% cut.
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Wallet className="w-5 h-5" /> Vendor Login / Signup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}