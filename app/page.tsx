'use client';

import { useState } from 'react';
import BillForm, { BillFormData } from '@/components/BillForm';
import WalletConnect from '@/components/WalletConnect';
import PaymentTracker from '@/components/PaymentTracker';
import { Zap, Users, Shield, TrendingDown } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'track'>('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [createdSplit, setCreatedSplit] = useState<BillFormData | null>(null);

  const handleBillSubmit = (data: BillFormData) => {
    setCreatedSplit(data);
    alert(`Split created! Share the link with participants:\nhttps://splitpay.example.com/split/123456`);
    setCurrentPage('track');
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold text-white flex items-center gap-2 hover:opacity-80 transition"
          >
            💸 Splitpay
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('create')}
              className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-white/20 transition"
            >
              Create Split
            </button>
            <button
              onClick={() => setCurrentPage('track')}
              className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-white/20 transition"
            >
              Track
            </button>
          </div>
        </div>
      </nav>

      {/* Home Page */}
      {currentPage === 'home' && (
        <div className="h-screen flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full text-center">
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                Split Bills on Stellar 💸
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 drop-shadow">
                Settle your shared expenses instantly using blockchain. No fees, no middleman, no awkwardness.
              </p>
              <button
                onClick={() => setCurrentPage('create')}
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg rounded-xl transition transform hover:scale-105 shadow-xl"
              >
                Get Started 🚀
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-md py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="text-gray-900" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-white/80">Settle on-chain in seconds</p>
              </div>

              <div className="text-center">
                <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="text-gray-900" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
                <p className="text-white/80">Your keys, your crypto, your control</p>
              </div>

              <div className="text-center">
                <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingDown className="text-gray-900" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Low Fees</h3>
                <p className="text-white/80">Stellar network microfees</p>
              </div>

              <div className="text-center">
                <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="text-gray-900" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Social</h3>
                <p className="text-white/80">Track who paid instantly</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Split Page */}
      {currentPage === 'create' && (
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Create a New Split</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Column */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Split Details</h3>
                <BillForm onSubmit={handleBillSubmit} />
              </div>

              {/* Info Column */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">How It Works</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold flex-shrink-0">1.</span>
                      <span>Enter the bill amount and number of participants</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold flex-shrink-0">2.</span>
                      <span>We generate a shareable link with QR code</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold flex-shrink-0">3.</span>
                      <span>Participants connect their Stellar wallet</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold flex-shrink-0">4.</span>
                      <span>They sign the transaction to pay their share</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold flex-shrink-0">5.</span>
                      <span>Funds settle instantly on the blockchain</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Connect Your Wallet</h3>
                  <WalletConnect onConnect={() => setWalletConnected(true)} />
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
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Track Payments</h2>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {createdSplit ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{createdSplit.title}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{createdSplit.amount} XLM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participants</p>
                        <p className="text-2xl font-bold text-gray-900">{createdSplit.participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Per Person</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {(Number(createdSplit.amount) / Number(createdSplit.participants)).toFixed(2)} XLM
                        </p>
                      </div>
                    </div>
                  </div>

                  <PaymentTracker
                    payments={[
                      { participant: 'You', status: 'paid', amount: (Number(createdSplit.amount) / Number(createdSplit.participants)).toFixed(2) },
                      { participant: 'Alice', status: 'pending', amount: (Number(createdSplit.amount) / Number(createdSplit.participants)).toFixed(2) },
                      { participant: 'Bob', status: 'pending', amount: (Number(createdSplit.amount) / Number(createdSplit.participants)).toFixed(2) },
                    ]}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Share Link:</strong> https://splitpay.example.com/split/123456
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No split created yet</p>
                  <button
                    onClick={() => setCurrentPage('create')}
                    className="px-6 py-3 bg-stellar hover:bg-stellar-light text-white font-semibold rounded-lg transition"
                  >
                    Create a Split
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main> 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (XLM)</label>
              <input 
                type="number" 
                placeholder="100.00" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How Many People?</label>
              <input 
                type="number" 
                placeholder="2" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                required
                min="2"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
          >
            Generate Payment Link
          </button>
        </form>
      </div>
    </main>