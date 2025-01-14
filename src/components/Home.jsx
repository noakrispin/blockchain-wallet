import React, { useContext } from 'react';
import { Wallet2, FolderOpen, KeyRound } from 'lucide-react';
import { Button } from './shared/Button';
import Context from '../utils/context';

export const Home = () => {
  const { dispatch } = useContext(Context);

  const handleCreateWallet = () => {
    dispatch({ type: 'SET_VIEW', param: 'create' });
  };

  const handleOpenWallet = () => {
    dispatch({ type: 'SET_VIEW', param: 'open' });
  };

  const handleRestoreWallet = () => {
    dispatch({ type: 'SET_VIEW', param: 'restore' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <div className="p-8">
        <h3 className="text-xl font-semibold text-purple-700 text-center mb-6">
          Start Your Crypto Journey with Confidence
        </h3>
        
        <div className="space-y-4 max-w-lg mx-auto px-8">
          <Button
            text="Create New Wallet"
            icon={Wallet2}
            iconColor="text-green-500"
            onClick={handleCreateWallet}
            ariaLabel="Create a new wallet"
          />

          <Button
            text="Open Existing Wallet"
            icon={FolderOpen}
            iconColor="text-blue-500"
            onClick={handleOpenWallet}
            ariaLabel="Open an existing wallet"
          />

          <Button
            text="Restore Using Recovery Phrase"
            icon={KeyRound}
            iconColor="text-yellow-500"
            onClick={handleRestoreWallet}
            ariaLabel="Restore wallet using recovery phrase"
          />
        </div>
      </div>
    </div>
  );
};

