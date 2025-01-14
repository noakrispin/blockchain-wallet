'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Copy, X, Home, LogOut } from 'lucide-react';
import Context from '../../utils/context';
import { getBalances, sendTransaction } from '../../utils/api';
import { formatPrice, formatChange } from '../../utils/format';

const ASSETS = [
  {
    id: 'sepolia',
    name: 'sepolia',
    symbol: 'sETH',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ethereum-RFuc3YV4QdtEmHOLrrTTGvOF22xYCx.png'
  },
  {
    id: 'bitcoin',
    name: 'bitcoin',
    symbol: 'wBTC',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bitcoin-xOdVvqj12aisB4ZUO9gQJLU9I7ugaG.png'
  }
];

export function Dashboard() {
  const { state, dispatch } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState({
    sepolia: { balance: '0', price: 0, priceChange: 0 },
    bitcoin: { balance: '0', price: 0, priceChange: 0 }
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState('receive');
  const [sendForm, setSendForm] = useState({
    privateKey: '',
    recipient: '',
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialBalance, setInitialBalance] = useState(null);

  const fetchBalances = useCallback(async () => {
    if (!state.wallet?.address) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching balances...');
      const balanceData = await getBalances(state.wallet.address);
      console.log('Received balance data:', balanceData);
      
      setBalances(prev => {
        // Only update if the data is different
        if (JSON.stringify(prev) !== JSON.stringify(balanceData)) {
          // Store initial balance when first loaded
          if (initialBalance === null) {
            setInitialBalance(balanceData);
          }
          return balanceData;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [state.wallet, initialBalance]);

  useEffect(() => {
    fetchBalances();
    // Update every 30 seconds instead of 15 to avoid rate limiting
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setShowDetails(true);
    setShowActions(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedAsset(null);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(state.wallet.address);
  };

  const calculateTotalBalance = () => {
    return Object.values(balances).reduce((total, asset) => {
      return total + (parseFloat(asset.balance) * asset.price);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPriceChange = (change) => {
    if (!change && change !== 0) return '0.00%';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const handleSendFormChange = (e) => {
    const { name, value } = e.target;
    setSendForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { recipient, amount, privateKey } = sendForm;
      const tx = await sendTransaction(recipient, amount, privateKey);
      console.log('Transaction sent:', tx.hash);
      setShowActions(false);
      setSendForm({
        privateKey: '',
        recipient: '',
        amount: ''
      });
      // Refresh balances after transaction
      await fetchBalances();
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderAssetList = () => (
    <div className="divide-y">
      {ASSETS.map((asset) => {
        const assetData = balances[asset.id];
        const value = parseFloat(assetData.balance) * assetData.price;
        const { color, change } = formatChange(assetData.priceChange);
        
        return (
          <div key={asset.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img 
                src={asset.image}
                alt={asset.name}
                className="w-8 h-8"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-gray-500">{asset.symbol}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(assetData.price)}
                  <span className={`ml-1 ${color}`}>
                    {change}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div>{assetData.balance}</div>
                <div className="text-sm text-gray-500">{formatPrice(value)}</div>
              </div>
              <button
                onClick={() => handleAssetClick(asset)}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4">
      {!showDetails ? (
        <>
          <div className="text-center mb-8">
            <div className="text-xl text-gray-600 mb-2">Balance</div>
            <div className="text-4xl font-bold flex items-center justify-center">
              {formatPrice(calculateTotalBalance())}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-4">
              <div className="text-gray-600">My assets</div>
              <div className="text-gray-600">Amount/Cost</div>
            </div>
            {renderAssetList()}
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-2">
              price: {formatPrice(balances[selectedAsset.id].price)}
              <span className={`ml-1 ${balances[selectedAsset.id].priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPriceChange(balances[selectedAsset.id].priceChange)}
              </span>
              <span className="ml-2">
                cost: {formatPrice(parseFloat(balances[selectedAsset.id].balance) * balances[selectedAsset.id].price)}
              </span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {balances[selectedAsset.id].balance} {selectedAsset.symbol}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-4">
              <div className="text-gray-600">My assets</div>
              <div className="text-gray-600">Amount/Cost</div>
            </div>
            {renderAssetList()}
          </div>
        </>
      )}

      <div className="w-full flex items-center gap-4 pt-4 mt-8 border-t border-gray-200">
        <button 
          onClick={showDetails ? handleBack : () => dispatch({ type: 'SET_VIEW', param: 'home' })}
          className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back
        </button>
        <button 
          onClick={() => dispatch({ type: 'EXIT' })}
          className="flex-1 px-4 py-2 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Exit
        </button>
      </div>

      {showActions && (
        <div className="fixed inset-0 bg-black/20 flex items-end justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 mb-4">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('receive')}
                  className={`${activeTab === 'receive' ? 'text-orange-500' : 'text-gray-600'}`}
                >
                  Receive
                </button>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`${activeTab === 'send' ? 'text-orange-500' : 'text-gray-600'}`}
                >
                  Send
                </button>
              </div>
              <button
                onClick={() => {
                  setShowActions(false);
                  if (initialBalance) {
                    setBalances(initialBalance);
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'receive' && (
                <div>
                  <div className="mb-4">
                    <span className="text-gray-600">My wallet address:</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-6">
                    <input
                      type="text"
                      value={state.wallet.address}
                      readOnly
                      className="flex-1 bg-transparent text-sm"
                    />
                    <button 
                      onClick={handleCopyAddress}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <QRCodeSVG 
                      value={state.wallet.address}
                      size={160}
                      level="L"
                      includeMargin={true}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'send' && (
                <form onSubmit={handleSubmitTransaction} className="space-y-4">
                  <div>
                    <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700 mb-1">
                      Private Key
                    </label>
                    <input
                      type="password"
                      id="privateKey"
                      name="privateKey"
                      value={sendForm.privateKey}
                      onChange={handleSendFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      name="recipient"
                      value={sendForm.recipient}
                      onChange={handleSendFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
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
                        value={sendForm.amount}
                        onChange={handleSendFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="0"
                        step="0.000001"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Available: {balances[selectedAsset?.id || 'sepolia'].balance} {selectedAsset?.symbol}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

