import { ethers } from 'ethers';

export const saveWallet = async (wallet) => {
  try {
    const walletData = {
      ...wallet,
      name: wallet.name || 'HD Wallet'
    };
    localStorage.setItem(walletData.name, JSON.stringify(walletData));
  } catch (error) {
    console.error('Error saving wallet:', error);
    throw new Error('Failed to save wallet');
  }
};

export const loadWallet = (walletName) => {
  try {
    const walletData = localStorage.getItem(walletName);
    if (!walletData) return null;
    
    const wallet = JSON.parse(walletData);
    if (!wallet.encryptedWallet) {
      throw new Error('Invalid wallet structure');
    }
    
    return wallet;
  } catch (error) {
    console.error('Error loading wallet:', error);
    return null;
  }
};

