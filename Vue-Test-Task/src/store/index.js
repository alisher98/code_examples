import Vue from 'vue';
import Vuex from 'vuex';
import { GET_JOKES } from '@/const/urls';
import { http } from '@/modules/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jokes: [],
    categories: [],
  },
  mutations: {
    setJokes (state, data) {
      state.jokes = data.result;
    },
  },
  actions: {
    async fetchJokes ({ commit }, payload) {
      const config = { url: GET_JOKES, method: 'GET', params: {} };
      if (payload.query) {
        config.params.query = payload.query;
      }
      commit('setJokes', []);
      const { data } = await http.request(config);
      commit('setJokes', data);
    },
  },
  modules: {},
});
