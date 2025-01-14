'use client'

import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Home, LogOut, KeyRound } from 'lucide-react';
import { createNewWallet } from '../../utils/cryptoUtils';
import { saveWallet } from '../../utils/storage';
import Context from '../../utils/context';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Error } from '../shared/Error';

export function CreateWallet() {
  const { dispatch } = useContext(Context);
  const [formData, setFormData] = useState({
    walletName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [walletData, setWalletData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const wallet = await createNewWallet(formData.walletName, formData.password);
      setWalletData(wallet);
      setStep(2);
    } catch (error) {
      setError(error.message || 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await saveWallet(walletData, formData.password);
      dispatch({ type: 'SET_WALLET', param: walletData });
      dispatch({ type: 'SET_VIEW', param: 'dashboard' });
    } catch (error) {
      setError(error.message || 'Failed to save wallet');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-purple-900 mb-6">
          Create New Wallet
        </h1>

        {step === 1 ? (
          <form onSubmit={handleCreate} className="space-y-6">
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
                htmlFor="password" 
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password..."
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
                placeholder="Confirm password..."
                required
              />
            </div>

            {error && (
              <Error 
                message={error}
                onDismiss={() => setError('')}
              />
            )}

            <div className="flex flex-col items-center gap-8 mt-8">
              <Button 
                text="Create Wallet"
                icon={KeyRound}
                type="submit"
                loading={isLoading}
                disabled={!formData.walletName || !formData.password || !formData.confirmPassword}
                className="w-auto px-8 py-3 rounded-[2rem] bg-green-500/80 hover:bg-green-600/90 text-white"
              />

              <div className="w-full flex items-center gap-4 pt-4 border-t border-gray-200">
                <Button 
                  text="Back"
                  icon={Home}
                  onClick={() => dispatch({ type: 'SET_VIEW', param: 'home' })}
                  variant="outline"
                  size="small"
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 rounded-lg"
                />
                <Button 
                  text="Exit"
                  icon={LogOut}
                  onClick={() => dispatch({ type: 'EXIT' })}
                  variant="outline"
                  size="small"
                  className="flex-1 px-4 py-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 rounded-lg"
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <Error 
              message="Please save your recovery phrase in a secure location. You will need it to restore your wallet if you lose access."
              variant="warning"
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Recovery Phrase
              </label>
              <p className="font-mono text-sm break-all bg-white p-4 rounded border">
                {walletData?.mnemonic}
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 mt-8">
              <Button
                text="I've Saved My Recovery Phrase"
                icon={KeyRound}
                onClick={handleConfirm}
                loading={isLoading}
                className="w-auto px-8 py-3 rounded-[2rem] bg-green-500/80 hover:bg-green-600/90 text-white"
              />

              <div className="w-full flex items-center gap-4 pt-4 border-t border-gray-200">
                <Button 
                  text="Back"
                  icon={Home}
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="small"
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 rounded-lg"
                />
                <Button 
                  text="Exit"
                  icon={LogOut}
                  onClick={() => dispatch({ type: 'EXIT' })}
                  variant="outline"
                  size="small"
                  className="flex-1 px-4 py-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

