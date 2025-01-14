import React, { useContext } from 'react';
import Context from '../../utils/context';
import { WalletIcon, FolderOpen, KeyRound } from 'lucide-react';
import { Button } from '../shared/Button';

export function Wallet() {
  const { dispatch } = useContext(Context);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-900">
          Welcome to HD Wallet
        </h1>
        <p className="mt-2 text-gray-600">
          Create a new wallet, restore from backup, or open an existing wallet
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Button
          text="Create New Wallet"
          icon={<WalletIcon />} // Use JSX syntax to render the icon
          onClick={() => dispatch({ type: 'SET_VIEW', param: 'create' })}
          variant="default"
          className="w-full"
          ariaLabel="Create a new wallet"
        />  

        <Button
          text="Open Existing Wallet"
          icon={<FolderOpen />} // JSX syntax
          onClick={() => dispatch({ type: 'SET_VIEW', param: 'open' })}
          variant="default"
          className="w-full"
          ariaLabel="Open an existing wallet"
        />

        <Button
          text="Restore Wallet"
          icon={<KeyRound />} // JSX syntax
          onClick={() => dispatch({ type: 'SET_VIEW', param: 'restore' })}
          variant="default"
          className="w-full"
          ariaLabel="Restore wallet from recovery phrase"
        />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          By using this wallet, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}


