import Vue from "vue";
import Vuex from "vuex";

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
  },
  actions: {},
  modules: {},
});
