export const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  export const formatChange = (change) => {
    if (!change && change !== 0) return { color: '', change: '' };
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-green-500' : 'text-red-500';
    return {
      color,
      change: `${sign}${change.toFixed(2)}%`
    };
  };
  
  