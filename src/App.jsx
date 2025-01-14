import React, { useReducer } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './components/Home';
import { CreateWallet } from './components/wallet/CreateWallet';
import { OpenWallet } from './components/wallet/OpenWallet';
import { RestoreWallet } from './components/wallet/RestoreWallet';
import { Dashboard } from './components/dashboard/Dashboard';
import Context from './utils/context';
import { ErrorBoundary } from './components/shared/Error';

const initialState = {
  wallet: null,
  view: 'home',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.param };
    case 'SET_VIEW':
      // Handle navigation based on view type
      if (action.param === 'home') {
        // Don't clear wallet when just going back
        return { ...state, view: action.param };
      }
      return { ...state, view: action.param };
    case 'EXIT':
      // Clear localStorage and reset state when exiting
      localStorage.removeItem('wallet');
      return initialState;
    case 'BACK':
      // Handle back navigation without clearing wallet
      return { ...state, view: action.param || 'home' };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const renderView = () => {
    switch (state.view) {
      case 'create':
        return <CreateWallet />;
      case 'open':
        return <OpenWallet />;
      case 'restore':
        return <RestoreWallet />;
      case 'dashboard':
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        );
      default:
        return <Home />;
    }
  };

  // Redirect to home if no wallet is set but trying to access dashboard
  React.useEffect(() => {
    if (state.view === 'dashboard' && !state.wallet) {
      dispatch({ type: 'SET_VIEW', param: 'home' });
    }
  }, [state.view, state.wallet]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <Layout>
        {renderView()}
      </Layout>
    </Context.Provider>
  );
}

export default App;

