import { createApp } from 'vue';
import router from './router/index';
import App from './App.vue';
import './style.css';
const app = createApp(App);
import i18n from '../locales/i18n';

app.use(i18n);
app.use(router);
app.mount('#app');
