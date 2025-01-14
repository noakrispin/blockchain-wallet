import { X } from 'lucide-react';
import { ReceiveTab } from './ReceiveTab';
import { SendForm } from '../shared/SendForm';

export function ActionModal({ 
  isOpen, 
  onClose, 
  selectedAsset, 
  walletAddress, 
  balance,
  activeTab,
  onTabChange 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-end justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 mb-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onTabChange('receive')}
              className={`${activeTab === 'receive' ? 'text-orange-500' : 'text-gray-600'}`}
            >
              Receive
            </button>
            <button
              type="button"
              onClick={() => onTabChange('send')}
              className={`${activeTab === 'send' ? 'text-orange-500' : 'text-gray-600'}`}
            >
              Send
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'receive' && (
            <ReceiveTab walletAddress={walletAddress} />
          )}

          {activeTab === 'send' && (
            <SendForm
              selectedAsset={selectedAsset}
              balance={balance}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

