import React, { useContext } from 'react';
import { Wallet, Home, LogOut } from 'lucide-react';
import Context from '../../utils/context';

export function Sidebar() {
  const { dispatch } = useContext(Context);

  return (
    <div className="w-64 bg-white rounded-xl shadow-md">
      <div className="space-y-4 p-4">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', param: 'dashboard' })}
          className="flex items-center gap-4 p-3 rounded-lg bg-primary text-white hover:bg-primaryHover"
        >
          <Wallet size={24} />
          Dashboard
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', param: 'home' })}
          className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Home size={24} />
          Home
        </button>
        <button
          onClick={() => dispatch({ type: 'EXIT' })}
          className="flex items-center gap-4 p-3 rounded-lg text-red-600 hover:bg-gray-100"
        >
          <LogOut size={24} />
          Exit
        </button>
      </div>
    </div>
  );
}
