import Vue from "vue";
import Vuex from "vuex";
import axios from "@/modules/axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    user: {},
    orders: [],
  },
  getters: {
    orders: (state) => state.orders,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("user_token", token);
    },
    setUser(state, user) {
      state.user = user;
    },
    setOrders(state, orders) {
      state.orders = orders;
    },
  },
  actions: {
    async login({ commit, dispatch }, user) {
      const { data } = await dispatch("http", {
        method: "POST",
        url: "api/auth/login/",
        data: user,
      });
      commit("setToken", data.key);
      commit("setUser", {
        username: user.username,
        employee_id: data.employee_id,
      });
    },
    async fetchOrders({ commit, dispatch }, query) {
      const { data } = await dispatch("http", {
        method: "GET",
        url: "api/appeals/v1.0/appeals",
        params: query,
      });
      commit("setOrders", data);
      return data;
    },
    async fetchApartments({ dispatch }, query) {
      const { data } = await dispatch("http", {
        method: "GET",
        url: "api/geo/v1.0/apartments",
        params: query,
      });
      return data;
    },
    async fetchPremises({ dispatch, commit }, query) {
      const { data } = await dispatch("http", {
        method: "GET",
        url: "api/geo/v2.0/user-premises",
        params: query,
      });
      commit("setPremises", data);
      return data;
    },
    async http(context, options) {
      try {
        return await axios.request(options);
      } catch (e) {
        if (e.response.status === 401) {
          localStorage.removeItem("user_token");
          window.location.href = "/login";
        }
        throw e;
      }
    },
  },
  modules: {},
});
