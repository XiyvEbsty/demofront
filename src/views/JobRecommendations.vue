<template>
  <AppLayout>
    <div class="job-recommendations">
      <h1>最佳职位推荐</h1>
      
      <!-- 测评结果提示 -->
      <div v-if="!hasTestResults" class="no-results-tip">
        <el-alert
          title="您尚未完成职业测评"
          type="warning"
          description="请完成霍兰德职业兴趣测评和职业锚点测评，以获取更精准的职位推荐"
          show-icon
          :closable="false"
        />
        <div class="tip-actions">
          <el-button type="primary" @click="router.push('/job-quiz')">去完成霍兰德测评</el-button>
          <el-button type="primary" @click="router.push('/career-anchor-quiz')">去完成职业锚点测评</el-button>
        </div>
      </div>
      
      <!-- 测评结果概览 -->
      <div v-if="hasTestResults" class="result-summary">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">
              <span>测评结果概览</span>
              <el-button text @click="showAssessmentDetails = true">查看详情</el-button>
            </div>
          </template>
          
          <div class="summary-content">
            <div class="summary-item">
              <h3>霍兰德职业兴趣主导类型</h3>
              <div class="type-badges">
                <el-tag 
                  v-for="(type, index) in topHollandTypes" 
                  :key="index"
                  :type="getTagType(index)"
                  effect="dark"
                >
                  {{ getHollandTypeLabel(type) }}
                </el-tag>
              </div>
            </div>
            
            <div class="summary-item">
              <h3>职业锚点主导类型</h3>
              <div class="type-badges">
                <el-tag 
                  v-for="(type, index) in topAnchorTypes" 
                  :key="index"
                  :type="getTagType(index)"
                  effect="dark"
                >
                  {{ getAnchorTypeLabel(type) }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 职位推荐列表 -->
      <div class="filter-section">
        <el-select v-model="selectedIndustry" placeholder="选择行业" clearable @change="filterJobs">
          <el-option
            v-for="industry in industries"
            :key="industry"
            :label="industry"
            :value="industry"
          />
        </el-select>
      </div>
      
      <div class="recommendations-container">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(job, index) in displayedJobs" :key="index">
            <el-card class="job-card" shadow="hover" @click="searchJobOnBoss(job.title)" style="cursor: pointer;">
              <div class="match-score">
                <span class="score-label">匹配度</span>
                <el-progress
                  type="circle"
                  :percentage="Math.round(job.matchScore)"
                  :color="getMatchScoreColor(job.matchScore)"
                  :width="50"
                />
              </div>
              
              <h3>{{ job.title }}</h3>
              <div class="industry-label">{{ job.industry }}</div>
              
              <div class="job-tags">
                <el-tag v-for="(tag, idx) in job.tags" :key="idx" :type="tag.type">
                  {{ tag.text }}
                </el-tag>
              </div>
              
              <p class="job-salary">{{ job.salary }}</p>
              <p class="job-description">{{ job.description }}</p>
              
              <div class="divider"></div>
              
              <div class="job-detail-section">
                <div class="section-title">技术要求</div>
                <p>{{ job.technicalRequirements }}</p>
              </div>
              
              <div class="job-detail-section">
                <div class="section-title">能力要求</div>
                <p>{{ job.skillRequirements }}</p>
              </div>
              
              <div class="job-requirements">
                <div class="section-title">核心技能：</div>
                <el-tag 
                  v-for="(skill, idx) in job.requirements" 
                  :key="idx"
                  size="small"
                  class="requirement-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
              
              <div class="job-types">
                <div class="types-section">
                  <span class="types-label">霍兰德类型：</span>
                  <el-tag 
                    v-for="(type, idx) in job.hollandTypes" 
                    :key="idx"
                    size="small"
                    type="success"
                  >
                    {{ getHollandTypeShort(type) }}
                  </el-tag>
                </div>
                
                <div class="types-section">
                  <span class="types-label">职业锚点：</span>
                  <el-tag 
                    v-for="(type, idx) in job.anchorTypes" 
                    :key="idx"
                    size="small"
                    type="warning"
                  >
                    {{ type }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 测评详情对话框 -->
      <el-dialog
        v-model="showAssessmentDetails"
        title="测评结果详情"
        width="70%"
      >
        <div class="assessment-details">
          <div class="detail-section">
            <h3>霍兰德职业兴趣类型得分</h3>
            <div class="scores-grid">
              <div v-for="(score, type) in hollandScores" :key="type" class="score-item">
                <div class="type-label">{{ getHollandTypeLabel(type) }}</div>
                <el-progress type="dashboard" :percentage="Math.round(score * 20)" />
                <div class="type-description">{{ getHollandTypeDescription(type) }}</div>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>职业锚点类型得分</h3>
            <div class="scores-grid">
              <div v-for="(score, type) in anchorScores" :key="type" class="score-item">
                <div class="type-label">{{ getAnchorTypeLabel(type) }}</div>
                <el-progress type="dashboard" :percentage="Math.round(score / maxAnchorScore * 100)" />
                <div class="type-description">{{ getAnchorTypeDescription(type) }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobData, calculateJobMatch } from '../data/job-data'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()

// 测评结果
const hollandScores = ref(null)
const anchorScores = ref(null)
const primaryAnchorType = ref(null)
const showAssessmentDetails = ref(false)
const maxAnchorScore = 5 * 6 + 3 * 4 // 职业锚点测评的最高可能分数

// 职位推荐
const recommendedJobs = ref([])
const displayedJobs = ref([])
const selectedIndustry = ref('')

// 跳转到BOSS直聘搜索职位
const searchJobOnBoss = (jobTitle) => {
  const searchUrl = `https://www.zhipin.com/job_detail/?query=${encodeURIComponent(jobTitle)}`
  window.open(searchUrl, '_blank')
}

// 获取霍兰德测评结果
const getHollandResults = () => {
  const scores = localStorage.getItem('riasecScores')
  if (scores) {
    hollandScores.value = JSON.parse(scores)
    return true
  }
  return false
}

// 获取职业锚点测评结果
const getAnchorResults = () => {
  const scores = localStorage.getItem('careerAnchorScores')
  const primaryType = localStorage.getItem('primaryAnchorType')
  
  if (scores) {
    anchorScores.value = JSON.parse(scores)
    primaryAnchorType.value = primaryType
    return true
  }
  return false
}

// 是否有测评结果
const hasTestResults = computed(() => {
  return hollandScores.value && anchorScores.value
})

// 获取前三个主导的霍兰德类型
const topHollandTypes = computed(() => {
  if (!hollandScores.value) return []
  
  return Object.entries(hollandScores.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0])
})

// 获取前三个主导的职业锚点类型
const topAnchorTypes = computed(() => {
  if (!anchorScores.value) return []
  
  return Object.entries(anchorScores.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0])
})

