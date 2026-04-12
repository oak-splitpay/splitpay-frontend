'use client';

import React, { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (walletAddress: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // Mock wallet connection - in production, this would use Freighter API
      // Check if Freighter extension is available
      if (typeof window !== 'undefined' && (window as any).freighter) {
        try {
          const publicKey = await (window as any).freighter.getPublicKey();
          setWalletAddress(publicKey);
          setIsConnected(true);
          onConnect?.(publicKey);
        } catch (err) {
          setError('Failed to connect wallet. Please try again.');
        }
      } else {
        // Mock connection for demo purposes
        const mockAddress = 'GBGQ7YPVRMXD...6Q';
        setWalletAddress(mockAddress);
        setIsConnected(true);
        setError('Freighter extension not detected. Using mock wallet for demo.');
        onConnect?.(mockAddress);
      }
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {!isConnected ? (
        <>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-stellar hover:bg-stellar-light text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            <Wallet size={20} />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2 flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">{error}</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Connected Wallet:</p>
            <p className="text-sm font-mono text-green-700 break-all">{walletAddress}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
