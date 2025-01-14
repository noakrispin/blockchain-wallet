export const config = {
    runtime: 'nodejs',
    maxDuration: 10
  };
  
  export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,bitcoin&price_change_percentage=24h',
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Transform the data to match our expected format
      const formattedData = data.map(coin => ({
        id: coin.id,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h
      }));
  
      // Set cache headers
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
      return res.status(200).json(formattedData);
  
    } catch (error) {
      console.error('Price fetch error:', error);
      return res.status(500).json([
        {
          id: "ethereum",
          current_price: 0,
          price_change_percentage_24h: 0
        },
        {
          id: "bitcoin",
          current_price: 0,
          price_change_percentage_24h: 0
        }
      ]);
    }
  }
  
  