// 获取所有行业列表
const industries = computed(() => {
  const industrySet = new Set(jobData.map(job => job.industry))
  return Array.from(industrySet)
})

// 根据行业过滤职位
const filterJobs = () => {
  if (!selectedIndustry.value) {
    displayedJobs.value = recommendedJobs.value
  } else {
    const filteredJobs = recommendedJobs.value.filter(job => job.industry === selectedIndustry.value)
    // 确保即使过滤后也最多只显示三个职位
    displayedJobs.value = filteredJobs.length > 0 ? filteredJobs : recommendedJobs.value
  }
}

// 获取标签类型
const getTagType = (index) => {
  const types = ['primary', 'success', 'warning']
  return types[index] || 'info'
}

// 获取匹配度颜色
const getMatchScoreColor = (score) => {
  if (score >= 80) return '#67C23A' // 高匹配 - 绿色
  if (score >= 60) return '#409EFF' // 中高匹配 - 蓝色
  if (score >= 40) return '#E6A23C' // 中等匹配 - 黄色
  return '#F56C6C' // 低匹配 - 红色
}

// 获取霍兰德类型标签
const getHollandTypeLabel = (type) => {
  const labels = {
    R: '实际型 (Realistic)',
    I: '研究型 (Investigative)',
    A: '艺术型 (Artistic)',
    S: '社会型 (Social)',
    E: '企业型 (Enterprising)',
    C: '常规型 (Conventional)'
  }
  return labels[type] || type
}

// 获取霍兰德类型简称
const getHollandTypeShort = (type) => {
  const labels = {
    R: '实际型(R)',
    I: '研究型(I)',
    A: '艺术型(A)',
    S: '社会型(S)',
    E: '企业型(E)',
    C: '常规型(C)'
  }
  return labels[type] || type
}

// 获取霍兰德类型描述
const getHollandTypeDescription = (type) => {
  const descriptions = {
    R: '喜欢动手操作、制作、修理物品',
    I: '喜欢研究、分析、探索新知识',
    A: '具有创造力，喜欢艺术表现',
    S: '喜欢与人交往，乐于助人',
    E: '具有领导能力，善于组织管理',
    C: '喜欢按规则办事，注重细节'
  }
  return descriptions[type] || ''
}

// 获取职业锚点类型标签
const getAnchorTypeLabel = (type) => {
  const labels = {
    TF: '技术/职能型',
    GM: '管理型',
    AU: '自主/独立型',
    SE: '安全/稳定型',
    EC: '创造/创业型',
    SV: '服务型',
    CH: '挑战型',
    LS: '生活型'
  }
  return labels[type] || type
}

// 获取职业锚点类型描述
const getAnchorTypeDescription = (type) => {
  const descriptions = {
    TF: '专注于专业技能发展',
    GM: '通过管理实现目标',
    AU: '追求自主决策和独立工作',
    SE: '重视工作稳定性和安全感',
    EC: '追求创新和创业机会',
    SV: '以服务他人为导向',
    CH: '享受挑战和解决难题',
    LS: '平衡工作与生活的需求'
  }
  return descriptions[type] || ''
}

// 初始化
onMounted(() => {
  // 获取测评结果
  const hasHollandResults = getHollandResults()
  const hasAnchorResults = getAnchorResults()
  
  // 如果有测评结果，进行职位推荐
  if (hasHollandResults && hasAnchorResults) {
    recommendedJobs.value = calculateJobMatch(hollandScores.value, anchorScores.value).slice(0, 3)
    displayedJobs.value = recommendedJobs.value
  } else {
    // 如果没有测评结果，使用默认职位数据（仅限三个）
    recommendedJobs.value = jobData.slice(0, 3)
    displayedJobs.value = jobData.slice(0, 3)
  }
})
</script>

<style scoped>
.job-recommendations {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.no-results-tip {
  margin: 30px 0;
}

.tip-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.result-summary {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.summary-item {
  text-align: center;
  min-width: 200px;
}

.type-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.filter-section {
  margin-bottom: 20px;
}

.recommendations-container {
  margin-top: 20px;
}

.job-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
  padding-top: 15px;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.industry-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
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

.divider {
  height: 1px;
  background-color: #EBEEF5;
  margin: 15px 0;
}

.job-detail-section {
  margin-bottom: 15px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #303133;
}

.job-requirements {
  margin-top: 15px;
  margin-bottom: 15px;
}

.requirement-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.job-types {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.types-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.types-label {
  font-size: 13px;
  color: #909399;
  margin-right: 5px;
}

/* 测评详情对话框样式 */
.assessment-details {
  padding: 10px;
}

.detail-section {
  margin-bottom: 30px;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.type-description {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style> 