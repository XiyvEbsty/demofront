<template>
  <div class="home-container">
    <!-- 系统介绍和引导区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>基于知识图谱的职位推荐系统</h1>
        <p>通过科学的职业测评，发现你的职业倾向，找到最适合你的职业方向</p>
        <div class="hero-buttons">
        <el-button type="primary" size="large" @click="router.push('/job-quiz')">
            霍兰德测评
          </el-button>
          <el-button type="primary" size="large" @click="router.push('/career-anchor-quiz')">
            职业锚点测评
        </el-button>
        </div>
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
      
      <!-- 提示完成测评 -->
      <div v-if="!hasTestResults" class="test-tip">
        <el-alert
          title="完成职业测评，获取专属推荐"
          type="info"
          description="完成霍兰德职业兴趣测评和职业锚点测评，系统将为您推荐最匹配的职位"
          show-icon
          :closable="false"
          class="tip-alert"
        />
      </div>
      
      <el-row :gutter="20">
        <el-col :span="8" v-for="(job, index) in hotJobs" :key="index">
          <el-card class="job-card" shadow="hover" @click="searchJobOnBoss(job.title)" style="cursor: pointer;">
            <!-- 匹配度标识 - 仅在有测评结果时显示 -->
            <div v-if="hasTestResults" class="match-score">
              <span class="score-label">匹配度</span>
              <el-progress
                type="circle"
                :percentage="Math.round(job.matchScore || 0)"
                :color="getMatchScoreColor(job.matchScore || 0)"
                :width="50"
              />
            </div>
            
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

    <!-- 职业锚点类型介绍 -->
    <div class="career-anchors">
      <h2>职业锚点类型介绍</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(anchor, index) in careerAnchors" :key="index">
          <el-card class="anchor-card" shadow="hover">
            <div 
              class="anchor-header"
              :class="{ 'active': expandedAnchors.includes(anchor.type) }"
              @click="toggleAnchor(anchor.type)"
            >
              <div class="anchor-title">
                <div class="anchor-type">{{ anchor.type }}</div>
                <h3>{{ anchor.name.replace(anchor.type + '型: ', '') }}</h3>
              </div>
              <el-icon class="expand-icon" :class="{ 'is-expanded': expandedAnchors.includes(anchor.type) }">
                <arrow-down />
              </el-icon>
            </div>
            <div class="anchor-content">
              <transition name="expand">
                <div v-show="expandedAnchors.includes(anchor.type)" class="anchor-description">
                  <p>{{ anchor.description }}</p>
                </div>
              </transition>
            </div>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobData, calculateJobMatch } from '../data/job-data'
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
  OfficeBuilding,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()
const expandedAnchors = ref([]) // 记录展开的职业锚点类型

// 测评结果
const hollandScores = ref(null)
const anchorScores = ref(null)
const hasTestResults = ref(false)

// 获取测评结果
const getTestResults = () => {
  const holland = localStorage.getItem('riasecScores')
  const anchor = localStorage.getItem('careerAnchorScores')
  
  if (holland && anchor) {
    hollandScores.value = JSON.parse(holland)
    anchorScores.value = JSON.parse(anchor)
    hasTestResults.value = true
    return true
  }
  return false
}

// 切换职业锚点的展开/折叠状态
const toggleAnchor = (type) => {
  const index = expandedAnchors.value.indexOf(type)
  if (index > -1) {
    expandedAnchors.value.splice(index, 1)
  } else {
    expandedAnchors.value.push(type)
  }
}

