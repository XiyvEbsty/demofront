export default [
  {
    path: 'profile',
    component: () => import('@/views/UserProfile.vue'),
    meta: {
      title: '个人信息',
      icon: 'User',
      requiresAuth: true
    }
  }
] 