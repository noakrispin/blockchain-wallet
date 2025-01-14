# Blockchain Multi-Currency HD Wallet

A React-based multi-currency HD wallet built with Vite and Tailwind CSS. This application supports Bitcoin and Ethereum, allowing users to create, restore, and manage wallets, check balances, and send signed transactions. It leverages shared node APIs like [Infura](https://infura.io/) and [NowNodes](https://nownodes.io/) for blockchain interactions.

## Features
- Create new HD wallets with mnemonic phrases.
- Restore existing wallets using recovery phrases.
- View balances for supported currencies (Bitcoin, Ethereum).
- Send signed transactions.
- Responsive and modern UI with Tailwind CSS.
- QR code support for transaction details.

## Technologies Used
- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons, Lucide Icons
- **Blockchain APIs**: Infura, NowNodes
- **QR Code Generation**: qrcode.react

## Installation

1. Clone the repository:
    git clone https://github.com/noakr/blockchain-wallet.git
    cd blockchain-wallet
2. Install dependencies:
    npm install
3. Start the development server:
    npm run dev
4. Open the application in your browser:
    http://localhost:3000


## Usage
- Create a Wallet: Click the "Create New Wallet" button on the home screen to generate a new wallet.
- Restore a Wallet: Use the "Restore Wallet" option to recover an existing wallet using a mnemonic phrase.
- Open an Existing Wallet: Load a previously created wallet and view its details.
- Check Balances: View current balances of Bitcoin and Ethereum wallets.
- Send Transactions: Send cryptocurrency to other addresses securely.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Live Demo
Check out the live version of the application: [Live Demo](https://blockchain-esu7r19fy-noa-krispins-projects.vercel.app)