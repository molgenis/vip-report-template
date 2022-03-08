import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Variants from "../views/Variants.vue";
import Vcf from "../views/Vcf.vue";
import DecisionTree from "../views/DecisionTree.vue";
import Variant from "../views/Variant.vue";

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
    path: "/variants/:variantId",
    name: "variant",
    component: Variant,
  },
  {
    path: "/data/tree",
    name: "tree",
    component: DecisionTree,
  },
  {
    path: "/data/vcf",
    name: "vcf",
    component: Vcf,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
