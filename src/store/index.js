import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errors: [],
  },
  mutations: {
    addError(state, error) {
      state.errors.push(error);
    },
    deleteError(state, errorIndex) {
      state.errors.splice(errorIndex, 1);
    },
  },
  actions: {},
  modules: {},
});
