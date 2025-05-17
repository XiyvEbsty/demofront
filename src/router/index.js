import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      component: import('../views/Manager.vue'),
      redirect: '/home',  // 添加重定向到 home
      children:[
        {path: 'home', component: import('../views/Home.vue')},
        {path: 'job-quiz', component: import('../views/JobQuiz.vue')},
        {path: 'job-result', component: import('../views/JobResult.vue')},
        {path: 'profile', component: import('../views/UserProfile.vue')},
      ]
    },

    {path: '/notFound', component: import('../views/404.vue'),},
    {path: '/:pathMatch(.*)', redirect: '/notFound'},
  ],
})

export default router
