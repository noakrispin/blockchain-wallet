import * as storage from '../utils/storage-utils'

export const initialState = {
    currentView: 'welcome', // welcome, create, restore, wallet-view
    wallet: null,
    error: '',
    isTestnet: true,
    tickers: null,
    balances: null,
    totalBalance: 0,
    selectedCoin: null,
    isSending: false,
    isSelected: false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_VIEW':
            return {
                ...state,
                currentView: action.payload
            }
        case 'SET_WALLET_DATA':
            return {
                ...state,
                wallet: action.payload.wallet,
                tickers: action.payload.tickers,
                balances: action.payload.balances,
                totalBalance: action.payload.totalBalance
            }
        case 'SELECT_COIN':
            return {
                ...state,
                selectedCoin: action.payload
            }
        case 'SET_COIN_SELECTION':
            return {
                ...state,
                isSelected: action.payload.isSelected,
                selectedCoin: action.payload.coin
            }
        case 'TOGGLE_SEND':
            return {
                ...state,
                isSending: action.payload
            }
        case 'SET_WALLET':
            return {
                ...state,
                wallet: action.payload,
                currentView: 'wallet-view'
            }
        case 'TOGGLE_NETWORK':
            return {
                ...state,
                isTestnet: action.payload
            }
        case 'UPDATE_TICKERS':
            return {
                ...state,
                tickers: action.payload
            }
        case 'UPDATE_BALANCES':
            return {
                ...state,
                balances: action.payload
            }
        case 'LOGOUT':
            storage.clearWalletData()
            return {
                ...state,
                wallet: null,
                currentView: 'welcome'
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state
    }
}

