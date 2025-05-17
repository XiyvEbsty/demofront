import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './modules/home'
import jobRoutes from './modules/job'
import userRoutes from './modules/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Manager.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home.vue'),
          meta: {
            title: '首页',
            icon: 'House',
            requiresAuth: false  // 首页不需要登录
          }
        },
        ...jobRoutes,
        ...userRoutes
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/admin-login',
      name: 'AdminLogin',
      component: () => import('@/views/AdminLogin.vue'),
      meta: {
        title: '管理员登录',
        requiresAuth: false
      }
    },
    {
      path: '/notFound',
      component: () => import('@/views/404.vue'),
      meta: {
        title: '404',
        requiresAuth: false
      }
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/notFound'
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 职位推荐系统` : '职位推荐系统'
  
  // 权限验证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 保存用户想要访问的页面
      localStorage.setItem('redirectPath', to.fullPath)
      next('/login')
      return
    }
  }
  next()
})

// 全局后置守卫
router.afterEach(() => {
  // 路由切换后滚动到顶部
  window.scrollTo(0, 0)
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push('/notFound')
})

export default router
