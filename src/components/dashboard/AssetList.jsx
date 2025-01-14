import { ArrowRight } from 'lucide-react';
import { formatPrice, formatChange } from '../../utils/format';

export function AssetList({ assets, balances, onAssetClick }) {
  return (
    <div className="divide-y">
      {assets.map((asset) => {
        const assetData = balances[asset.id];
        const value = parseFloat(assetData.balance) * assetData.price;
        const { color, change } = formatChange(assetData.priceChange);
        
        return (
          <div key={asset.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img 
                src={asset.image}
                alt={asset.name}
                className="w-8 h-8"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-gray-500">{asset.symbol}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(assetData.price)}
                  <span className={`ml-1 ${color}`}>
                    {change}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div>{assetData.balance}</div>
                <div className="text-sm text-gray-500">{formatPrice(value)}</div>
              </div>
              <button
                type="button"
                onClick={() => onAssetClick(asset)}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

