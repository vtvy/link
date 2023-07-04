import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).mount("#app");
