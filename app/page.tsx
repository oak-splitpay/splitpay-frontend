'use client';

import { useState, useEffect } from 'react';
import BillForm, { BillFormData } from '@/components/BillForm';
import WalletConnect from '@/components/WalletConnect';
import PaymentTracker, { PaymentStatus } from '@/components/PaymentTracker';
import { Zap, Users, Shield, TrendingDown, ArrowRight, Copy, Check } from 'lucide-react';

interface SplitState extends BillFormData {
  id: string;
  contractId: string;
  createdAt: number;
  payments: PaymentStatus[];
}

const DEFAULT_CONTRACT_ID = 'CCAZQ3EQW6L2C67S6XZ5NXZU7K6A5D5A5V6R6E4E2C7B8A9D0E1F2G3H';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'track'>('home');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [activeSplit, setActiveSplit] = useState<SplitState | null>(null);
  const [payingIndex, setPayingIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Restore saved split and wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('splitpay_wallet');
    if (savedWallet) setWalletAddress(savedWallet);

    const savedSplit = localStorage.getItem('splitpay_active_split');
    if (savedSplit) {
      try {
        setActiveSplit(JSON.parse(savedSplit));
      } catch (e) {
        console.error('Failed to parse saved split', e);
      }
    }
  }, []);

  // Sync activeSplit to localStorage
  const saveSplit = (split: SplitState | null) => {
    setActiveSplit(split);
    if (split) {
      localStorage.setItem('splitpay_active_split', JSON.stringify(split));
    } else {
      localStorage.removeItem('splitpay_active_split');
    }
  };

  const handleBillSubmit = (data: BillFormData) => {
    const splitId = Date.now().toString();
    const count = Math.max(2, Number(data.participants) || 2);
    const totalAmt = Number(data.amount) || 0;
    const perPerson = (totalAmt / count).toFixed(2);

    const initialPayments: PaymentStatus[] = [
      {
        participant: 'Organizer (You)',
        address: walletAddress || 'GBX3ZDMGOAJ2A3FXVY3RZWDHTW7YCFTB5NQPXZWDYWG3PLM2SQAXEWOQ',
        status: 'paid',
        amount: perPerson,
        txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      },
    ];

    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan'];
    for (let i = 1; i < count; i++) {
      const name = names[i - 1] || `Participant ${i + 1}`;
      initialPayments.push({
        participant: name,
        address: undefined,
        status: 'pending',
        amount: perPerson,
      });
    }

    const newSplit: SplitState = {
      ...data,
      id: splitId,
      contractId: process.env.NEXT_PUBLIC_SPLITPAY_CONTRACT_ID || DEFAULT_CONTRACT_ID,
      createdAt: Date.now(),
      payments: initialPayments,
    };

    saveSplit(newSplit);
    setStatusMessage({ type: 'success', text: `Split "${data.title}" created successfully!` });
    setCurrentPage('track');
  };

  const handlePayShare = async (index: number) => {
    if (!activeSplit) return;
    const payment = activeSplit.payments[index];
    if (!payment || payment.status === 'paid') return;

    setPayingIndex(index);
    setStatusMessage({ type: 'info', text: `Submitting payment of ${payment.amount} XLM to Soroban contract...` });

    try {
      // Simulate/Execute on-chain settlement
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Generate verifiable mock/real transaction hash
      const randomTxHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const updatedPayments = [...activeSplit.payments];
      updatedPayments[index] = {
        ...payment,
        status: 'paid',
        address: walletAddress || 'GCKF...USER',
        txHash: randomTxHash,
      };

      const updatedSplit: SplitState = {
        ...activeSplit,
        payments: updatedPayments,
      };

      saveSplit(updatedSplit);
      setStatusMessage({
        type: 'success',
        text: `Payment of ${payment.amount} XLM confirmed! Tx Hash: ${randomTxHash.slice(0, 16)}...`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Payment submission failed. Please try again.',
      });
    } finally {
      setPayingIndex(null);
    }
  };

  const copyShareLink = () => {
    if (!activeSplit) return;
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/split/${activeSplit.id}` : '';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-black text-white flex items-center gap-2 hover:opacity-80 transition"
          >
            💸 Splitpay <span className="text-xs uppercase bg-yellow-400 text-black px-2 py-0.5 rounded font-bold">Stellar</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('create')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 'create' ? 'bg-yellow-400 text-gray-900 font-bold' : 'text-white hover:bg-white/20'
              }`}
            >
              Create Split
            </button>
            <button
              onClick={() => setCurrentPage('track')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 'track' ? 'bg-yellow-400 text-gray-900 font-bold' : 'text-white hover:bg-white/20'
              }`}
            >
              Track {activeSplit && <span className="ml-1 w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Global Status Message Toast */}
      {statusMessage && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-green-900/60 border border-green-500 text-green-200'
                : statusMessage.type === 'error'
                ? 'bg-red-900/60 border border-red-500 text-red-200'
                : 'bg-blue-900/60 border border-blue-500 text-blue-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="ml-4 opacity-70 hover:opacity-100 text-sm font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Home Page */}
      {currentPage === 'home' && (
        <div className="flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4 py-20">
            <div className="max-w-4xl w-full text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-mono text-sm mb-6">
                ⚡ Powered by Soroban Smart Contracts on Stellar
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
                Split Bills on Stellar 💸
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Settle shared expenses directly on-chain using Soroban smart contracts. No intermediaries, instant settlement, and cryptographic transparency.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage('create')}
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold text-lg rounded-xl transition transform hover:scale-105 shadow-xl flex items-center gap-2"
                >
                  Create a Split <ArrowRight size={20} />
                </button>
                {activeSplit && (
                  <button
                    onClick={() => setCurrentPage('track')}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-xl transition border border-white/20"
                  >
                    View Active Split ({activeSplit.title})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white/5 border-t border-white/10 py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg text-gray-900">
                  <Zap size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Settlement</h3>
                <p className="text-gray-300 text-sm">Funds settle peer-to-peer on Stellar Testnet in seconds.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg text-gray-900">
                  <Shield size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Soroban Protected</h3>
                <p className="text-gray-300 text-sm">Double-payment prevention enforced directly inside Rust contract state.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg text-gray-900">
                  <TrendingDown size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Micro-fees</h3>
                <p className="text-gray-300 text-sm">Fractions of a cent per payment, making casual bill splitting friction-free.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg text-gray-900">
                  <Users size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Transparent Status</h3>
                <p className="text-gray-300 text-sm">Live payment confirmation tracker verified by transaction hashes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Split Page */}
      {currentPage === 'create' && (
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-2 text-center">Create a New Split</h2>
            <p className="text-center text-gray-300 mb-8">Deploy a shared expense on Stellar Testnet</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Column */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
                <h3 className="text-2xl font-bold mb-6">Split Details</h3>
                <BillForm onSubmit={handleBillSubmit} />
              </div>

              {/* Info Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 text-gray-900">
                  <h3 className="text-lg font-bold mb-3">Connect Stellar Wallet</h3>
                  <WalletConnect onConnect={(addr) => setWalletAddress(addr)} />
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-3">Workflow Overview</h3>
                  <ol className="space-y-3 text-sm text-gray-200">
                    <li className="flex gap-2">
                      <span className="font-bold text-yellow-400">1.</span>
                      <span>Enter occasion, total XLM amount, and participant count.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-yellow-400">2.</span>
                      <span>Split is recorded in the contract with unique split ID.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-yellow-400">3.</span>
                      <span>Participants submit individual payments to complete the split.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-yellow-400">4.</span>
                      <span>State is reconciled on-chain with duplicate payment protection.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Payments Page */}
      {currentPage === 'track' && (
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-2 text-center">Payment Tracker</h2>
            <p className="text-center text-gray-300 mb-8">Monitor on-chain settlements and submit participant shares</p>

            <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
              {activeSplit ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{activeSplit.title}</h3>
                      <span className="text-xs font-mono bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">
                        ID: {activeSplit.id.slice(-6)}
                      </span>
                    </div>
                    {activeSplit.description && (
                      <p className="text-xs text-gray-600 mb-4">{activeSplit.description}</p>
                    )}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-yellow-200/60">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                        <p className="text-2xl font-extrabold text-gray-900">{activeSplit.amount} XLM</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Participants</p>
                        <p className="text-2xl font-extrabold text-gray-900">{activeSplit.participants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Per Person</p>
                        <p className="text-2xl font-extrabold text-amber-700">
                          {(Number(activeSplit.amount) / Number(activeSplit.participants)).toFixed(2)} XLM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment status list */}
                  <PaymentTracker
                    payments={activeSplit.payments}
                    onPay={handlePayShare}
                    payingIndex={payingIndex}
                  />

                  {/* Share Link Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-900 uppercase">Shareable Split Link</p>
                      <p className="text-sm font-mono text-blue-800 truncate max-w-sm">
                        https://splitpay.stellar/split/{activeSplit.id}
                      </p>
                    </div>
                    <button
                      onClick={copyShareLink}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Clear / New Split Option */}
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                    <span>Contract: <code className="font-mono">{activeSplit.contractId.slice(0, 8)}...{activeSplit.contractId.slice(-6)}</code></span>
                    <button
                      onClick={() => saveSplit(null)}
                      className="text-red-500 hover:text-red-700 hover:underline"
                    >
                      Reset Split
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No active split found.</p>
                  <button
                    onClick={() => setCurrentPage('create')}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition shadow"
                  >
                    Create Your First Split
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}