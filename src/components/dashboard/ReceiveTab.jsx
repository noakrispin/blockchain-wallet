import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function ReceiveTab({ walletAddress }) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div>
      <div className="mb-4">
        <span className="text-gray-600">My wallet address:</span>
      </div>
      
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-6">
        <input
          type="text"
          value={walletAddress}
          readOnly
          className="flex-1 bg-transparent text-sm"
        />
        <button 
          type="button"
          onClick={handleCopyAddress}
          className="text-gray-400 hover:text-gray-600"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <QRCodeSVG 
          value={walletAddress}
          size={160}
          level="L"
          includeMargin={true}
        />
      </div>
    </div>
  );
}

