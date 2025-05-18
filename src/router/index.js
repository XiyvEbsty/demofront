import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import JobQuiz from '../views/JobQuiz.vue'
import JobRecommendations from '../views/JobRecommendations.vue'
import UserProfile from '../views/UserProfile.vue'
import Login from '../views/Login.vue'
import Manager from '../views/Manager.vue'
import CareerAnchorQuiz from '../views/CareerAnchorQuiz.vue'
import KnowledgeGraphManagement from '../views/KnowledgeGraphManagement.vue'
import QuestionManager from '../views/QuestionManager.vue'
import UserManager from '../views/UserManager.vue'
import JobManager from '../views/JobManager.vue'
import StatsManager from '../views/StatsManager.vue'

const routes = [
    {
      path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/job-quiz',
    name: 'JobQuiz',
    component: JobQuiz
  },
        {
    path: '/job-recommendations',
    name: 'JobRecommendations',
    component: JobRecommendations
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile
    },
    {
      path: '/login',
      name: 'Login',
    component: Login
    },
    {
    path: '/manager',
    name: 'Manager',
    component: Manager,
      meta: {
      isAdmin: true  // 标记管理员界面
      },
      children: [
        {
          path: 'question',
          name: 'QuestionManager',
          component: QuestionManager,
          meta: {
            isAdmin: true,
            title: '测评题库管理'
          }
        },
        {
          path: 'users',
          name: 'UserManager',
          component: UserManager,
          meta: {
            isAdmin: true,
            title: '用户管理'
          }
        },
        {
          path: 'jobs',
          name: 'JobManager',
          component: JobManager,
          meta: {
            isAdmin: true,
            title: '职位管理'
          }
        },
        {
          path: 'stats',
          name: 'StatsManager',
          component: StatsManager,
          meta: {
            isAdmin: true,
            title: '统计分析'
          }
        },
        {
          path: 'knowledge-graph',
          name: 'KnowledgeGraphManagement',
          component: KnowledgeGraphManagement,
          meta: {
            isAdmin: true,
            title: '知识图谱管理'
          }
        }
      ]
    },
    {
    path: '/career-anchor-quiz',
    name: 'CareerAnchorQuiz',
    component: CareerAnchorQuiz
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
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
