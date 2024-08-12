import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Домашняя страница",
    },
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Вход",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL || "/",
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  let loggedInToken = localStorage.getItem("user_token");
  if (loggedInToken === "undefined") {
    localStorage.removeItem("user_token");
    loggedInToken = false;
  }
  if (authRequired && !loggedInToken) {
    document.title = "Вход";
    return next("/login");
  }
  document.title = to.meta.title;
  next();
});
export default router;
