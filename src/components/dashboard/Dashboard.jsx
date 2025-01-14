'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react';
import Context from '../../utils/context';
import { getBalances } from '../../utils/api';
import { AssetList } from './AssetList';
import { BalanceHeader } from './BalanceHeader';
import { NavigationFooter } from './NavigationFooter';
import { ActionModal } from './ActionModal';

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
  const [initialBalance, setInitialBalance] = useState(null);

  const fetchBalances = useCallback(async () => {
    if (!state.wallet?.address) {
      setIsLoading(false);
      return;
    }

    try {
      const balanceData = await getBalances(state.wallet.address);
      setBalances(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(balanceData)) {
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
    const interval = setInterval(fetchBalances, 60000);
    return () => {
      clearInterval(interval);
      setBalances({
        sepolia: { balance: '0', price: 0, priceChange: 0 },
        bitcoin: { balance: '0', price: 0, priceChange: 0 }
      });
    };
  }, [fetchBalances]);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setShowDetails(true);
    setShowActions(true);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (showDetails) {
      setShowDetails(false);
      setSelectedAsset(null);
      setShowActions(false);
    } else {
      dispatch({ type: 'BACK', param: 'home' });
    }
  };

  const handleExit = (e) => {
    e.preventDefault();
    if (initialBalance) {
      setBalances(initialBalance);
    }
    dispatch({ type: 'EXIT' });
  };

  const calculateTotalBalance = () => {
    return Object.values(balances).reduce((total, asset) => {
      return total + (parseFloat(asset.balance) * asset.price);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <BalanceHeader 
        totalBalance={calculateTotalBalance()}
        selectedAsset={selectedAsset}
        assetBalance={selectedAsset ? balances[selectedAsset.id].balance : null}
        assetPrice={selectedAsset ? balances[selectedAsset.id].price : null}
        priceChange={selectedAsset ? balances[selectedAsset.id].priceChange : null}
      />

      <div className="mb-4">
        <div className="flex justify-between mb-4">
          <div className="text-gray-600">My assets</div>
          <div className="text-gray-600">Amount/Cost</div>
        </div>
        <AssetList 
          assets={ASSETS}
          balances={balances}
          onAssetClick={handleAssetClick}
        />
      </div>

      <NavigationFooter 
        onBack={handleBack}
        onExit={handleExit}
      />

      <ActionModal 
        isOpen={showActions}
        onClose={() => {
          setShowActions(false);
          setShowDetails(false);
          setSelectedAsset(null);
          if (initialBalance) {
            setBalances(initialBalance);
          }
        }}
        selectedAsset={selectedAsset}
        walletAddress={state.wallet?.address}
        balance={selectedAsset ? balances[selectedAsset.id].balance : '0'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

