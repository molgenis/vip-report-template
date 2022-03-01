import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Variants from "../components/Variants.vue";
import Vcf from "../views/Vcf.vue";

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
  {
    path: "/vcf",
    name: "vcf",
    component: Vcf,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
