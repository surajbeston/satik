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
var bn_js_1 = require("bn.js");
var chai_1 = require("chai");
describe("satik", function () {
    anchor.setProvider(anchor.AnchorProvider.env());
    var program = anchor.workspace.Satik;
    it("Initialize brand and influencer, create proposal and accept it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var BRAND_USERNAME, brandAddress, INFLUENCER_USERNAME, influencerAddress, tx, brand, tx1, influencer, proposalKeyPair, tx2, fetchedProposal, products, _i, products_1, product, productKeyPair, tx3_1, tx3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BRAND_USERNAME = (Math.random() + 1).toString(36).substring(7);
                    brandAddress = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(BRAND_USERNAME)], program.programId)[0];
                    console.log("Address of brand is: ", brandAddress.toBase58());
                    INFLUENCER_USERNAME = (Math.random() + 1).toString(36).substring(7);
                    influencerAddress = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(INFLUENCER_USERNAME)], program.programId)[0];
                    return [4 /*yield*/, program.methods.initializeBrand(BRAND_USERNAME, 'Not Brand', 'https://image.com/image.jpeg', "This my brand bio.")
                            .accounts({
                            brand: brandAddress
                        })
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    console.log("This is the transaction of brand: ", tx);
                    return [4 /*yield*/, program.account.brand.fetch(brandAddress)];
                case 2:
                    brand = _a.sent();
                    chai_1.assert(brand.username, BRAND_USERNAME);
                    return [4 /*yield*/, program.methods
                            .initializeInfluencer(INFLUENCER_USERNAME, 'Not Influencer', 'https://image.com/image.image', "I'm not a real influencer -)")
                            .accounts({
                            influencer: influencerAddress
                        })
                            .rpc()];
                case 3:
                    tx1 = _a.sent();
                    console.log("This is the transaction of influencer: ", tx1);
                    return [4 /*yield*/, program.account.influencer.fetch(influencerAddress)];
                case 4:
                    influencer = _a.sent();
                    chai_1.assert(influencer, INFLUENCER_USERNAME);
                    proposalKeyPair = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, program.methods.initializeProposal("website", "message")
                            .accounts({
                            proposal: proposalKeyPair.publicKey,
                            brand: brandAddress,
                            influencer: influencerAddress
                        })
                            .signers([proposalKeyPair])
                            .rpc()];
                case 5:
                    tx2 = _a.sent();
                    console.log("This is the address of proposal: ", proposalKeyPair.publicKey.toBase58());
                    console.log("This is the transaction of proposal:", tx2);
                    return [4 /*yield*/, program.account.proposal.fetch(proposalKeyPair.publicKey)];
                case 6:
                    fetchedProposal = _a.sent();
                    if (fetchedProposal.accepted !== false) {
                        throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
                    }
                    products = [{ "name": "Suraj Jha", "description": "This is suraj", "total_amount": 1000, "influencer_amount": 500 }];
                    _i = 0, products_1 = products;
                    _a.label = 7;
                case 7:
                    if (!(_i < products_1.length)) return [3 /*break*/, 10];
                    product = products_1[_i];
                    productKeyPair = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, program.methods.initializeProduct("product 1", "description", new bn_js_1.BN(123), new bn_js_1.BN(23))
                            .accounts({
                            product: productKeyPair.publicKey,
                            proposal: proposalKeyPair.publicKey
                        })
                            .signers([productKeyPair])
                            .rpc()];
                case 8:
                    tx3_1 = _a.sent();
                    console.log("This is the address of product: ", productKeyPair.publicKey.toBase58());
                    console.log("This is the transaction of product:", tx3_1);
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, program.methods.acceptProposal()
                        .accounts({
                        proposal: proposalKeyPair.publicKey
                    })
                        .rpc()];
                case 11:
                    tx3 = _a.sent();
                    console.log("Transaction while accepting proposal: ", tx3);
                    return [4 /*yield*/, program.account.proposal.fetch(proposalKeyPair.publicKey)];
                case 12:
                    fetchedProposal = _a.sent();
                    if (fetchedProposal.accepted !== true) {
                        throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
