import Vue from 'vue';
import VueRouter from 'vue-router';

const Admin = () => import(/* webpackChunkName: "Admin" */ '@/views/Admin/Admin.vue');
const Menu = () => import(/* webpackChunkName: "Menu" */ '@/views/Menu/Menu.vue');
const Order = () => import(/* webpackChunkName: "Order" */ '@/views/Order/Order.vue');
const Restaurant = () => import(/* webpackChunkName: "Restaurant" */ '@/views/Restaurant/Restaurant.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Admin,
    children: [
      {
        path: '/',
        redirect: 'restaurant',
      },
      {
        path: 'restaurant',
        name: 'Restaurant',
        component: Restaurant,
      },
      {
        path: 'menu',
        name: 'Menu',
        component: Menu,
      },
      {
        path: 'order',
        name: 'Order',
        component: Order,
      },

    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
