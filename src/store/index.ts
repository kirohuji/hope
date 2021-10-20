import { createStore } from "vuex";

interface State {
  theme: string
}
export default createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  state: {
    theme: "default",
  },
  getters: {
    theme: (state) => state.theme,
  },
  mutations: {
    setTheme: (state, theme) => {
      state.theme = theme;
    },
  },
});
