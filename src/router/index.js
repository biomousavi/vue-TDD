import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/HomePage.vue';
import SignUp from '../pages/SignUp.vue';
import Activation from '../pages/Activation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/activation/:token',
    name: 'Account Activation',
    component: Activation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
