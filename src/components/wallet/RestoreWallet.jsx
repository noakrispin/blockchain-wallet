import React, { useState, useContext } from 'react';
import { KeyRound, Home, LogOut, Eye, EyeOff } from 'lucide-react';
import { ethers } from 'ethers';
import Context from '../../utils/context';
import * as storage from '../../utils/storage';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Error } from '../shared/Error';

export function RestoreWallet() {
  const { dispatch } = useContext(Context);
  const [formData, setFormData] = useState({
    walletName: '',
    password: '',
    confirmPassword: '',
    mnemonic: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate mnemonic
      if (!ethers.Mnemonic.isValidMnemonic(formData.mnemonic)) {
        throw new Error('Invalid recovery phrase');
      }

      // Create wallet from mnemonic
      const wallet = ethers.Wallet.fromPhrase(formData.mnemonic);
      
      // Encrypt the wallet
      const encryptedWallet = await wallet.encrypt(formData.password);
      
      // Prepare wallet data
      const walletData = {
        name: formData.walletName,
        address: wallet.address,
        encryptedWallet,
        mnemonic: formData.mnemonic
      };

      // Save wallet
      await storage.saveWallet(walletData);
      
      // Update state
      dispatch({ type: 'SET_WALLET', param: walletData });
      dispatch({ type: 'SET_VIEW', param: 'dashboard' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to restore wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-purple-900 mb-6">
          Restore Wallet
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="walletName" 
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Wallet Name
            </label>
            <Input
              type="text"
              id="walletName"
              name="walletName"
              value={formData.walletName}
              onChange={handleChange}
              placeholder="Enter wallet name..."
              required
            />
          </div>

          <div>
            <label 
              htmlFor="mnemonic" 
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Recovery Phrase
            </label>
            <div className="relative">
              <textarea
                id="mnemonic"
                name="mnemonic"
                value={formData.mnemonic}
                onChange={handleChange}
                placeholder="Enter your 12-word recovery phrase..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none min-h-[100px]"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter your 12-word recovery phrase with spaces between each word
            </p>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password..."
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password..."
              required
            />
          </div>

          {error && (
            <Error 
              message={error}
              variant="default"
              onDismiss={() => setError('')}
            />
          )}

          <Button 
            text="Restore Wallet"
            icon={KeyRound}
            type="submit"
            variant="default"
            loading={isLoading}
            disabled={!formData.walletName || !formData.password || !formData.confirmPassword || !formData.mnemonic}
            className="w-auto px-8 py-3 rounded-[2rem] bg-green-500/80 hover:bg-green-600/90 text-white"
          />

          <div className="w-full flex items-center gap-4 pt-4 mt-4 border-t border-gray-200">
            <Button 
              text="Back"
              icon={Home}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: 'BACK', param: 'home' });
              }}
              variant="outline"
              size="small"
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 rounded-lg"
            />
            <Button 
              text="Exit"
              icon={LogOut}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: 'EXIT' });
              }}
              variant="outline"
              size="small"
              className="flex-1 px-4 py-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 rounded-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

