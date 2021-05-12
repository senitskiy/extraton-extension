import BackgroundApi from "@/api/background";
import {setWalletBySeedTask} from "@/lib/task/items";
import store from "@/store";
import {routes} from "@/plugins/router";

export default {
  namespaced: true,
  state: {
    isRestoring: false,
    error: null,
  },
  mutations: {
    setError: (state, error) => state.error = error,
    clearError: (state) => state.error = null,
    setRestoring: (state) => state.isRestoring = true,
    unsetRestoring: (state) => state.isRestoring = false,
    clear: (state) => {
      state.isRestoring = false;
      state.error = null;
    },
  },
  actions: {
    restore: async ({commit}, {seed, contractId, pass}) => {
      commit('clearError');
      commit('setRestoring');
      BackgroundApi.request(setWalletBySeedTask, {seed, contractId, isRestoring: true, pass})
        .then(async () => {
          await store.dispatch('wallet/wakeup', {name: routes.wallet, params: {}});
          commit('unsetRestoring');
        })
        .catch((e) => {
          const error = (typeof e === 'string') ? e : 'Failure during wallet entering.';
          commit('setError', error);
          commit('unsetRestoring');
        });
    },
  },
}
