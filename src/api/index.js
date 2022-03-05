import axios from "axios";
import router from "../router";
import store from "../store";
import { handleDates } from "../helpers/handledates";

const apiclient = axios.create({
  baseURL: "http://localhost/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiclient.interceptors.request.use(
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
apiclient.interceptors.response.use(
  function (response) {
    handleDates(response.data);
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

export default apiclient;
