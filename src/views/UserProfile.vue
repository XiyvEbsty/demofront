<template>
  <div class="user-profile">
    <h1>个人中心</h1>
    <div class="profile-container">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <h2>个人信息</h2>
            <el-button type="primary" @click="isEditing = true" v-if="!isEditing">
              编辑资料
            </el-button>
          </div>
        </template>

        <el-form 
          :model="userInfo" 
          label-width="100px"
          :disabled="!isEditing"
        >
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="教育程度">
            <el-select v-model="userInfo.education" placeholder="请选择">
              <el-option label="高中" value="high_school" />
              <el-option label="大专" value="college" />
              <el-option label="本科" value="bachelor" />
              <el-option label="硕士" value="master" />
              <el-option label="博士" value="phd" />
            </el-select>
          </el-form-item>
          <el-form-item label="工作年限">
            <el-input-number v-model="userInfo.workYears" :min="0" :max="50" />
          </el-form-item>
          
          <el-form-item v-if="isEditing">
            <el-button type="primary" @click="saveProfile">保存</el-button>
            <el-button @click="cancelEdit">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="history-card">
        <template #header>
          <div class="card-header">
            <h2>测评历史</h2>
            <el-button type="primary" plain size="small" @click="goToQuiz">开始新测评</el-button>
          </div>
        </template>

        <el-tabs type="border-card" class="history-tabs">
          <el-tab-pane label="霍兰德测评历史">
            <el-empty v-if="hollandHistory.length === 0" description="暂无测评历史" />
            <el-timeline v-else>
              <el-timeline-item
                v-for="(history, index) in hollandHistory"
                :key="index"
                :timestamp="history.date"
                placement="top"
                type="primary"
              >
                <el-card class="history-item-card">
                  <div class="history-card-header">
                    <h4>霍兰德兴趣类型测评结果</h4>
                    <el-button 
                      type="success" 
                      size="small" 
                      @click="viewJobRecommendations(history, 'holland')"
                      plain
                    >
                      查看推荐职位
                    </el-button>
                  </div>
                  
                  <div class="result-chart">
                    <div class="radar-chart" :ref="el => setChartRef(el, 'holland', index)"></div>
                  </div>
                  
                  <div class="result-tags">
                    <el-tag 
                      v-for="(score, type) in history.scores" 
                      :key="type"
                      :type="getHollandTagType(type)"
                      effect="light"
                    >
                      {{ getHollandTypeName(type) }}: {{ score }}
                    </el-tag>
                  </div>
                  
                  <div class="result-description">
                    <p><strong>主导类型：</strong>{{ getPrimaryType(history.scores, 'holland') }}</p>
                    <p class="type-description">{{ getTypeDescription(getPrimaryType(history.scores, 'holland'), 'holland') }}</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
          
          <el-tab-pane label="职业锚点测评历史">
            <el-empty v-if="anchorHistory.length === 0" description="暂无测评历史" />
            <el-timeline v-else>
              <el-timeline-item
                v-for="(history, index) in anchorHistory"
                :key="index"
                :timestamp="history.date"
                placement="top"
                type="warning"
              >
                <el-card class="history-item-card">
                  <div class="history-card-header">
                    <h4>职业锚点测评结果</h4>
                    <el-button 
                      type="success" 
                      size="small" 
                      @click="viewJobRecommendations(history, 'anchor')"
                      plain
                    >
                      查看推荐职位
                    </el-button>
                  </div>
                  
                  <div class="result-chart">
                    <div class="bar-chart" :ref="el => setChartRef(el, 'anchor', index)"></div>
                  </div>
                  
                  <div class="result-tags">
                    <el-tag 
                      v-for="(score, type) in history.scores" 
                      :key="type"
                      :type="getAnchorTagType(type)"
                      effect="light"
                    >
                      {{ getAnchorTypeName(type) }}: {{ score }}
                    </el-tag>
                  </div>
                  
                  <div class="result-description">
                    <p><strong>主导类型：</strong>{{ getPrimaryType(history.scores, 'anchor') }}</p>
                    <p class="type-description">{{ getTypeDescription(getPrimaryType(history.scores, 'anchor'), 'anchor') }}</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    
    <!-- 职位推荐对话框 -->
    <el-dialog
      v-model="jobDialogVisible"
      :title="'根据' + (currentTestType === 'holland' ? '霍兰德兴趣类型' : '职业锚点') + '测评结果的职位推荐'"
      width="70%"
    >
      <div class="job-recommendation-container">
        <el-empty v-if="recommendedJobs.length === 0" description="暂无推荐职位" />
        <div v-else class="job-cards">
          <el-card 
            v-for="job in recommendedJobs" 
            :key="job.id" 
            class="job-card"
            shadow="hover"
          >
            <div class="job-card-header">
              <h3>{{ job.title }}</h3>
              <el-tag size="small">{{ job.industry }}</el-tag>
            </div>
            
            <div class="job-tags">
              <div class="holland-tags">
                <el-tag 
                  v-for="type in job.hollandTypes" 
                  :key="type"
                  :type="getHollandTagType(type)"
                  size="small"
                  effect="plain"
                >
                  {{ getHollandTypeName(type) }}
                </el-tag>
              </div>
              
              <div class="anchor-tags">
                <el-tag 
                  v-for="type in job.anchorTypes" 
                  :key="type"
                  :type="getAnchorTagType(type)"
                  size="small"
                  effect="plain"
                >
                  {{ getAnchorTypeName(type) }}
                </el-tag>
              </div>
            </div>
            
            <p class="job-description">{{ job.description }}</p>
            
            <div class="job-match">
              <span>匹配度</span>
              <el-progress :percentage="job.matchScore" :status="getMatchStatus(job.matchScore)" />
            </div>
            
            <div class="job-actions">
              <el-button type="primary" size="small" @click="viewJobDetail(job)">查看详情</el-button>
              <el-button plain size="small" @click="saveJob(job)">收藏</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { RadarChart, BarChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent,
  RadarChart, 
  BarChart, 
  CanvasRenderer
])

