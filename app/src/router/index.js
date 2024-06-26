import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/LandingPage.vue";
import InfluencerPage from "../pages/InfluencerPage.vue";
import InfluencerProfile from "../pages/InfluencerProfile.vue";
import ContractPage from "../pages/ContractPage.vue";
import CpmContract from "../pages/CpmContract.vue";
import NotFound from "../pages/NotFound.vue";
import Builder from "../pages/WebBuilder.vue";
import InfluencerRegister from "../pages/InfluencerRegister.vue";
import BrandPage from "../pages/BrandPage.vue";
import BrandRegister from "../pages/BrandRegister.vue";
import BrandProfile from "../pages/BrandProfile.vue";

const routes = [
  {
    path: "/influencer/register",
    name: "influencer register",
    component: InfluencerRegister,
  },
  {
    path: "/brand/register",
    name: "brand register",
    component: BrandRegister,
  },

  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/influencers",
    name: "influencers",
    component: InfluencerPage,
  },
  {
    path: "/brands",
    name: "Brands",
    component: BrandPage,
  },
  {
    path: "/brand/:id",
    name: "Brand profile",
    component: BrandProfile,
  },
  {
    path: "/influencer/:id",
    name: "InfluencerProfile",
    component: InfluencerProfile,
  },
  {
    path: "/cpm-contract/:id",
    name: "CPM Contract",
    component: CpmContract,
  },
  {
    path: "/contract/:id",
    name: "Contract",
    component: ContractPage,
  },
  {
    path: "/builder",
    name: "Builder",
    component: Builder,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});
export default router;
