import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import axios from "axios";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({ loggedInUser: state.loggedInUser }),
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errors: [],
    loggedInUser: null,
  },
  mutations: {
    addError(state, error) {
      state.errors.push(error);
    },
    deleteError(state, errorIndex) {
      state.errors.splice(errorIndex, 1);
    },
    setLoggedInUser(state, user) {
      state.loggedInUser = user;
    },
    deleteLoggedInUser(state) {
      state.loggedInUser = null;
    },
  },
  actions: {
    logout({ commit }) {
      axios
        .post("http://localhost/api/logout")
        .then(() => {
          commit("deleteLoggedInUser");
        })
        .catch(() => {
          commit("deleteLoggedInUser");
        });
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
