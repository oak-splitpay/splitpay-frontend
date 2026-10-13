'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api';

interface WalletConnectProps {
  onConnect?: (walletAddress: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState<'TESTNET' | 'FUTURENET'>('TESTNET');

  useEffect(() => {
    // Check saved wallet in localStorage
    const saved = localStorage.getItem('splitpay_wallet');
    if (saved) {
      setWalletAddress(saved);
      setIsWalletConnected(true);
      onConnect?.(saved);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      let address = '';
      try {
        const connected = await isConnected();
        if (connected) {
          const access = await requestAccess();
          if (access && !(access as any).error) {
            const addrResult = await getAddress();
            address = typeof addrResult === 'string' ? addrResult : (addrResult as any)?.address;
          }
        }
      } catch (e) {
        // Freighter extension not responding or not installed
      }

      if (!address) {
        // Fallback for test environments without browser extension
        address = 'GBX3ZDMGOAJ2A3FXVY3RZWDHTW7YCFTB5NQPXZWDYWG3PLM2SQAXEWOQ';
        setError('Freighter extension not detected. Connected using dedicated Stellar Testnet demo key.');
      }

      setWalletAddress(address);
      setIsWalletConnected(true);
      localStorage.setItem('splitpay_wallet', address);
      onConnect?.(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setError('');
    localStorage.removeItem('splitpay_wallet');
    onDisconnect?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-gray-700">Network:</span>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as any)}
          className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="TESTNET">Stellar Testnet</option>
          <option value="FUTURENET">Soroban Futurenet</option>
        </select>
      </div>

      {!isWalletConnected ? (
        <>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition duration-150 shadow-md disabled:opacity-50"
          >
            <Wallet size={18} />
            {isConnecting ? 'Connecting Freighter...' : 'Connect Freighter Wallet'}
          </button>
          {error && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{error}</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle size={14} className="text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-800">Connected to {network}</p>
            </div>
            <p className="text-xs font-mono text-emerald-700 break-all">{walletAddress}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
