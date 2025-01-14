export const saveWallet = async (wallet, password) => {
    localStorage.setItem('wallet', JSON.stringify(wallet));
  };
  
  export const loadWallet = () => {
    const wallet = localStorage.getItem('wallet');
    return wallet ? JSON.parse(wallet) : null;
  };
  