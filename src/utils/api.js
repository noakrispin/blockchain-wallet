import { ethers } from 'ethers';
import { loadWallet } from './storage';

const getEthereumProvider = () => {
  const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
  
  if (!INFURA_API_KEY) {
    throw new Error('Infura API key is not configured');
  }

  try {
    return new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
  } catch (error) {
    console.error('Error initializing Ethereum provider:', error);
    throw new Error('Failed to initialize Ethereum provider');
  }
};

// Cache mechanism to store prices
let priceCache = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 60000; // 1 minute cache

async function getCryptoPrices() {
  try {
    // Check cache first
    const now = Date.now();
    if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION) {
      return priceCache.data;
    }

    console.log('Fetching crypto prices...');
    const baseUrl = import.meta.env.PROD 
      ? 'https://blockchain-eosin.vercel.app'
      : '';
    
    const response = await fetch(`${baseUrl}/api/prices`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // Transform and cache the data
    const prices = {
      ethereum: {
        price: data[0]?.current_price || 0,
        priceChange: data[0]?.price_change_percentage_24h || 0
      },
      bitcoin: {
        price: data[1]?.current_price || 0,
        priceChange: data[1]?.price_change_percentage_24h || 0
      }
    };

    priceCache = {
      data: prices,
      timestamp: now
    };

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Return cached data if available, otherwise return default values
    return priceCache.data || {
      ethereum: { price: 0, priceChange: 0 },
      bitcoin: { price: 0, priceChange: 0 }
    };
  }
}

export async function getEthBalance(address) {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    const provider = getEthereumProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0';
  }
}

export async function getBalances(address) {
  try {
    const [ethBalance, prices] = await Promise.all([
      getEthBalance(address),
      getCryptoPrices()
    ]);

    return {
      sepolia: {
        balance: ethBalance,
        price: prices.ethereum.price,
        priceChange: prices.ethereum.priceChange
      },
      bitcoin: {
        balance: '0', // Bitcoin balance would be implemented separately
        price: prices.bitcoin.price,
        priceChange: prices.bitcoin.priceChange
      }
    };
  } catch (error) {
    console.error('Error in getBalances:', error);
    return {
      sepolia: { balance: '0', price: 0, priceChange: 0 },
      bitcoin: { balance: '0', price: 0, priceChange: 0 }
    };
  }
}

export async function sendTransaction(toAddress, amount, password) {
  try {
    const provider = getEthereumProvider();
    const savedWallet = loadWallet();
    
    if (!savedWallet) {
      throw new Error('No wallet found');
    }

    const wallet = await ethers.Wallet.fromEncryptedJson(
      savedWallet.encryptedWallet,
      password
    );
    
    const walletWithProvider = wallet.connect(provider);
    
    const tx = await walletWithProvider.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount.toString())
    });

    return tx;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error(error.message || 'Failed to send transaction');
  }
}

export function isValidAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
}

export async function getGasPrice() {
  try {
    const provider = getEthereumProvider();
    const gasPrice = await provider.getGasPrice();
    return ethers.formatUnits(gasPrice, 'gwei');
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return '0';
  }
}

export async function estimateGas(toAddress, amount) {
  try {
    const provider = getEthereumProvider();
    const savedWallet = loadWallet();
    
    if (!savedWallet) {
      throw new Error('No wallet found');
    }

    const gasEstimate = await provider.estimateGas({
      from: savedWallet.address,
      to: toAddress,
      value: ethers.parseEther(amount.toString())
    });
    
    return ethers.formatUnits(gasEstimate, 'gwei');
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw new Error('Failed to estimate gas');
  }
}

