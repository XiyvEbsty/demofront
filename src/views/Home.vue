<template>
  <AppLayout>
    <div class="home-container">
      <!-- 系统介绍和引导区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <h1>基于霍兰德职业兴趣理论的职位推荐系统</h1>
          <p>通过科学的职业测评，发现你的职业倾向，找到最适合你的职业方向</p>
          <el-button type="primary" size="large" @click="router.push('/job-quiz')">
            开始测评
          </el-button>
        </div>
      </div>

      <!-- 快速入口区域 -->
      <div class="quick-access">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in quickAccessItems" :key="index">
            <el-card class="quick-access-card" @click="router.push(item.route)">
              <el-icon class="quick-access-icon"><component :is="item.icon" /></el-icon>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 热门职位展示 -->
      <div class="hot-jobs">
        <h2>热门职位推荐</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(job, index) in hotJobs" :key="index">
            <el-card class="job-card" shadow="hover" @click="searchJobOnBoss(job.title)" style="cursor: pointer;">
              <h3>{{ job.title }}</h3>
              <div class="job-tags">
                <el-tag v-for="(tag, idx) in job.tags" :key="idx" :type="tag.type">
                  {{ tag.text }}
                </el-tag>
              </div>
              <p class="job-salary">{{ job.salary }}</p>
              <p class="job-description">{{ job.description }}</p>
              <div class="job-requirements">
                <h4>所需技能：</h4>
                <el-tag 
                  v-for="(skill, idx) in job.requirements" 
                  :key="idx"
                  size="small"
                  class="requirement-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 职业类型介绍 -->
      <div class="career-types">
        <h2>职业类型介绍</h2>
        <el-row :gutter="20">
          <el-col :span="4" v-for="(type, index) in careerTypes" :key="index">
            <el-card class="type-card" shadow="hover">
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 数据统计展示 -->
      <div class="statistics">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(stat, index) in statistics" :key="index">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Briefcase, 
  Histogram, 
  Document,
  Tools,
  Monitor,
  Brush,
  Service,
  Promotion,
  OfficeBuilding
} from '@element-plus/icons-vue'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()

// 快速入口数据
const quickAccessItems = [
  {
    title: '职业测评',
    description: '开始你的职业倾向测评',
    icon: 'Document',
    route: '/job-quiz'
  },
  {
    title: '职位推荐',
    description: '查看个性化职位推荐',
    icon: 'Briefcase',
    route: '/job-recommendations'
  },
  {
    title: '个人中心',
    description: '管理你的个人信息',
    icon: 'User',
    route: '/profile'
  },
  {
    title: '测评历史',
    description: '查看历史测评记录',
    icon: 'Histogram',
    route: '/quiz-history'
  }
]

// 热门职位数据
const hotJobs = [
  {
    title: '高级前端工程师',
    tags: [
      { text: '技术', type: 'primary' },
      { text: '互联网', type: 'success' }
    ],
    salary: '25k-35k',
    description: '负责公司核心产品的前端开发工作',
    requirements: ['Vue.js', 'React', 'TypeScript', 'Webpack']
  },
  {
    title: '产品经理',
    tags: [
      { text: '产品', type: 'warning' },
      { text: '互联网', type: 'success' }
    ],
    salary: '20k-30k',
    description: '负责产品规划和需求分析',
    requirements: ['产品规划', '需求分析', '项目管理', '用户体验']
  },
  {
    title: '数据分析师',
    tags: [
      { text: '数据', type: 'info' },
      { text: '互联网', type: 'success' }
    ],
    salary: '18k-28k',
    description: '负责数据分析和业务洞察',
    requirements: ['Python', 'SQL', '数据分析', '统计学']
  }
]

// 职业类型数据
const careerTypes = [
  {
    name: '现实型(R)',
    description: '喜欢动手操作，善于使用工具'
  },
  {
    name: '研究型(I)',
    description: '喜欢思考，善于分析研究'
  },
  {
    name: '艺术型(A)',
    description: '喜欢创造，富有想象力'
  },
  {
    name: '社会型(S)',
    description: '喜欢帮助他人，善于沟通'
  },
  {
    name: '企业型(E)',
    description: '喜欢领导他人，善于说服'
  },
  {
    name: '传统型(C)',
    description: '喜欢按部就班，善于组织'
  }
]

// 统计数据
const statistics = [
  {
    value: '10,000+',
    label: '系统使用人数'
  },
  {
    value: '50,000+',
    label: '已完成测评'
  },
  {
    value: '30,000+',
    label: '成功推荐案例'
  },
  {
    value: '98%',
    label: '用户满意度'
  }
]

// 跳转到BOSS直聘搜索职位
const searchJobOnBoss = (jobTitle) => {
  const searchUrl = `https://www.zhipin.com/job_detail/?query=${encodeURIComponent(jobTitle)}`
  window.open(searchUrl, '_blank')
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.hero-section {
  background: linear-gradient(135deg, #409EFF 0%, #36D1DC 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.hero-content h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-content p {
  font-size: 1.2em;
  margin-bottom: 30px;
  opacity: 0.9;
}

.quick-access {
  margin-bottom: 40px;
}

.quick-access-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.quick-access-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.quick-access-icon {
  font-size: 2em;
  color: #409EFF;
  margin-bottom: 15px;
}

.hot-jobs, .career-types, .statistics {
  margin-bottom: 40px;
}

.hot-jobs h2, .career-types h2 {
  margin-bottom: 20px;
  color: #303133;
  font-weight: 600;
}

.job-card {
  margin-bottom: 20px;
  border: none;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.job-card:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.job-tags {
  margin: 10px 0;
}

.job-salary {
  color: #409EFF;
  font-size: 1.2em;
  font-weight: bold;
  margin: 10px 0;
}

.job-description {
  color: #606266;
  margin: 10px 0;
}

.job-requirements {
  margin-top: 15px;
}

.requirement-tag {
  margin: 5px;
  background-color: #f0f9ff;
  color: #409EFF;
  border-color: #d9ecff;
}

.type-card {
  text-align: center;
  height: 100%;
  border: none;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.type-card:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.type-card h3 {
  color: #409EFF;
  margin-bottom: 10px;
}

.statistics {
  background: linear-gradient(135deg, #409EFF 0%, #36D1DC 100%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.stat-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 2em;
  color: white;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5px;
}
</style>