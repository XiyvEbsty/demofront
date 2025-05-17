export default [
  {
    path: 'job-quiz',
    component: () => import('@/views/JobQuiz.vue'),
    meta: {
      title: '职位测评',
      icon: 'Document',
      requiresAuth: true
    }
  },
  {
    path: 'job-result',
    component: () => import('@/views/JobResult.vue'),
    meta: {
      title: '测评结果',
      icon: 'DataLine',
      requiresAuth: true
    }
  }
] 