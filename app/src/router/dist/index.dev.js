"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _LandingPage = _interopRequireDefault(require("../pages/LandingPage.vue"));

var _CreatorPage = _interopRequireDefault(require("../pages/CreatorPage.vue"));

var _InfluencerProfile = _interopRequireDefault(require("../pages/InfluencerProfile.vue"));

var _ContractPage = _interopRequireDefault(require("../pages/ContractPage.vue"));

var _NotFound = _interopRequireDefault(require("../pages/NotFound.vue"));

var _WebBuilder = _interopRequireDefault(require("../pages/WebBuilder.vue"));

var _InfluencerRegister = _interopRequireDefault(require("../pages/InfluencerRegister.vue"));

var _BrandRegister = _interopRequireDefault(require("../pages/BrandRegister.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = [{
  path: "/influencer/register",
  name: "influencer register",
  component: _InfluencerRegister["default"]
}, {
  path: "/brand/register",
  name: "brand register",
  component: _BrandRegister["default"]
}, {
  path: "/",
  name: "Home",
  component: _LandingPage["default"]
}, {
  path: "/influencers",
  name: "Creators",
  component: _CreatorPage["default"]
}, {
  path: "/influencer/:id",
  name: "InfluencerProfile",
  component: _InfluencerProfile["default"]
}, {
  path: "/contract/:id",
  name: "Contract",
  component: _ContractPage["default"]
}, {
  path: "/builder",
  name: "Builder",
  component: _WebBuilder["default"]
}, {
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: _NotFound["default"]
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHistory)(),
  routes: routes,
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    return {
      top: 0
    };
  }
});
var _default = router;
exports["default"] = _default;