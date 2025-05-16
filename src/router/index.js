import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: import('../views/Manager.vue'),//嵌套路由
      children:[
        {path: 'home', component: import('../views/Home.vue'),},
      ]
    },

    {path: '/notFound', component: import('../views/404.vue'),},
    {path: '/:pathMatch(.*)', redirect: '/notFound'},
  ],
})

export default router
