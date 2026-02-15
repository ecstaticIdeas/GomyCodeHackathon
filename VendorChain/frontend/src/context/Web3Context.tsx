import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const LOCALHOST_PARAMS = {
  chainId: '0x7A69', // 31337
  chainName: 'Hardhat Localhost',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['http://127.0.0.1:8545'],
};

interface Web3State {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const Web3Context = createContext<Web3State>({} as Web3State);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      
      // Force switch to Localhost
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: LOCALHOST_PARAMS.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [LOCALHOST_PARAMS],
          });
        }
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();
      
      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
    } else {
      alert("Please install Metamask!");
    }
  };

  useEffect(() => {
    if(window.ethereum && window.ethereum.isConnected) {
        // Optional: Auto-connect logic here
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, provider, signer, connectWallet, isConnected: !!account }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);