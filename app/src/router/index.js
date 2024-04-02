import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/LandingPage.vue";
import CreatorPage from "../pages/CreatorPage.vue";
import CreatorProfile from "../pages/CreatorProfile.vue";
import ContractPage from "../pages/ContractPage.vue";
import NotFound from "../pages/NotFound.vue";
import Builder from "../pages/WebBuilder.vue";
import CreatorLogin from "../pages/CreatorLogin.vue";
import BrandLogin from "../pages/BrandLogin.vue";

const routes = [
  {
    path: "/creator/register",
    name: "creator register",
    component: CreatorLogin,
  },
  {
    path: "/brand/register",
    name: "brand register",
    component: BrandLogin,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/creators",
    name: "Creators",
    component: CreatorPage,
  },
  {
    path: "/creator/:id",
    name: "CreatorProfile",
    component: CreatorProfile,
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
