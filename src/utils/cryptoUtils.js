import { ethers } from 'ethers';

export const createNewWallet = async (name, password) => {
  const wallet = ethers.Wallet.createRandom();
  return {
    name,
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    encryptedWallet: await wallet.encrypt(password),
  };
};

export const restoreWallet = async (mnemonic, password) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    encryptedWallet: await wallet.encrypt(password),
  };
};
