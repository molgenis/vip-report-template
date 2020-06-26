import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import About from "@/views/About.vue";
import Samples from "@/views/Samples.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    redirect: { name: "samples" }
  },
  {
    path: "/samples/:id?",
    name: "samples",
    component: Samples
  },
  {
    path: "/about",
    name: "about",
    component: About
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