const router = useRouter()
const isEditing = ref(false)
const userInfo = ref({
  username: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  education: 'bachelor',
  workYears: 3
})

// 霍兰德测评历史数据
const hollandHistory = ref([
  {
    id: 1,
    date: '2024-03-15',
    scores: {
      R: 65,
      I: 85,
      A: 45,
      S: 55,
      E: 30,
      C: 40
    }
  },
  {
    id: 2,
    date: '2024-02-20',
    scores: {
      R: 60,
      I: 75,
      A: 50,
      S: 60,
      E: 35,
      C: 45
    }
  }
])

// 职业锚点测评历史数据
const anchorHistory = ref([
  {
    id: 1,
    date: '2024-03-18',
    scores: {
      TF: 80,
      GM: 40,
      AU: 65,
      SE: 55,
      EC: 45,
      SV: 50,
      CH: 70,
      LS: 60
    }
  },
  {
    id: 2,
    date: '2024-02-25',
    scores: {
      TF: 75,
      GM: 45,
      AU: 70,
      SE: 50,
      EC: 40,
      SV: 55,
      CH: 65,
      LS: 65
    }
  }
])

// 职位推荐相关数据
const jobDialogVisible = ref(false)
const currentTestType = ref('')
const recommendedJobs = ref([])

// 图表引用
const hollandChartRefs = ref([])
const anchorChartRefs = ref([])

// 设置图表引用
const setChartRef = (el, type, index) => {
  if (el) {
    if (type === 'holland') {
      hollandChartRefs.value[index] = el
    } else {
      anchorChartRefs.value[index] = el
    }
  }
}

// 霍兰德类型名称映射
const getHollandTypeName = (type) => {
  const map = {
    'R': '现实型',
    'I': '研究型',
    'A': '艺术型',
    'S': '社会型',
    'E': '企业型',
    'C': '常规型'
  }
  return `${map[type]}(${type})`
}

// 霍兰德类型颜色映射
const getHollandTagType = (type) => {
  const map = {
    'R': 'success',
    'I': 'info',
    'A': 'warning',
    'S': 'primary',
    'E': 'danger',
    'C': ''
  }
  return map[type] || ''
}

// 职业锚点类型名称映射
const getAnchorTypeName = (type) => {
  const map = {
    'TF': '技术/功能型',
    'GM': '管理型',
    'AU': '自主/独立型',
    'SE': '安全/稳定型',
    'EC': '创业型',
    'SV': '服务型',
    'CH': '挑战型',
    'LS': '生活型'
  }
  return `${map[type]}(${type})`
}

