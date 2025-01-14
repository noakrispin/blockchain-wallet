import { Wallet } from './wallet/Wallet';

import { CreateWallet } from './wallet/CreateWallet'; // Named export
import RestoreWallet from './wallet/RestoreWallet'; // Default export
import { OpenWallet } from './wallet/OpenWallet'; // Named export

export const pages = {
  home: <Wallet />,
  create: <CreateWallet />,
  open: <OpenWallet />,
  restore: <RestoreWallet />,
};
