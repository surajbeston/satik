"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _buffer = require("buffer");

var _vue = require("vue");

require("./style.css");

require("vue3-toastify/dist/index.css");

var _index2 = _interopRequireDefault(require("./router/index"));

var _vue3Toastify = _interopRequireDefault(require("vue3-toastify"));

var _App = _interopRequireDefault(require("./App.vue"));

var _solanaWalletsVue = _interopRequireWildcard(require("solana-wallets-vue"));

require("solana-wallets-vue/styles.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import {
//   PhantomWalletAdapter,
// } from "@solana/wallet-adapter-wallets";
var walletOptions = {
  wallets: [// new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true
};
(0, _solanaWalletsVue.initWallet)(walletOptions);
var app = (0, _vue.createApp)(_App["default"]);
app.use(_index2["default"]);
app.use(_vue3Toastify["default"], {
  autoClose: 300
});
app.use(_solanaWalletsVue["default"], walletOptions);
app.mount("#app");