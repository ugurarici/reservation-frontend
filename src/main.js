import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    if (store.state.loggedInUser) {
      config.headers.Authorization = `Bearer ${store.state.loggedInUser.token}`; // Add authorization header
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status == 401) {
      store.commit("addError", error.response.data.message);
      store.commit("deleteLoggedInUser");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
