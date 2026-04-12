'use client';

import React, { useState } from 'react';
import { DollarSign, Users, AlertCircle } from 'lucide-react';

interface BillFormProps {
  onSubmit?: (data: BillFormData) => void;
}

export interface BillFormData {
  title: string;
  amount: string;
  participants: string;
  description: string;
}

export default function BillForm({ onSubmit }: BillFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    title: '',
    amount: '',
    participants: '',
    description: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter an occasion');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.participants || Number(formData.participants) < 2) {
      setError('You need at least 2 participants');
      return;
    }

    onSubmit?.(formData);
  };

  const perPersonAmount = formData.amount && formData.participants 
    ? (Number(formData.amount) / Number(formData.participants)).toFixed(2)
    : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Occasion
        </label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Dinner at Nando's" 
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <DollarSign size={16} /> Total Amount
          </label>
          <input 
            type="number" 
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="100.00" 
            step="0.01"
            min="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Users size={16} /> Participants
          </label>
          <input 
            type="number" 
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            placeholder="2" 
            min="2"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>
      </div>

      {formData.amount && formData.participants && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Each person pays: <span className="font-bold text-yellow-600 text-lg">{perPersonAmount} XLM</span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add any additional notes..." 
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button 
        type="submit"
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition transform hover:scale-105"
      >
        Create Split 🚀
      </button>
    </form>
  );
}
