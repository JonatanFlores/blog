export default {
  namespaced: true,
  state: {
    isToggled: false,
  },
  actions: {
    toggleNavigation({ commit }) {
      commit('TOGGLE_NAVIGATION');
    },
  },
  mutations: {
    TOGGLE_NAVIGATION(state) {
      state.isToggled = !state.isToggled;
    },
  },
};
