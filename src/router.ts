import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/games',
      name: 'games',
      component: () => import(/* webpackChunkName: "games" */ './views/Games.vue'),
      children: [
        {
          path: 'bricks',
          component: () => import(/* webpackChunkName: "games" */ './views/Games/Bricks.vue'),
        },
        {
          path: 'rpg',
          component: () => import(/* webpackChunkName: "games" */ './views/Games/Rpg.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
