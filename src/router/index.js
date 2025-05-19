import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '../views/Home.vue'
import JobQuiz from '../views/JobQuiz.vue'
import JobRecommendations from '../views/JobRecommendations.vue'
import UserProfile from '../views/UserProfile.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Manager from '../views/Manager.vue'
import CareerAnchorQuiz from '../views/CareerAnchorQuiz.vue'
import KnowledgeGraphManagement from '../views/KnowledgeGraphManagement.vue'
import QuestionManager from '../views/QuestionManager.vue'
import UserManager from '../views/UserManager.vue'
import JobManager from '../views/JobManager.vue'
import StatsManager from '../views/StatsManager.vue'
import NotFound from '../views/404.vue'

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
      path: '/register',
      name: 'Register',
      component: Register
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
    },
    // 添加404路由
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    // 通配符路由，匹配所有未定义的路由，将它们重定向到404页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
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
  
  // 检查是否是管理员路由
  if (to.meta.isAdmin) {
    const userRole = localStorage.getItem('userRole')
    const token = localStorage.getItem('token')
    
    // 如果没有令牌或者不是管理员，重定向到登录页
    if (!token || userRole !== 'admin') {
      ElMessage.warning('需要管理员权限')
      next('/login')
      return
    }
  }
  
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
  router.push('/404')
})

export default router
