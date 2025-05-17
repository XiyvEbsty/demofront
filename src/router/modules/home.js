export default [
  {
    path: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'House',
      requiresAuth: true
    }
  }
] 