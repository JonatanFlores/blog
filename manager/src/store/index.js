import Vue from 'vue';
import Vuex from 'vuex';

import navbar from './navbar';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    navbar,
  },
});
