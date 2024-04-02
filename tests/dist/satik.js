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
var anchor = require("@coral-xyz/anchor");
var spl_token_1 = require("@solana/spl-token");
var bn_js_1 = require("bn.js");
var chai_1 = require("chai");
describe("satik", function () {
    anchor.setProvider(anchor.AnchorProvider.env());
    var program = anchor.workspace.Satik;
    //   program.provider.connection.onLogs(program.programId, (logs) => {
    //   for (var log of logs.logs) {
    //     if(log.includes("Program log:")) {
    //       log.replace("Program log: ", "");
    //       console.log(log);
    //     }
    //   }
    // })
    it("Initialize brand and influencer, create proposal and accept it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payer, mint, brandKP, brandATA, influencerKP, influencerATA, satikKP, satikATA, BRAND_USERNAME, brandAddress, INFLUENCER_USERNAME, influencerAddress, tx, brand, tx1, influencer, proposalKeyPair, tx2, fetchedProposal, products, productKeyPair, _i, products_1, product, tx3_1, tx3, customer_ATA, tx5, purchaseId, _a, purchaseAddress, bump, escrow, tx4, redeemDatetimeAddress, signer, tx6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payer = anchor.Wallet.local().payer;
                    return [4 /*yield*/, spl_token_1.createMint(program.provider.connection, payer, payer.publicKey, null, 6)];
                case 1:
                    mint = _b.sent();
                    console.log("-------------");
                    console.log("mint: ", mint.toBase58());
                    console.log("Token Program Id", spl_token_1.TOKEN_PROGRAM_ID);
                    console.log("Associated Token Program", spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
                    brandKP = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, spl_token_1.createAssociatedTokenAccount(program.provider.connection, payer, mint, brandKP.publicKey)];
                case 2:
                    brandATA = _b.sent();
                    console.log("Brand ATA: ", brandATA.toBase58());
                    influencerKP = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, spl_token_1.createAssociatedTokenAccount(program.provider.connection, payer, mint, influencerKP.publicKey)];
                case 3:
                    influencerATA = _b.sent();
                    console.log("Infuencer ATA: ", influencerATA.toBase58());
                    satikKP = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, spl_token_1.createAssociatedTokenAccount(program.provider.connection, payer, mint, satikKP.publicKey)];
                case 4:
                    satikATA = _b.sent();
                    console.log("Satik ATA: ", satikATA.toBase58());
                    BRAND_USERNAME = (Math.random() + 1).toString(36).substring(7);
                    brandAddress = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(BRAND_USERNAME)], program.programId)[0];
                    console.log("Address of brand is: ", brandAddress.toBase58());
                    INFLUENCER_USERNAME = (Math.random() + 1).toString(36).substring(7);
                    influencerAddress = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(INFLUENCER_USERNAME)], program.programId)[0];
                    return [4 /*yield*/, program.methods.initializeBrand(BRAND_USERNAME, 'Not Brand', 'https://image.com/image.jpeg', "This my brand bio.")
                            .accounts({
                            brand: brandAddress,
                            usdcAta: brandATA
                        })
                            .rpc()];
                case 5:
                    tx = _b.sent();
                    console.log("This is the transaction of brand: ", tx);
                    return [4 /*yield*/, program.account.brand.fetch(brandAddress)];
                case 6:
                    brand = _b.sent();
                    chai_1.assert(brand.username, BRAND_USERNAME);
                    return [4 /*yield*/, program.methods
                            .initializeInfluencer(INFLUENCER_USERNAME, 'Not Influencer', 'https://image.com/image.image', "I'm not a real influencer -)")
                            .accounts({
                            influencer: influencerAddress,
                            usdcAta: influencerATA
                        })
                            .rpc()];
                case 7:
                    tx1 = _b.sent();
                    console.log("This is the transaction of influencer: ", tx1);
                    return [4 /*yield*/, program.account.influencer.fetch(influencerAddress)];
                case 8:
                    influencer = _b.sent();
                    chai_1.assert(influencer, INFLUENCER_USERNAME);
                    proposalKeyPair = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, program.methods.initializeProposal("website", "message", payer.publicKey)
                            .accounts({
                            proposal: proposalKeyPair.publicKey,
                            brand: brandAddress,
                            influencer: influencerAddress
                        })
                            .signers([proposalKeyPair])
                            .rpc()];
                case 9:
                    tx2 = _b.sent();
                    console.log("This is the address of proposal: ", proposalKeyPair.publicKey.toBase58());
                    console.log("This is the transaction of proposal:", tx2);
                    return [4 /*yield*/, program.account.proposal.fetch(proposalKeyPair.publicKey)];
                case 10:
                    fetchedProposal = _b.sent();
                    if (fetchedProposal.accepted !== false) {
                        throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
                    }
                    products = [{ "name": "Suraj Jha", "description": "This is suraj", "total_amount": 100000000, "influencer_amount": 20000000 }];
                    productKeyPair = anchor.web3.Keypair.generate();
                    _i = 0, products_1 = products;
                    _b.label = 11;
                case 11:
                    if (!(_i < products_1.length)) return [3 /*break*/, 14];
                    product = products_1[_i];
                    return [4 /*yield*/, program.methods.initializeProduct("product 1", "description", new bn_js_1.BN(product.total_amount), new bn_js_1.BN(product.influencer_amount))
                            .accounts({
                            product: productKeyPair.publicKey,
                            proposal: proposalKeyPair.publicKey
                        })
                            .signers([productKeyPair])
                            .rpc()];
                case 12:
                    tx3_1 = _b.sent();
                    console.log("This is the address of product: ", productKeyPair.publicKey.toBase58());
                    console.log("This is the transaction of product:", tx3_1);
                    _b.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14: return [4 /*yield*/, program.methods.acceptProposal()
                        .accounts({
                        proposal: proposalKeyPair.publicKey
                    })
                        .rpc()];
                case 15:
                    tx3 = _b.sent();
                    console.log("Transaction while accepting proposal: ", tx3);
                    return [4 /*yield*/, program.account.proposal.fetch(proposalKeyPair.publicKey)];
                case 16:
                    fetchedProposal = _b.sent();
                    if (fetchedProposal.accepted !== true) {
                        throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
                    }
                    console.log("Getting customer ATA...");
                    return [4 /*yield*/, spl_token_1.createAssociatedTokenAccount(program.provider.connection, payer, mint, payer.publicKey)];
                case 17:
                    customer_ATA = _b.sent();
                    console.log("Customer ATA: ", customer_ATA.toBase58());
                    return [4 /*yield*/, spl_token_1.mintTo(program.provider.connection, payer, mint, customer_ATA, payer.publicKey, 100000000)];
                case 18:
                    tx5 = _b.sent();
                    console.log("Transaction of minting: ", tx5);
                    purchaseId = Math.random().toString(36).slice(2);
                    _a = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(purchaseId)], program.programId), purchaseAddress = _a[0], bump = _a[1];
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mint, purchaseAddress, true)];
                case 19:
                    escrow = _b.sent();
                    console.log("Purchase address is: ", purchaseAddress.toBase58());
                    console.log("Escrow ATA is: ", escrow.toBase58());
                    return [4 /*yield*/, program.methods.purchase(purchaseId)
                            .accounts({
                            purchase: purchaseAddress,
                            proposal: proposalKeyPair.publicKey,
                            product: productKeyPair.publicKey,
                            brandAta: brandATA,
                            influencerAta: influencerATA,
                            customerAta: customer_ATA,
                            usdcTokenAccount: escrow,
                            mint: mint,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY
                        })
                            .signers([payer])
                            .rpc({
                            skipPreflight: true
                        })];
                case 20:
                    tx4 = _b.sent();
                    console.log("Transaction of purchase is: ", tx4);
                    redeemDatetimeAddress = anchor.web3.Keypair.generate();
                    signer = payer;
                    // await program.provider.connection.requestAirdrop(purchaseAddress, LAMPORTS_PER_SOL);
                    // while (true){
                    //   const purchaseBalance = await program.provider.connection.getBalance(purchaseAddress)
                    //   console.log("Purchase Balance: ", purchaseBalance);
                    //   if (purchaseBalance > 3166800) break
                    // }
                    console.log("Brand Receiver", brandATA.toBase58());
                    console.log("Purchase Address", purchaseAddress.toBase58());
                    console.log("Escrow Address", escrow.toBase58());
                    console.log("Purchase id ", purchaseId);
                    console.log("Bump is: ", bump);
                    return [4 /*yield*/, program.methods.redeemAmount(bump)
                            .accounts({
                            redeemDatetime: redeemDatetimeAddress.publicKey,
                            purchase: purchaseAddress,
                            brandReceiver: brandATA,
                            influencerReceiver: influencerATA,
                            satikReceiver: satikATA,
                            escrow: escrow,
                            mint: mint,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID
                        })
                            .signers([redeemDatetimeAddress, payer])
                            .rpc({
                            skipPreflight: true
                        })];
                case 21:
                    tx6 = _b.sent();
                    console.log("Transaction of redeem is: ", tx6);
                    return [2 /*return*/];
            }
        });
    }); });
});
