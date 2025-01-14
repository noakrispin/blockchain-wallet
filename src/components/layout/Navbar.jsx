import React, { useContext } from 'react';
import Context from '../../utils/context';

export const Navbar = () => {
  const { state } = useContext(Context);

  return (
    <div className="bg-gradient-to-r from-purple-200 via-pink-300 to-blue-100 p-6 text-center shadow-md">
      <h1 className="text-3xl font-bold text-purple-900 mb-1">
        Hello
      </h1>
      <h2 className="text-4xl font-bold text-gray-900">
        {state.view === 'home' ? 'Welcome to HD Wallet!' : state.wallet?.name || 'HD Wallet'}
      </h2>
    </div>
  );
};

