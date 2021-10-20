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
    redirect: "/welcome",
  },
  {
    path: "/settings",
    component: () => import("@/views/Settings/index.vue"),
  },
  {
    path: "/profile",
    component: () => import("@/views/Settings/subViews/Profile.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/tab",
    component: () => import("@/views/Tab1.vue"),
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
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