// 职业锚点类型颜色映射
const getAnchorTagType = (type) => {
  const map = {
    'TF': 'success',
    'GM': 'primary',
    'AU': 'warning',
    'SE': 'info',
    'EC': 'danger',
    'SV': '',
    'CH': 'success',
    'LS': 'info'
  }
  return map[type] || ''
}

// 获取主导类型
const getPrimaryType = (scores, type) => {
  let maxType = ''
  let maxScore = -1
  
  for (const [key, value] of Object.entries(scores)) {
    if (value > maxScore) {
      maxScore = value
      maxType = key
    }
  }
  
  return type === 'holland' ? getHollandTypeName(maxType) : getAnchorTypeName(maxType)
}

// 获取类型描述
const getTypeDescription = (type, testType) => {
  // 这里可以根据主导类型提供相应的描述
  if (testType === 'holland') {
    const descriptions = {
      '现实型(R)': '喜欢操作工具、机器或动植物等具体的事物，有机械操作能力和手工技能，喜欢实际的工作。',
      '研究型(I)': '喜欢观察、分析和探索事物，偏好抽象思考和科学研究，有强烈的求知欲。',
      '艺术型(A)': '富有想象力和创造力，喜欢艺术活动和非结构化的工作环境，追求自我表达。',
      '社会型(S)': '喜欢与人交往，善于理解他人，乐于帮助、教导、治疗或服务他人。',
      '企业型(E)': '有领导和说服能力，喜欢管理、组织和影响他人工作，以实现组织目标或经济利益。',
      '常规型(C)': '喜欢按规则和常规工作，注重细节和准确性，善于组织和管理数据。'
    }
    
    for (const key in descriptions) {
      if (type.includes(key.split('(')[0])) {
        return descriptions[key]
      }
    }
  } else {
    const descriptions = {
      '技术/功能型(TF)': '追求专业技能的发展和精通，重视在专业领域内的成就和认可。',
      '管理型(GM)': '渴望负责整个组织的成败，追求更高的管理职位和责任。',
      '自主/独立型(AU)': '重视工作上的自由和独立，不喜欢受到组织规则和限制的约束。',
      '安全/稳定型(SE)': '重视工作和收入的稳定性，追求长期的职业安全保障。',
      '创业型(EC)': '喜欢创造自己的事业，热衷于寻找创新机会和冒险。',
      '服务型(SV)': '追求能够帮助他人和社会的工作，重视工作的社会价值和意义。',
      '挑战型(CH)': '追求解决困难问题的机会，喜欢挑战和竞争，渴望克服看似不可能的障碍。',
      '生活型(LS)': '重视工作与个人生活的平衡，寻求能够兼顾事业和家庭的职业选择。'
    }
    
    for (const key in descriptions) {
      if (type.includes(key.split('(')[0])) {
        return descriptions[key]
      }
    }
  }
  
  return '暂无描述'
}

// 初始化霍兰德雷达图
const initHollandChart = (index) => {
  const history = hollandHistory.value[index]
  if (!history || !hollandChartRefs.value[index]) return
  
  const chart = echarts.init(hollandChartRefs.value[index])
  const option = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: '现实型(R)', max: 100 },
        { name: '研究型(I)', max: 100 },
        { name: '艺术型(A)', max: 100 },
        { name: '社会型(S)', max: 100 },
        { name: '企业型(E)', max: 100 },
        { name: '常规型(C)', max: 100 }
      ]
    },
    series: [
      {
        name: '霍兰德类型分数',
        type: 'radar',
        data: [
          {
            value: [
              history.scores.R,
              history.scores.I,
              history.scores.A,
              history.scores.S,
              history.scores.E,
              history.scores.C
            ],
            name: '分数',
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.3)'
            }
          }
        ]
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', function() {
    chart.resize()
  })
}

// 初始化职业锚点条形图
const initAnchorChart = (index) => {
  const history = anchorHistory.value[index]
  if (!history || !anchorChartRefs.value[index]) return
  
  const chart = echarts.init(anchorChartRefs.value[index])
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 100
    },
    yAxis: {
      type: 'category',
      data: ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'],
      axisLabel: {
        formatter: function(value) {
          return getAnchorTypeName(value).split('(')[0]
        }
      }
    },
    series: [
      {
        name: '分数',
        type: 'bar',
        data: [
          history.scores.TF,
          history.scores.GM,
          history.scores.AU,
          history.scores.SE,
          history.scores.EC,
          history.scores.SV,
          history.scores.CH,
          history.scores.LS
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#67C23A', '#409EFF', '#E6A23C', '#909399', '#F56C6C', '#606266', '#67C23A', '#409EFF']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', function() {
    chart.resize()
  })
}

