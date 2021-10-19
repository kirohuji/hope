import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../layout/index.vue";
import Welcome from "../views/Welcome/index.vue";
const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   redirect: "/main/library",
  // // },
  {
    path: "/",
    redirect: "/welcome"
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/main/",
    component: Tabs,
    children: [
      {
        path: "",
        redirect: "/main/library",
      },
      {
        path: "library",
        component: () => import("@/views/Library/index.vue"),
      },
      {
        path: "personal",
        component: () => import("@/views/Personal/index.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
