export async function handler(req, res) {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24h_change=true',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Price fetch error:', error);
      return {
        ethereum: { usd: 0, usd_24h_change: 0 },
        bitcoin: { usd: 0, usd_24h_change: 0 }
      };
    }
  }
  
  