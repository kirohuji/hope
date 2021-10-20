import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import getPageTitle from "@/utils/get-page-title";
import { serviceContainer } from "@/composables/context-provider";
export const service = serviceContainer.authService;

NProgress.configure({ showSpinner: false }); 

const whiteList = ["/login", "/auth-redirect", "/register"]; 

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = localStorage.getItem("user");
  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done(); 
    } else {
      next();
      NProgress.done();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
