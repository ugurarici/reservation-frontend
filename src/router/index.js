import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.loggedInUser) {
    //  gitmeye çalıştığı sayfayı hafızada tut
    store.commit("setRedirectAfterLogin", to.path);
    next("/login");
  }

  if (to.meta.requiresVisitor && store.state.loggedInUser) {
    next("/");
  }

  if (to.meta.requiresAdmin && !store.state.loggedInUser.is_admin) {
    next("/");
  }

  next();
});

export default router;
