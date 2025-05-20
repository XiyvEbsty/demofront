<template>
  <AppLayout>
    <div class="home-container">
      <!-- 系统介绍和引导区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <h1>基于知识图谱的职位推荐系统</h1>
          <p>结合霍兰德职业兴趣理论与知识图谱技术，精准匹配职业倾向，推荐最适合你的职业发展路径</p>
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
        
        <!-- 类型切换标签页 -->
        <el-tabs v-model="activeTypeTab" class="type-tabs">
          <el-tab-pane label="霍兰德职业兴趣类型" name="holland">
            <el-row :gutter="20">
              <el-col :span="8" v-for="(type, index) in hollandTypes" :key="index">
                <el-card class="type-card" shadow="hover" :body-style="{ backgroundColor: type.bgColor }">
                  <div class="type-header">
                    <h3>{{ type.name }}</h3>
                    <el-tag :type="type.tagType" effect="dark">{{ type.code }}</el-tag>
                  </div>
                  <p>{{ type.description }}</p>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="职业锚点类型" name="anchor">
            <el-row :gutter="20">
              <el-col :span="8" v-for="(type, index) in anchorTypes" :key="index">
                <el-card class="type-card" shadow="hover" :body-style="{ backgroundColor: type.bgColor }">
                  <div class="type-header">
                    <h3>{{ type.name }}</h3>
                    <el-tag :type="type.tagType" effect="dark">{{ type.code }}</el-tag>
                  </div>
                  <p>{{ type.description }}</p>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 知识图谱介绍 - 移动到这里 -->
      <div class="knowledge-graph-intro">
        <h2>什么是知识图谱驱动的职位推荐？</h2>
        <div class="intro-content">
          <p>我们的系统利用知识图谱技术，构建了职位、技能、行业之间的复杂关联网络，将职业兴趣与实际职位进行精准匹配。</p>
          <p>相比传统推荐系统，基于知识图谱的推荐能够：</p>
          <ul>
            <li><strong>多维度分析</strong> - 同时考虑霍兰德职业兴趣和职业锚点特征</li>
            <li><strong>深度挖掘</strong> - 发现职位间的潜在联系和职业发展路径</li>
            <li><strong>精准匹配</strong> - 提供更符合个人特质的职位推荐</li>
          </ul>
        </div>
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

// 职业类型数据
const activeTypeTab = ref('holland')

// 霍兰德职业类型数据
const hollandTypes = [
  {
    code: 'R',
    name: '现实型',
    description: '喜欢动手操作，善于使用工具和机器，处理具体问题，偏好需要体力或技术操作的工作',
    tagType: 'success',
    bgColor: '#f0f9eb'
  },
  {
    code: 'I',
    name: '研究型',
    description: '喜欢思考、分析、研究和探索，善于解决抽象问题，偏好需要认知能力和分析能力的工作',
    tagType: 'info',
    bgColor: '#f4f4f5'
  },
  {
    code: 'A',
    name: '艺术型',
    description: '喜欢创造，富有想象力和创意，追求表现自我，偏好艺术性、开放性和非结构化的工作',
    tagType: 'warning',
    bgColor: '#fdf6ec'
  },
  {
    code: 'S',
    name: '社会型',
    description: '喜欢与人打交道，善于沟通和帮助他人，偏好教育、咨询、服务等需要人际互动的工作',
    tagType: 'primary',
    bgColor: '#ecf5ff'
  },
  {
    code: 'E',
    name: '企业型',
    description: '喜欢领导和影响他人，善于说服、管理和组织，偏好需要领导能力和说服能力的工作',
    tagType: 'danger',
    bgColor: '#fef0f0'
  },
  {
    code: 'C',
    name: '常规型',
    description: '喜欢按部就班，善于组织和处理数据，注重细节和规则，偏好有明确规范和秩序的工作',
    tagType: '',
    bgColor: '#f5f7fa'
  }
]

// 职业锚点类型数据
const anchorTypes = [
  {
    code: 'TF',
    name: '技术/功能型',
    description: '追求专业技能的发展和精通，重视在专业领域内的成就和认可',
    tagType: 'success',
    bgColor: '#f0f9eb'
  },
  {
    code: 'GM',
    name: '管理型',
    description: '渴望负责整个组织的成败，追求更高的管理职位和责任',
    tagType: 'primary',
    bgColor: '#ecf5ff'
  },
  {
    code: 'AU',
    name: '自主/独立型',
    description: '重视工作上的自由和独立，不喜欢受到组织规则和限制的约束',
    tagType: 'warning',
    bgColor: '#fdf6ec'
  },
  {
    code: 'SE',
    name: '安全/稳定型',
    description: '重视工作和收入的稳定性，追求长期的职业安全保障',
    tagType: 'info',
    bgColor: '#f4f4f5'
  },
  {
    code: 'EC',
    name: '创业型',
    description: '喜欢创造自己的事业，热衷于寻找创新机会和冒险',
    tagType: 'danger',
    bgColor: '#fef0f0'
  },
  {
    code: 'SV',
    name: '服务型',
    description: '追求能够帮助他人和社会的工作，重视工作的社会价值和意义',
    tagType: '',
    bgColor: '#f5f7fa'
  },
  {
    code: 'CH',
    name: '挑战型',
    description: '追求解决困难问题的机会，喜欢挑战和竞争，渴望克服看似不可能的障碍',
    tagType: 'success',
    bgColor: '#f0f9eb'
  },
  {
    code: 'LS',
    name: '生活型',
    description: '重视工作与个人生活的平衡，寻求能够兼顾事业和家庭的职业选择',
    tagType: 'info',
    bgColor: '#f4f4f5'
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
  height: 180px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.type-header h3 {
  margin: 0;
  font-size: 18px;
}

.type-tabs {
  margin-top: 20px;
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

.knowledge-graph-intro {
  margin-bottom: 40px;
  background-color: white;
  border-radius: 8px;
  padding: 20px 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.knowledge-graph-intro h2 {
  margin-bottom: 20px;
  color: #303133;
  font-weight: 600;
  text-align: center;
}

.intro-content p {
  margin-bottom: 15px;
  color: #606266;
  line-height: 1.6;
}

.intro-content ul {
  padding-left: 20px;
  margin-bottom: 0;
}

.intro-content li {
  margin-bottom: 10px;
  color: #606266;
}
</style>