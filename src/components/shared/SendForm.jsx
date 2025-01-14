import React, { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { sendTransaction, isValidAddress } from '../../utils/api';
import { Error } from './Error';

export function SendForm({ onClose, selectedAsset, balance }) {
  const [formData, setFormData] = useState({
    password: '',
    recipient: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setError('');
    
    // Show error if user enters an email
    if (name === 'recipient' && value.includes('@')) {
      setError('Please enter an Ethereum wallet address, not an email address. The address should start with 0x.');
    }
    // Validate Ethereum address format if not empty
    else if (name === 'recipient' && value && !isValidAddress(value)) {
      setError('Invalid Ethereum address format. Address must start with 0x and be 42 characters long.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTxHash('');

    try {
      // Additional validation for email addresses
      if (formData.recipient.includes('@')) {
        throw new Error('Cannot send to email address. Please enter an Ethereum wallet address starting with 0x.');
      }

      // Validate address format
      if (!isValidAddress(formData.recipient)) {
        throw new Error('Invalid Ethereum address format. The address should start with 0x and be 42 characters long.');
      }

      // Validate amount
      const amount = parseFloat(formData.amount);
      const currentBalance = parseFloat(balance);

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (amount > currentBalance) {
        throw new Error(`Insufficient balance. You have ${balance} ${selectedAsset?.symbol} available`);
      }

      // Send transaction
      const tx = await sendTransaction(formData.recipient, formData.amount, formData.password);
      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);
      
      setFormData({
        password: '',
        recipient: '',
        amount: ''
      });

      if (onClose) {
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      const errorMessage = err?.message || 'Failed to send transaction';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">How to send {selectedAsset?.symbol}:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Enter your wallet password</li>
              <li>Enter the recipient's Ethereum wallet address (starts with 0x)</li>
              <li>Enter the amount to send</li>
            </ol>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Wallet Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
          Recipient's Ethereum Address
        </label>
        <input
          type="text"
          id="recipient"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be a valid Ethereum address starting with 0x (42 characters long)
        </p>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount ({selectedAsset?.symbol})
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0"
            step="0.000001"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Available: {balance} {selectedAsset?.symbol}
        </p>
      </div>

      {error && (
        <Error 
          message={error}
          variant="default"
          onDismiss={() => setError('')}
        />
      )}

      {txHash && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <p className="text-sm">Transaction sent successfully!</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 mt-2"
          >
            View on Etherscan
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !!error}
        className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

