import 'buffer';
import { createApp } from "vue";
import "./style.css";
import "vue3-toastify/dist/index.css";
import router from "./router/index";
import Vue3Toastify from "vue3-toastify";
import App from "./App.vue";
import SolanaWallets from "solana-wallets-vue";
import "solana-wallets-vue/styles.css";
import { Buffer } from 'buffer'
import { initWallet } from "solana-wallets-vue";



// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// import {
//   PhantomWalletAdapter,
// } from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    // new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

initWallet(walletOptions);

const app = createApp(App);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 300,
});
app.use(SolanaWallets, walletOptions)
app.mount("#app");

