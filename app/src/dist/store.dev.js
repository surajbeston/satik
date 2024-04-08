"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _vue = require("vue");

var store = (0, _vue.reactive)({
  products: [{
    id: 1,
    productImage: "",
    productName: "",
    influencerAmount: 0,
    totalAmount: 0,
    productDescription: ""
  }],
  currentUserLoaded: false,
  currentUserType: "",
  currentUser: null
});
exports.store = store;