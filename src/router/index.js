import { createRouter, createWebHistory } from 'vue-router';
import Home from '/src/pages/index.vue';
import SignUp from '../pages/SignUp.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Home',
    component: SignUp,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
