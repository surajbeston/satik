"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var spl_token_1 = require("@solana/spl-token");
var anchor_1 = require("@project-serum/anchor");
var idl_json_1 = require("../idl.json");
var web3_js_1 = require("@solana/web3.js");
var solana_connect_1 = require("solana-connect");
//@ts-ignore
var _esm_1 = require("https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.13/+esm");
var commitment = "confirmed";
var preflightCommitment = "processed";
var programID = new web3_js_1.PublicKey(idl_json_1["default"].metadata.address);
var connection = new web3_js_1.Connection(web3_js_1.clusterApiUrl("devnet"), commitment);
var solConnect = new solana_connect_1.SolanaConnect();
solConnect.openMenu();
var program;
var wallet;
var provider;
solConnect.onWalletChange(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        wallet = solConnect.getWallet();
        //@ts-ignore
        provider = new anchor_1.AnchorProvider(connection, wallet, {
            preflightCommitment: preflightCommitment,
            commitment: commitment
        });
        program = getProgram(provider);
        return [2 /*return*/];
    });
}); });
solConnect.onVisibilityChange(function (isOpen) {
    console.log("menu visible:", isOpen);
});
function getProgram(provider) {
    // @ts-ignore
    var program = new anchor_1.Program(idl_json_1["default"], programID, provider);
    return program;
}
// @ts-ignore
function purchase(productAddressString) {
    return __awaiter(this, void 0, void 0, function () {
        var mint, productAddress, product, proposalAddress, proposal, purchaseId, _a, purchaseAddress, bump, escrow, customer_ATA, url, response, data, error_1, rent, tx4, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mint = new web3_js_1.PublicKey("8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy");
                    productAddress = new web3_js_1.PublicKey(productAddressString);
                    return [4 /*yield*/, program.account.product.fetch(productAddress)];
                case 1:
                    product = _b.sent();
                    proposalAddress = product.proposal;
                    return [4 /*yield*/, program.account.proposal.fetch(proposalAddress)];
                case 2:
                    proposal = _b.sent();
                    purchaseId = Math.random().toString(36).slice(2);
                    _a = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(purchaseId)], program.programId), purchaseAddress = _a[0], bump = _a[1];
                    console.log("product", product);
                    console.log("purchase address ", purchaseAddress.toBase58());
                    console.log("bump ", bump);
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mint, purchaseAddress, true)];
                case 3:
                    escrow = _b.sent();
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mint, wallet === null || wallet === void 0 ? void 0 : wallet.publicKey)];
                case 4:
                    customer_ATA = _b.sent();
                    url = "https://satik-redeemer-demo.onrender.com/mint?address=" + customer_ATA.toBase58() + "&amount=" + product.totalAmount.toNumber();
                    console.log(url);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, fetch(url)];
                case 6:
                    response = _b.sent();
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return [4 /*yield*/, response.json()];
                case 7:
                    data = _b.sent();
                    console.log(data);
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _b.sent();
                    console.error('There was a problem with the fetch operation:', error_1);
                    return [3 /*break*/, 9];
                case 9:
                    rent = new web3_js_1.PublicKey("SysvarRent111111111111111111111111111111111");
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    _esm_1.toast("Purchase initiated. Please sign the transaction.", { autoClose: 2000, type: "info" });
                    return [4 /*yield*/, program.methods
                            .purchase(purchaseId)
                            .accounts({
                            purchase: purchaseAddress,
                            proposal: proposalAddress,
                            product: productAddress,
                            brandAta: proposal.brandAta,
                            influencerAta: proposal.influencerAta,
                            customerAta: customer_ATA,
                            usdcTokenAccount: escrow,
                            mint: mint,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            rent: rent
                        })
                            .rpc()];
                case 11:
                    tx4 = _b.sent();
                    console.log(tx4);
                    _esm_1.toast("Product purchased.", { autoClose: 2000, type: "success" });
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _b.sent();
                    console.log(error_2);
                    _esm_1.toast("Something went wrong", { autoClose: 2000, type: "error" });
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function addListeners() {
    var _this = this;
    var products = document.querySelectorAll('[class^="product-"]');
    products.forEach(function (product) {
        product.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var address;
            var _a;
            return __generator(this, function (_b) {
                _esm_1.toast("Purchasing...", { autoClose: 2000 });
                address = (_a = product.getAttribute("class")) === null || _a === void 0 ? void 0 : _a.replace("product-", "");
                try {
                    purchase(address);
                }
                catch (error) {
                    console.log(error);
                    _esm_1.toast("Something went wrong", { autoClose: 2000, type: "error" });
                }
                return [2 /*return*/];
            });
        }); });
    });
}
addListeners();
// const program =  new Program(idl, programID, provider.value)
