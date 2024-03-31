import { createApp } from 'vue'
import './style.css'
import './index.css'

import App from './App.vue'


import SolanaWallets from "solana-wallets-vue";
import "solana-wallets-vue/styles.css";

import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
  ],
  autoConnect: true,
};

createApp(App).use(SolanaWallets, walletOptions).mount("#app");

