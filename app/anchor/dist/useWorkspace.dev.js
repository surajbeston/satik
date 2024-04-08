"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = require("vue");

var _solanaWalletsVue = require("solana-wallets-vue");

var _web = require("@solana/web3.js");

var _anchor = require("@coral-xyz/anchor");

var _satik = _interopRequireDefault(require("../../target/idl/satik.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var preflightCommitment = "processed";
var commitment = "confirmed";
var programID = new _web.PublicKey(_satik["default"].metadata.address);
var walletOptions = {
  wallets: [// new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true
};
(0, _solanaWalletsVue.initWallet)(walletOptions);

function initWorkspace() {
  var wallet = (0, _solanaWalletsVue.useAnchorWallet)();
  var connection = new _web.Connection("https://devnet.helius-rpc.com/?api-key=f34375fa-df6a-425f-8515-e619ad9c9839", commitment);
  var provider = (0, _vue.computed)(function () {
    return new _anchor.AnchorProvider(connection, wallet.value, {
      preflightCommitment: preflightCommitment,
      commitment: commitment
    });
  });
  var program = (0, _vue.computed)(function () {
    return new _anchor.Program(_satik["default"], programID, provider.value);
  });
  return {
    wallet: wallet,
    connection: connection,
    provider: provider,
    program: program
  };
}

var _default = initWorkspace;
exports["default"] = _default;