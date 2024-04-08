"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.acceptInfluencerProposal = exports.getProposalProducts = exports.getInfluencerCPMContracts = exports.getBrandCPMContracts = exports.getInfluencerProposals = exports.getBrandProposals = exports.getCurrentUser = exports.fetchInfluencerByUsername = exports.fetchBrandByUsername = exports.fetchAllBrands = exports.fetchAllInfluencers = exports.scheduleCPMFeed = exports.acceptCPMContract = exports.createCPMContract = exports.addProposalWebpage = exports.initializeProduct = exports.acceptProposal = exports.initializeProposalWithProducts = exports.initializeProposal = exports.createBrandAccount = exports.createInfluencerAccount = void 0;
var spl_token_1 = require("@solana/spl-token");
var anchor = require("@coral-xyz/anchor");
var useWorkspace_1 = require("./useWorkspace");
var web3_js_1 = require("@solana/web3.js");
var solana_wallets_vue_1 = require("solana-wallets-vue");
var web3_js_2 = require("@solana/web3.js");
var buffer_1 = require("buffer");
var bn_js_1 = require("bn.js");
var mintAddress = new web3_js_2.PublicKey("8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy");
var _a = useWorkspace_1["default"](), wallet = _a.wallet, program = _a.program;
function createInfluencerAccount(username, name, profile_image, bio, total_followers, social_media) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, influencerAddress, bump, publicKey, influencerATA, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("reached here");
                    _a = anchor.web3.PublicKey.findProgramAddressSync([buffer_1.Buffer.from(username)], program.value.programId), influencerAddress = _a[0], bump = _a[1];
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mintAddress, publicKey.value)];
                case 1:
                    influencerATA = _b.sent();
                    return [4 /*yield*/, program.value.methods
                            .initializeInfluencer(username, name, profile_image, bio, new bn_js_1.BN(total_followers), social_media)
                            .accounts({
                            usdcAta: influencerATA,
                            influencer: influencerAddress,
                            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            mint: mintAddress,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY
                        })
                            .rpc()];
                case 2:
                    tx = _b.sent();
                    console.log(tx);
                    return [2 /*return*/];
            }
        });
    });
}
exports.createInfluencerAccount = createInfluencerAccount;
function createBrandAccount(username, name, profile_image, bio) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, brandAddress, bump, publicKey, brandATA, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = anchor.web3.PublicKey.findProgramAddressSync([buffer_1.Buffer.from(username)], program.value.programId), brandAddress = _a[0], bump = _a[1];
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mintAddress, publicKey.value)];
                case 1:
                    brandATA = _b.sent();
                    return [4 /*yield*/, program.value.methods
                            .initializeBrand(username, name, profile_image, bio)
                            .accounts({
                            usdcAta: brandATA,
                            brand: brandAddress,
                            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            mint: mintAddress,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY
                        })
                            .rpc({
                            skipPreflight: true
                        })];
                case 2:
                    tx = _b.sent();
                    console.log(tx);
                    return [2 /*return*/];
            }
        });
    });
}
exports.createBrandAccount = createBrandAccount;
function initializeProposal(message, influencerAddress, brandAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var proposal, publicKey, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    proposal = new anchor.web3.Keypair();
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    return [4 /*yield*/, program.value.methods
                            .initializeProposal(message, publicKey.value)
                            .accounts({
                            proposal: proposal.publicKey,
                            brand: brandAddress,
                            influencer: influencerAddress
                        })
                            .signers([proposal])
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, proposal.publicKey];
            }
        });
    });
}
exports.initializeProposal = initializeProposal;
function initializeProposalWithProducts(message, influencerAddress, brandAddress, products, redeemerURL) {
    return __awaiter(this, void 0, void 0, function () {
        var proposal, publicKey, instructions, instructionSigners, _i, products_1, product, productAddress, _a, _b, proposalTransaction;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    proposal = new anchor.web3.Keypair();
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    instructions = [];
                    instructionSigners = [];
                    _i = 0, products_1 = products;
                    _c.label = 1;
                case 1:
                    if (!(_i < products_1.length)) return [3 /*break*/, 4];
                    product = products_1[_i];
                    productAddress = new anchor.web3.Keypair();
                    _b = (_a = instructions).push;
                    return [4 /*yield*/, program.value.methods
                            .initializeProduct(product.productName, product.productDescription, new bn_js_1.BN(product.totalAmount * Math.pow(10, 6)), new bn_js_1.BN(product.influencerAmount * Math.pow(10, 6)))
                            .accounts({
                            product: productAddress.publicKey,
                            proposal: proposal.publicKey
                        })
                            .instruction()];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    instructionSigners.push(productAddress);
                    product.productAddress = productAddress.publicKey.toBase58();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, program.value.methods
                        .initializeProposal(message, publicKey.value, redeemerURL)
                        .accounts({
                        proposal: proposal.publicKey,
                        brand: brandAddress,
                        influencer: influencerAddress
                    })
                        .postInstructions(instructions)
                        .signers(__spreadArrays([proposal], instructionSigners))
                        .rpc()];
                case 5:
                    proposalTransaction = _c.sent();
                    console.log(proposalTransaction);
                    return [2 /*return*/, [products, proposal.publicKey.toBase58()]];
            }
        });
    });
}
exports.initializeProposalWithProducts = initializeProposalWithProducts;
function acceptProposal(proposalAddresString) {
    return __awaiter(this, void 0, void 0, function () {
        var proposal, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    proposal = new web3_js_2.PublicKey(proposalAddresString);
                    return [4 /*yield*/, program.value.methods
                            .acceptProposal()
                            .accounts({
                            proposal: proposal
                        })
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    console.log(tx);
                    return [2 /*return*/];
            }
        });
    });
}
exports.acceptProposal = acceptProposal;
function initializeProduct(name, description, totalAmount, influencerAmount, proposalAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var product, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product = web3_js_1.Keypair.generate();
                    return [4 /*yield*/, program.value.methods
                            .initializeProduct(name, description, totalAmount * Math.pow(10, 6), influencerAmount * Math.pow(10, 6))
                            .accounts({
                            product: product.publicKey,
                            proposal: proposalAddress
                        })
                            .signers([product])
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, product.publicKey];
            }
        });
    });
}
exports.initializeProduct = initializeProduct;
function addProposalWebpage(proposalAddressString, webpage) {
    return __awaiter(this, void 0, void 0, function () {
        var proposalAddress, proposalFetched, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    proposalAddress = new web3_js_2.PublicKey(proposalAddressString);
                    return [4 /*yield*/, program.value.account.proposal.fetch(proposalAddress)];
                case 1:
                    proposalFetched = _a.sent();
                    console.log("Fetched Proposal old", proposalFetched);
                    return [4 /*yield*/, program.value.methods
                            .addProposalWebpage(webpage)
                            .accounts({
                            proposal: proposalAddress
                        })
                            .rpc()];
                case 2:
                    tx = _a.sent();
                    console.log(tx);
                    return [4 /*yield*/, program.value.account.proposal.fetch(proposalAddress)];
                case 3:
                    proposalFetched = _a.sent();
                    console.log("Fetched Proposal", proposalFetched);
                    return [2 /*return*/];
            }
        });
    });
}
exports.addProposalWebpage = addProposalWebpage;
function createCPMContract(influencerPk, brandPk, params) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey, dealPDA, dealUsdcAta, brandATA, data, perReachAmount, accounts, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    dealPDA = web3_js_2.PublicKey.findProgramAddressSync([
                        buffer_1.Buffer.from("deal_seed"),
                        buffer_1.Buffer.from(params.uniqueId),
                        brandPk.toBytes(),
                        influencerPk.toBytes(),
                    ], program.value.programId)[0];
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mintAddress, dealPDA, true)];
                case 1:
                    dealUsdcAta = _a.sent();
                    return [4 /*yield*/, spl_token_1.getAssociatedTokenAddress(mintAddress, publicKey.value)];
                case 2:
                    brandATA = _a.sent();
                    data = {};
                    perReachAmount = params.cpm * 1000;
                    data.initialAmount = params.initialAmount
                        ? new bn_js_1.BN(params.initialAmount)
                        : null;
                    data.initialAmountOnReach = params.initialAmountOnReach
                        ? new bn_js_1.BN(params.initialAmountOnReach)
                        : null;
                    data = __assign(__assign({}, data), { idSeed: params.uniqueId, startsOn: new bn_js_1.BN(params.startsOn.getTime() / 1000), startsOnReach: new bn_js_1.BN(params.startsOnReach), endsOn: new bn_js_1.BN(Math.trunc(params.endsOn.getTime() / 1000)), endsOnReach: new bn_js_1.BN(params.endsOnReach), cpm: new bn_js_1.BN(perReachAmount) });
                    accounts = {
                        deal: dealPDA,
                        dealUsdcAta: dealUsdcAta,
                        brandUsdcAta: brandATA,
                        brand: brandPk,
                        influencer: influencerPk,
                        payer: publicKey.value,
                        mint: mintAddress
                    };
                    return [4 /*yield*/, program.value.methods
                            .createDeal(data)
                            .accounts(accounts)
                            .rpc()];
                case 3:
                    tx = _a.sent();
                    console.log(tx);
                    console.log("Deal created !");
                    return [2 /*return*/];
            }
        });
    });
}
exports.createCPMContract = createCPMContract;
function acceptCPMContract(influencerPk, dealPk, contentUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    return [4 /*yield*/, program.value.methods
                            .acceptDeal(contentUrl)
                            .accounts({
                            influencer: new web3_js_2.PublicKey(influencerPk),
                            deal: dealPk,
                            signer: publicKey.value
                        })
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    console.log("Deal accepted !");
                    return [2 /*return*/];
            }
        });
    });
}
exports.acceptCPMContract = acceptCPMContract;
function scheduleCPMFeed(dealPk) {
    return __awaiter(this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.methods
                        .scheduleFeedMock()
                        .accounts({
                        deal: dealPk,
                        signer: wallet.value.publicKey
                    })
                        .rpc()];
                case 1:
                    tx = _a.sent();
                    console.log("CPM Feed Scheduled !");
                    return [2 /*return*/];
            }
        });
    });
}
exports.scheduleCPMFeed = scheduleCPMFeed;
function fetchAllInfluencers() {
    return __awaiter(this, void 0, void 0, function () {
        var influencers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.account.influencer.all()];
                case 1:
                    influencers = _a.sent();
                    return [2 /*return*/, influencers];
            }
        });
    });
}
exports.fetchAllInfluencers = fetchAllInfluencers;
function fetchAllBrands() {
    return __awaiter(this, void 0, void 0, function () {
        var brands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.account.brand.all()];
                case 1:
                    brands = _a.sent();
                    return [2 /*return*/, brands];
            }
        });
    });
}
exports.fetchAllBrands = fetchAllBrands;
function fetchBrandByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var brands, _i, brands_1, brand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchAllBrands()];
                case 1:
                    brands = _a.sent();
                    for (_i = 0, brands_1 = brands; _i < brands_1.length; _i++) {
                        brand = brands_1[_i];
                        if (brand.account.username == username)
                            return [2 /*return*/, brand];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.fetchBrandByUsername = fetchBrandByUsername;
function fetchInfluencerByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var influencers, _i, influencers_1, influencer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchAllInfluencers()];
                case 1:
                    influencers = _a.sent();
                    for (_i = 0, influencers_1 = influencers; _i < influencers_1.length; _i++) {
                        influencer = influencers_1[_i];
                        if (influencer.account.username == username)
                            return [2 /*return*/, influencer];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.fetchInfluencerByUsername = fetchInfluencerByUsername;
function getCurrentUser() {
    return __awaiter(this, void 0, void 0, function () {
        var influencers, publicKey, _i, influencers_2, influencer, brands, _a, brands_2, brand;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetchAllInfluencers()];
                case 1:
                    influencers = _b.sent();
                    publicKey = solana_wallets_vue_1.useWallet().publicKey;
                    // console.log(publicKey.value.toBase58())
                    console.log("inside curent user", publicKey.value);
                    // console.log(publicKey.value.toBase58())
                    for (_i = 0, influencers_2 = influencers; _i < influencers_2.length; _i++) {
                        influencer = influencers_2[_i];
                        if (influencer.account.createdBy.toBase58() == publicKey.value.toBase58()) {
                            return [2 /*return*/, ["Influencer", influencer]];
                        }
                    }
                    return [4 /*yield*/, fetchAllBrands()];
                case 2:
                    brands = _b.sent();
                    for (_a = 0, brands_2 = brands; _a < brands_2.length; _a++) {
                        brand = brands_2[_a];
                        if (brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
                            return [2 /*return*/, ["Brand", brand]];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCurrentUser = getCurrentUser;
function getBrandProposals(brandAddressString) {
    return __awaiter(this, void 0, void 0, function () {
        var allProposals, brandProposals, _i, allProposals_1, proposal, influencers, _a, brandProposals_1, proposal, proposalInfluencerKey, _b, influencers_3, influencer, influencerKey;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, program.value.account.proposal.all()];
                case 1:
                    allProposals = _c.sent();
                    brandProposals = [];
                    for (_i = 0, allProposals_1 = allProposals; _i < allProposals_1.length; _i++) {
                        proposal = allProposals_1[_i];
                        if (proposal.account.createdBy.toBase58() === brandAddressString) {
                            brandProposals.push(proposal);
                        }
                    }
                    return [4 /*yield*/, fetchAllInfluencers()];
                case 2:
                    influencers = _c.sent();
                    for (_a = 0, brandProposals_1 = brandProposals; _a < brandProposals_1.length; _a++) {
                        proposal = brandProposals_1[_a];
                        proposalInfluencerKey = proposal.account.influencerKey.toBase58();
                        for (_b = 0, influencers_3 = influencers; _b < influencers_3.length; _b++) {
                            influencer = influencers_3[_b];
                            influencerKey = influencer.account.createdBy.toBase58();
                            if (proposalInfluencerKey === influencerKey) {
                                proposal.account.influencer = influencer.account;
                            }
                        }
                    }
                    return [2 /*return*/, brandProposals];
            }
        });
    });
}
exports.getBrandProposals = getBrandProposals;
function getInfluencerProposals(influencerAddressString) {
    return __awaiter(this, void 0, void 0, function () {
        var allProposals, influencerProposals, _i, allProposals_2, proposal, _a, influencerProposals_1, proposal, brand;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, program.value.account.proposal.all()];
                case 1:
                    allProposals = _b.sent();
                    influencerProposals = [];
                    for (_i = 0, allProposals_2 = allProposals; _i < allProposals_2.length; _i++) {
                        proposal = allProposals_2[_i];
                        if (proposal.account.influencerKey.toBase58() == influencerAddressString) {
                            influencerProposals.push(proposal);
                        }
                    }
                    _a = 0, influencerProposals_1 = influencerProposals;
                    _b.label = 2;
                case 2:
                    if (!(_a < influencerProposals_1.length)) return [3 /*break*/, 5];
                    proposal = influencerProposals_1[_a];
                    return [4 /*yield*/, program.value.account.brand.fetch(proposal.account.brand)];
                case 3:
                    brand = _b.sent();
                    proposal.account.brand = brand;
                    _b.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, influencerProposals];
            }
        });
    });
}
exports.getInfluencerProposals = getInfluencerProposals;
function getBrandCPMContracts(address) {
    return __awaiter(this, void 0, void 0, function () {
        var allCPMContracts, _i, allCPMContracts_1, deal, influencer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.account.deal.all()];
                case 1:
                    allCPMContracts = _a.sent();
                    allCPMContracts = allCPMContracts.filter(function (e) {
                        return e.account.brand.toBase58() == address;
                    });
                    _i = 0, allCPMContracts_1 = allCPMContracts;
                    _a.label = 2;
                case 2:
                    if (!(_i < allCPMContracts_1.length)) return [3 /*break*/, 5];
                    deal = allCPMContracts_1[_i];
                    return [4 /*yield*/, program.value.account.influencer.fetch(deal.account.influencer)];
                case 3:
                    influencer = _a.sent();
                    deal.account.influencer = influencer;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, allCPMContracts];
            }
        });
    });
}
exports.getBrandCPMContracts = getBrandCPMContracts;
function getInfluencerCPMContracts(address) {
    return __awaiter(this, void 0, void 0, function () {
        var allCPMContracts, _i, allCPMContracts_2, deal, brand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.account.deal.all()];
                case 1:
                    allCPMContracts = _a.sent();
                    allCPMContracts = allCPMContracts.filter(function (e) {
                        return e.account.influencer.toBase58() == address;
                    });
                    _i = 0, allCPMContracts_2 = allCPMContracts;
                    _a.label = 2;
                case 2:
                    if (!(_i < allCPMContracts_2.length)) return [3 /*break*/, 5];
                    deal = allCPMContracts_2[_i];
                    return [4 /*yield*/, program.value.account.brand.fetch(deal.account.brand)];
                case 3:
                    brand = _a.sent();
                    deal.account.brand = brand;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, allCPMContracts];
            }
        });
    });
}
exports.getInfluencerCPMContracts = getInfluencerCPMContracts;
function getProposalProducts(proposalAddressString) {
    return __awaiter(this, void 0, void 0, function () {
        var allProducts, proposalProducts, _i, allProducts_1, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.account.product.all()];
                case 1:
                    allProducts = _a.sent();
                    proposalProducts = [];
                    for (_i = 0, allProducts_1 = allProducts; _i < allProducts_1.length; _i++) {
                        product = allProducts_1[_i];
                        if (product.account.proposal.toBase58() == proposalAddressString) {
                            proposalProducts.push(product);
                        }
                    }
                    return [2 /*return*/, proposalProducts];
            }
        });
    });
}
exports.getProposalProducts = getProposalProducts;
function acceptInfluencerProposal(proposal) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.value.methods
                        .acceptProposal()
                        .accounts({
                        proposal: proposal
                    })
                        .rpc()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.acceptInfluencerProposal = acceptInfluencerProposal;
