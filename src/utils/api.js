import { ethers } from 'ethers';
import { loadWallet } from './storage';

const INFURA_API_KEY = "ade1e691b692472a9e00d33c9efa703c";

const getEthereumProvider = () => {
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

async function getCryptoPrices() {
  try {
    console.log('Fetching crypto prices...');
    const response = await fetch('/api/prices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Price API response not ok:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);

    if (!Array.isArray(data)) {
      console.error('Expected array response, got:', typeof data);
      throw new Error('Invalid response format from price API');
    }

    // Convert array response to our expected format
    const prices = {};
    data.forEach(coin => {
      prices[coin.id] = {
        price: coin.current_price || 0,
        priceChange: coin.price_change_percentage_24h || 0
      };
    });

    console.log('Processed price data:', prices);

    return {
      ethereum: prices.ethereum || { price: 0, priceChange: 0 },
      bitcoin: prices.bitcoin || { price: 0, priceChange: 0 }
    };
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return {
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

