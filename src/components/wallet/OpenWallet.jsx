import React, { useState, useContext } from 'react';
import { FolderOpen, Home, LogOut, Eye, EyeOff } from 'lucide-react';
import Context from '../../utils/context';
import * as storage from '../../utils/storage';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Error } from '../shared/Error';

export function OpenWallet() {
  const { dispatch } = useContext(Context);
  const [formData, setFormData] = useState({
    walletName: '',
    password: ''
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
      const wallet = storage.loadWallet(formData.walletName, formData.password);
  
      if (!wallet) {
        throw new Error('Wallet not found');
      }
  
      dispatch({ type: 'SET_WALLET', param: wallet });
      dispatch({ type: 'SET_VIEW', param: 'dashboard' });
    } catch (err) {
      if (err.message === 'Invalid wallet structure') {
        setError('The selected wallet is corrupted or invalid. Please restore or create a new wallet.');
      } else if (err.message === 'Invalid password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-purple-900 mb-6">
          Open Existing Wallet
        </h1>

        {error === 'Wallet not found' ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No wallets found. Create a new wallet first.</p>
            <Button
              text="Create New Wallet"
              onClick={() => dispatch({ type: 'SET_VIEW', param: 'create' })}
              variant="default"
              className="mt-4"
            />
          </div>
        ) : (
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

            {error && (
              <Error 
                message={error}
                variant="default"
                onDismiss={() => setError('')}
              />
            )}

            <Button 
              text="Open Wallet"
              icon={FolderOpen}
              type="submit"
              variant="default"
              loading={isLoading}
              disabled={!formData.walletName || !formData.password}
              className="w-full"
            />

            <div className="w-full flex items-center gap-4 pt-4 mt-4 border-t border-gray-200">
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
          </form>
        )}
      </div>
    </div>
  );
}

