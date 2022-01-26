import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Variants from "../components/Variants.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: { name: "variants" },
  },
  {
    path: "/variants",
    name: "variants",
    component: Variants,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
