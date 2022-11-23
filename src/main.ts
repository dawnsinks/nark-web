import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';
import axios from "axios";
const app = createApp(App)
axios.defaults.baseURL="http://0.0.0.0:8089"

app.use(router)
app.use(ElementPlus)



app.mount('#app')