// 查看职位推荐
const viewJobRecommendations = (history, type) => {
  currentTestType.value = type
  
  // 模拟获取推荐职位
  const mockJobs = [
    {
      id: 1,
      title: '软件开发工程师',
      industry: 'IT技术',
      description: '负责软件产品的设计、开发与维护，解决技术问题，优化产品性能。',
      hollandTypes: ['R', 'I', 'C'],
      anchorTypes: ['TF', 'CH'],
      matchScore: 95
    },
    {
      id: 2,
      title: '数据分析师',
      industry: 'IT技术',
      description: '收集、处理和分析数据，发现数据中的规律和趋势，为业务决策提供支持。',
      hollandTypes: ['I', 'C'],
      anchorTypes: ['TF', 'AU'],
      matchScore: 88
    },
    {
      id: 3,
      title: '研究员',
      industry: '科研',
      description: '进行科学研究和技术开发，解决专业领域内的复杂问题。',
      hollandTypes: ['I', 'A'],
      anchorTypes: ['TF', 'AU', 'CH'],
      matchScore: 84
    },
    {
      id: 4,
      title: 'IT项目经理',
      industry: 'IT技术',
      description: '规划和管理IT项目的实施，协调团队工作，确保项目按时高质量完成。',
      hollandTypes: ['E', 'I', 'S'],
      anchorTypes: ['GM', 'TF'],
      matchScore: 75
    }
  ]
  
  recommendedJobs.value = mockJobs
  jobDialogVisible.value = true
}

// 获取匹配状态
const getMatchStatus = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return ''
  if (score >= 50) return 'warning'
  return 'exception'
}

// 查看职位详情
const viewJobDetail = (job) => {
  ElMessage.success(`正在查看职位：${job.title}`)
  // 实际应用中可以跳转到职位详情页
}

// 收藏职位
const saveJob = (job) => {
  ElMessage.success(`已收藏职位：${job.title}`)
  // 实际应用中可以调用API保存收藏
}

// 前往测评页面
const goToQuiz = () => {
  router.push('/job-quiz')
}

const saveProfile = () => {
  // 这里添加保存个人信息的逻辑
  ElMessage.success('保存成功')
  isEditing.value = false
}

const cancelEdit = () => {
  // 重置表单数据
  userInfo.value = {
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    education: 'bachelor',
    workYears: 3
  }
  isEditing.value = false
}

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    // 初始化所有霍兰德雷达图
    hollandChartRefs.value = new Array(hollandHistory.value.length)
    for (let i = 0; i < hollandHistory.value.length; i++) {
      initHollandChart(i)
    }
    
    // 初始化所有职业锚点条形图
    anchorChartRefs.value = new Array(anchorHistory.value.length)
    for (let i = 0; i < anchorHistory.value.length; i++) {
      initAnchorChart(i)
    }
  })
})
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-top: 20px;
}

.profile-card, .history-card {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.history-tabs {
  margin-top: 10px;
}

.history-item-card {
  margin-bottom: 15px;
}

.history-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-card-header h4 {
  margin: 0;
  color: #303133;
}

.result-chart {
  margin: 10px 0;
}

.radar-chart, .bar-chart {
  width: 100%;
  height: 220px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.result-description {
  margin-top: 10px;
  border-top: 1px solid #EBEEF5;
  padding-top: 10px;
}

.type-description {
  color: #606266;
  font-size: 14px;
  margin-top: 5px;
}

.job-recommendation-container {
  padding: 10px;
}

.job-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.job-card {
  transition: transform 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.job-card-header h3 {
  margin: 0;
  color: #303133;
}

.job-tags {
  margin: 10px 0;
}

.holland-tags, .anchor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}

.job-description {
  color: #606266;
  font-size: 14px;
  margin: 10px 0;
  min-height: 40px;
}

.job-match {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.job-match span {
  white-space: nowrap;
  font-weight: bold;
}

.job-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* 优化时间轴组件 */
:deep(.el-timeline-item__node) {
  margin-top: 0;
}

:deep(.el-timeline-item__content) {
  padding-bottom: 10px;
}

:deep(.el-timeline-item__timestamp) {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .job-cards {
    grid-template-columns: 1fr;
  }
}
</style> 