import { createApp } from "vue";
import "./style.css";
import "vue3-toastify/dist/index.css";
import router from "./router/index";
import Vue3Toastify from "vue3-toastify";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 300,
});
app.mount("#app");
