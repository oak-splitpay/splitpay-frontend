'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentStatus {
  participant: string;
  status: 'paid' | 'pending' | 'failed';
  amount: string;
}

interface PaymentTrackerProps {
  payments: PaymentStatus[];
}

export default function PaymentTracker({ payments }: PaymentTrackerProps) {
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

  const paidCount = payments.filter(p => p.status === 'paid').length;
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
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${(paidCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {payments.map((payment, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 flex items-center justify-between ${getStatusColor(payment.status)}`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(payment.status)}
              <div>
                <p className="font-medium text-gray-900 text-sm">{payment.participant}</p>
                <p className="text-xs text-gray-600">{payment.amount} XLM</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {getStatusText(payment.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
