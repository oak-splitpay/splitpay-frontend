'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

export interface PaymentStatus {
  participant: string;
  address?: string;
  status: 'paid' | 'pending' | 'failed';
  amount: string;
  txHash?: string;
}

interface PaymentTrackerProps {
  payments: PaymentStatus[];
  onPay?: (index: number) => void;
  payingIndex?: number | null;
}

export default function PaymentTracker({ payments, onPay, payingIndex }: PaymentTrackerProps) {
  const getStatusColor = (status: 'paid' | 'pending' | 'failed') => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = (status: 'paid' | 'pending' | 'failed') => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-600" />;
    }
  };

  const getStatusText = (status: 'paid' | 'pending' | 'failed') => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
    }
  };

  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const totalCount = payments.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Payment Status</h3>
        <span className="text-sm font-semibold text-gray-600">
          {paidCount}/{totalCount} paid
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (paidCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-3">
        {payments.map((payment, index) => {
          const isProcessing = payingIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${getStatusColor(
                payment.status
              )}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {payment.participant}
                    {payment.address && (
                      <span className="ml-2 font-mono text-xs text-gray-500">
                        ({payment.address.slice(0, 4)}...{payment.address.slice(-4)})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">{payment.amount} XLM</p>
                  {payment.txHash && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${payment.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 font-mono"
                    >
                      Tx: {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-6)}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {getStatusText(payment.status)}
                </span>
                {payment.status === 'pending' && onPay && (
                  <button
                    onClick={() => onPay(index)}
                    disabled={isProcessing || payingIndex !== null}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-gray-900 text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Settling...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
