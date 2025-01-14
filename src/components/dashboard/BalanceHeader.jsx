import { formatPrice } from '../../utils/format';

export function BalanceHeader({ 
  totalBalance, 
  selectedAsset = null, 
  assetBalance = null, 
  assetPrice = null, 
  priceChange = null 
}) {
  if (!selectedAsset) {
    return (
      <div className="text-center mb-8">
        <div className="text-xl text-gray-600 mb-2">Balance</div>
        <div className="text-4xl font-bold flex items-center justify-center">
          {formatPrice(totalBalance)}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <div className="text-sm text-gray-600 mb-2">
        price: {formatPrice(assetPrice)}
        <span className={`ml-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatPriceChange(priceChange)}
        </span>
        <span className="ml-2">
          cost: {formatPrice(parseFloat(assetBalance) * assetPrice)}
        </span>
      </div>
      <div className="text-4xl font-bold mb-2">
        {assetBalance} {selectedAsset.symbol}
      </div>
    </div>
  );
}

function formatPriceChange(change) {
  if (!change && change !== 0) return '0.00%';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

