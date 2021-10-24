import { createStore } from "vuex";

interface State {
  theme: string;
  currentUser: object;
}
export default createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  state: {
    theme: "default",
    currentUser: {
      profile: {},
    }
  },
  getters: {
    theme: (state) => state.theme,
    currentUser: (state) => state.currentUser,
  },
  mutations: {
    setTheme: (state, theme) => {
      state.theme = theme;
    },
    currentUser: (state, currentUser) => {
      state.currentUser = currentUser;
    },
  },
});
