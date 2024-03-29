import axios from "@/api/backend.js";

export default {
  namespaced: true,
  state: () => ({
    question: null,
    answer: null,
  }),
  actions: {
    RELOAD_CURRENT_ANSWER({ dispatch, state }) {
      const id = state.answer.slug;
      return dispatch("FETCH_ANSWER", { id });
    },
    async FETCH_ANSWER({ dispatch, commit }, { id }) {
      const result = await axios.get(`/api/v2/homework/answers/${id}/`);
      const { question } = result.data;
      commit("SET_ANSWER", result.data);
      return dispatch("FETCH_QUESTION", { id: question });
    },
    async FETCH_QUESTION({ commit }, { id }) {
      const response = await axios.get(`/api/v2/homework/questions/${id}/`);

      commit("SET_QUESTION", response.data);
    },
    async POST_ANSWER({ dispatch, state }, answer) {
      await axios.post(`/api/v2/homework/answers/`, answer);
      await dispatch("FETCH_ANSWER", { id: state.answer.slug });
    },
    DELETE_ANSWER(_, { id }) {
      return axios.delete(`/api/v2/homework/answers/${id}/`);
    },
  },
  mutations: {
    SET_ANSWER(state, answer) {
      state.answer = answer;
    },
    SET_QUESTION(state, question) {
      state.question = question;
    },
  },
};