// 热门职位数据 - 根据测评结果或默认
const hotJobs = computed(() => {
  if (hasTestResults.value) {
    // 根据测评结果计算匹配度并获取前三名
    return calculateJobMatch(hollandScores.value, anchorScores.value).slice(0, 3)
  } else {
    // 默认热门职位
    return [
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
  }
})

// 快速入口数据
const quickAccessItems = [
  {
    title: '霍兰德职业兴趣测评',
    description: '基于霍兰德职业兴趣理论测评',
    icon: 'Document',
    route: '/job-quiz'
  },
  {
    title: '职业锚点测评',
    description: '基于Schein职业锚点理论测评',
    icon: 'Tools',
    route: '/career-anchor-quiz'
  },
  {
    title: '职位推荐',
    description: '查看个性化职位推荐',
    icon: 'Briefcase',
    route: '/job-recommendations'
  },
  {
    title: '个人中心',
    description: '管理你的个人信息和测评历史',
    icon: 'User',
    route: '/profile'
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

// 职业锚点类型数据
const careerAnchors = [
  {
    type: 'TF',
    name: 'TF型: 技术/职能型',
    description: '始终不肯放弃的是在专业领域中展示自己的技能，并不断把自己的技术发展到更高层次的机会。希望通过施展自己的技能以获取别人认可，并乐于接受来自于专业领域的挑战，可能愿意成为技术/职能领域的管理者，但管理本身不能给你带来乐趣，极力避免全面管理的职位，因为这意味着你可能会脱离自己擅长的专业领域。'
  },
  {
    type: 'GM',
    name: 'GM型: 管理型',
    description: '始终不肯放弃的是升迁到组织中更高的管理职位，这样能够整合其他人的工作，并对组织中某项工作的绩效承担责任。你希望为最终的结果承担责任，并把组织的成功看作是自己的工作。如果目前在技术/职能部门工作，你会将此看成积累经验的必须过程，你的目标是尽快得到一个全面管理的职位，因为你对技术/职能部门的管理不感兴趣。'
  },
  {
    type: 'AU',
    name: 'AU型: 自主/独立型',
    description: '始终不肯放弃的是按照自己的方式工作和生活，希望留存能够提供足够的灵活性，并由自己来决定何时及如何工作的组织中。如果你无法忍受任何程度上的公司的约束，就会去寻找一些有足够自由的职业。你宁可放弃升职加薪的机会，也不愿意丧失自己的独立自主性。为了能有最大程度的自主和独立，你可能创立自己的公司，但你的创业动机是与后面叙述的创业家的动机是不同的。'
  },
  {
    type: 'SE',
    name: 'SE型: 安全/稳定型',
    description: '始终不肯放弃的是稳定的或终身雇佣的职位。你希望有成功的感觉，这样你才可以放松下来。你关注财务安全(如养老金和退休金方案)和就业安全。你对组织忠诚，对雇主言听计从，希望以此换取终身佣的承诺。虽然你可以到达更高的职位，但你对工作的内容和在组织内的等级地位并不关心。任何人(包括自主/独立型)都有安全和稳定的需要，在财务负担加重或面临退休时，这种需要会更加明显。安全/稳定型职业锚的人总是关注安全和稳定问题，并把自我认知建立在如何管理安全与稳定上。'
  },
  {
    type: 'EC',
    name: 'EC型: 创造/创业型',
    description: '始终不肯放弃的是凭借自己的能力和冒险愿望，扫除障碍，创立属于自己的公司或组织。你希望向世界证明你有能力创建一家企业，现在你可能在某一组织中为别人工作，但同时你会学习并评估未来的机会，一旦你认为时机成熟，就会尽快开始自己的创业历程。你希望自己的企业有非常高的现金收入，以证明你的能力。'
  },
  {
    type: 'SV',
    name: 'SV型: 服务型',
    description: '始终不肯放弃的是做明显有社会意义的工作，能够得到他人的认可，能够体现自己的价值。他们的职业决策通常基于能否让社会和周围的人事物变得更加美好，如:志愿者、义工。'
  },
  {
    type: 'CH',
    name: 'CH型: 挑战型',
    description: '始终不肯放弃的是去解决看上去无法解决的问题、战胜强硬的对手或克服面临的困难。对你而言，职业的意义在于允许你战胜不可能的事情。有的人在需要高智商的职业中发现这种纯粹的挑战，例如仅仅对高难度、不可能实现的设计感兴趣的工程师。有些人发现处理多层次的、复杂的情况是一种挑战，例如战略咨询师仅对面临破产、资源消耗尽的客户感兴趣。还有一些人将人际竞争看成是挑战，例如职业运动员，或将销售定义为非赢即输的销售人员。新奇、多变和困难是挑战的决定因素，如果一件事情非常容易，它立马会变得令人厌倦。'
  },
  {
    type: 'LS',
    name: 'LS型: 生活型',
    description: '始终不肯放弃的是平衡并整合个人的、家庭的和职业的需要。你希望生活中的各个部分能够协调统一向前发展，因此你希望职业有足够的弹性允许你来实现这种整合。你可能不得不放弃职业中的某些方面(例如晋升带来跨地区调动，可能打乱你的生活)。你与众不同的地方在于过自己的生活，包括居住在什么地方、如何处理家庭事务及在组织内如何发挥自己的作用。'
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

// 初始化 - 获取测评结果
onMounted(() => {
  getTestResults()
})

// 搜索职位到BOSS直聘
const searchJobOnBoss = (jobTitle) => {
  const searchUrl = `https://www.zhipin.com/job_detail/?query=${encodeURIComponent(jobTitle)}`
  window.open(searchUrl, '_blank')
}

// 获取匹配度颜色
const getMatchScoreColor = (score) => {
  if (score >= 80) return '#67C23A' // 高匹配 - 绿色
  if (score >= 60) return '#409EFF' // 中高匹配 - 蓝色
  if (score >= 40) return '#E6A23C' // 中等匹配 - 黄色
  return '#F56C6C' // 低匹配 - 红色
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f5f7fa;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-section {
  padding: 40px 20px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
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

.hero-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }
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

.hot-jobs, .career-types, .career-anchors, .statistics {
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
}

.hot-jobs h2, .career-types h2, .career-anchors h2 {
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
  position: relative;
  padding-top: 15px;
}

.job-card:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.match-score {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 12px;
  margin-bottom: 5px;
  color: #909399;
}

.job-tags {
  margin-top: 10px;
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
  margin-right: 5px;
}

.type-card {
  text-align: center;
  height: 100%;
  border: none;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.type-card:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.type-card h3 {
  color: #409EFF;
  margin-bottom: 10px;
}

/* 职业锚点卡片样式 */
.anchor-card {
  text-align: left;
  height: auto;
  border: none;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  overflow: hidden;
}

.anchor-card:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.anchor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.anchor-header.active {
  border-bottom: 1px solid #e1e1e1;
  background-color: #f9f9f9;
}

.anchor-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.anchor-type {
  font-weight: bold;
  color: white;
  background-color: #409EFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.anchor-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.3s ease, color 0.3s ease;
  color: #909399;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
  color: #409EFF;
}

.anchor-content {
  padding: 0 15px;
}

.anchor-description {
  text-align: left;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  padding: 15px 0;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
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

.test-tip {
  margin-bottom: 20px;
}

.tip-alert {
  margin-bottom: 15px;
}
</style>