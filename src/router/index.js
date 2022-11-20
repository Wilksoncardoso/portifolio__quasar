import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    // scrollBehavior: () => ({ left: 0, top: 0 }),
    // routes,

    history: createWebHistory(),
    routes,
    scrollBehavior: async (to, from, savedPosition) => {
      if (savedPosition) {
        console.log(savedPosition);

        return { left: 0, top: 0 };
      }

      const findEl = async (hash, top) => {
        return (
          document.querySelector(hash) ||
          new Promise((resolve, reject) => {
            if (top > 50) {
              return resolve();
            }
            setTimeout(() => {
              resolve(findEl(hash, ++top || 1));
            }, 100);
          })
        );
      };

      if (to.hash) {
        let el = await findEl(to.hash);
        if ("scrollBehavior" in document.documentElement.style) {
          return window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        } else {
          return window.scrollTo(0, el.offsetTop);
        }
      }

      return { left: 0, top: 0 };
    },

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  return Router;
});
