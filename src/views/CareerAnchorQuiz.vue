<template>
  <AppLayout>
    <div class="quiz-container">
      <el-card v-if="!quizCompleted">
        <template #header>
          <div class="card-header">
            <h2>职业锚点测评</h2>
            <div class="progress">题目进度: {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</div>
          </div>
        </template>

        <div v-if="currentQuestion" class="question-section">
          <div class="question-text">{{ currentQuestion.text }}</div>
          <div class="options">
            <el-radio-group v-model="currentAnswer" @change="handleAnswer">
              <el-radio 
                v-for="option in options" 
                :key="option.value" 
                :label="option.value"
                class="option-item"
              >
                <div class="option-content">
                  <span class="option-score">{{ option.value }}</span>
                  <span class="option-text">{{ option.label }}</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <div class="navigation-buttons">
            <el-button 
              @click="previousQuestion" 
              :disabled="currentQuestionIndex === 0"
              plain
            >
              上一题
            </el-button>
            <el-button 
              @click="nextQuestion" 
              type="primary"
            >
              {{ currentQuestionIndex === totalQuestions - 1 ? '提交' : '下一题' }}
            </el-button>
          </div>
        </div>

        <!-- 题目预览区（在题目下方） -->
        <div class="question-preview">
          <div class="preview-title">整卷预览</div>
          <div class="preview-items">
            <div 
              v-for="(_, index) in questions" 
              :key="index" 
              :class="['preview-item', {
                'answered': answeredQuestions[index + 1],
                'current': currentQuestionIndex === index
              }]"
              @click="jumpToQuestion(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </el-card>

      <el-card v-else class="result-card">
        <template #header>
          <div class="card-header">
            <h2>测评结果</h2>
          </div>
        </template>

        <div class="result-section">
          <h3>您的职业锚点类型得分：</h3>
          <div class="score-grid">
            <div v-for="(score, type) in scores" :key="type" class="score-item">
              <div class="type-label">{{ getTypeLabel(type) }}</div>
              <el-progress type="dashboard" :percentage="Math.round(score / maxPossibleScore * 100)" />
              <div class="type-description">{{ getTypeDescription(type) }}</div>
            </div>
          </div>

          <div class="top-types">
            <h3>您的主导职业锚点类型：</h3>
            <div v-for="(type, index) in topTypes" :key="index" class="top-type-item">
              <div class="rank">{{ index + 1 }}</div>
              <div class="type-info">
                <h4>{{ careerAnchorTypes[type].name }}</h4>
                <p>{{ careerAnchorTypes[type].fullName }}</p>
                <div class="type-score">得分: {{ scores[type] }}</div>
              </div>
            </div>
          </div>

          <div class="type-description-detail">
            <h3>主导类型详细说明：</h3>
            <div class="primary-type-card">
              <h4>{{ careerAnchorTypes[topTypes[0]].name }}</h4>
              <p>{{ careerAnchorTypes[topTypes[0]].description }}</p>
            </div>
          </div>

          <div class="result-actions">
            <el-button type="primary" @click="goToRecommendations">查看职业推荐</el-button>
            <el-button @click="restartQuiz">重新测评</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  careerAnchorQuestions, 
  careerAnchorOptions,
  careerAnchorTypes,
  calculateCareerAnchorScores 
} from '../data/career-anchor-questions'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()
const questions = careerAnchorQuestions
const options = careerAnchorOptions
const totalQuestions = questions.length
const currentQuestionIndex = ref(0)
const quizCompleted = ref(false)
const currentAnswer = ref(null)
const answeredQuestions = reactive({}) // 记录已回答的题目
const answers = reactive({}) // 存储所有答案
const scores = ref({})
const topTypes = ref([])

// 每个类型的最高可能得分（5题，每题6分，三个最高分题目每题额外4分）
const maxPossibleScore = 5 * 6 + 3 * 4

// 当前题目
const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value]
})

// 处理答题
const handleAnswer = (value) => {
  // 记录答案
  answers[currentQuestion.value.id] = value
  
  // 标记题目已回答
  answeredQuestions[currentQuestion.value.id] = true
  
  // 延迟后自动进入下一题（给用户时间看到选中效果）
  setTimeout(() => {
    if (currentQuestionIndex.value < totalQuestions - 1) {
      nextQuestion()
    }
  }, 300)
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value++
    // 如果已回答过，显示答案
    currentAnswer.value = answers[currentQuestion.value.id] || null
  } else {
    // 点击提交
    submitQuiz()
  }
}

// 提交测评
const submitQuiz = () => {
  const answeredCount = Object.keys(answeredQuestions).length
  
  if (answeredCount < totalQuestions) {
    // 如果有未答题，显示提示
    const unansweredCount = totalQuestions - answeredCount
    ElMessage.warning(`还有 ${unansweredCount} 道题目未完成，请完成所有题目后再提交`)
    
    // 找到第一个未答题的索引并跳转
    for (let i = 0; i < totalQuestions; i++) {
      const questionId = questions[i].id
      if (!answeredQuestions[questionId]) {
        jumpToQuestion(i)
        break
      }
    }
  } else {
    // 计算得分并展示结果
    calculateScores()
    quizCompleted.value = true
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    // 显示之前的答案
    currentAnswer.value = answers[currentQuestion.value.id] || null
  }
}

// 跳转到指定题目
const jumpToQuestion = (index) => {
  currentQuestionIndex.value = index
  currentAnswer.value = answers[questions[index].id] || null
}

// 计算得分
const calculateScores = () => {
  // 使用职业锚点计分规则
  const result = calculateCareerAnchorScores(answers)
  scores.value = result
  
  // 计算得分排名
  const sortedTypes = Object.entries(result)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
  
  topTypes.value = sortedTypes
}

// 获取类型标签
const getTypeLabel = (type) => {
  return careerAnchorTypes[type].name
}

// 获取类型描述
const getTypeDescription = (type) => {
  return careerAnchorTypes[type].fullName
}

// 跳转到职业推荐页面
const goToRecommendations = () => {
  // 将分数保存到 localStorage
  localStorage.setItem('careerAnchorScores', JSON.stringify(scores.value))
  localStorage.setItem('primaryAnchorType', topTypes.value[0])
  router.push('/job-recommendations')
}

// 重新开始测评
const restartQuiz = () => {
  currentQuestionIndex.value = 0
  quizCompleted.value = false
  currentAnswer.value = null
  Object.keys(scores.value).forEach(key => {
    delete scores.value[key]
  })
  Object.keys(answeredQuestions).forEach(key => {
    delete answeredQuestions[key]
  })
  Object.keys(answers).forEach(key => {
    delete answers[key]
  })
  topTypes.value = []
}

// 组件挂载时初始化
onMounted(() => {
  // 可以在这里添加其他初始化逻辑
})
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
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

.question-section {
  padding: 20px 0;
}

.question-text {
  font-size: 18px;
  margin-bottom: 30px;
  color: #303133;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-item {
  height: auto;
  margin-bottom: 15px;
  padding: 10px 0;
}

.option-content {
  display: flex;
  align-items: center;
}

.option-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f2f6fc;
  margin-right: 10px;
  font-weight: bold;
}

.option-text {
  font-size: 16px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
}

/* 整卷预览区域样式 */
.question-preview {
  margin: 15px 0;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.preview-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.preview-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-item {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.preview-item:hover {
  border-color: #409eff;
  color: #409eff;
}

.preview-item.answered {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

.preview-item.current {
  border-color: #409eff;
  color: #409eff;
  font-weight: bold;
}

.preview-item.answered.current {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.result-section {
  text-align: center;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.type-label {
  font-weight: bold;
  color: #303133;
}

.type-description {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.top-types {
  margin: 30px 0;
}

.top-type-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f7fa;
  text-align: left;
}

.rank {
  font-size: 24px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  margin-right: 20px;
}

.type-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
}

.type-info p {
  margin: 0 0 5px 0;
  color: #606266;
  font-style: italic;
}

.type-score {
  font-weight: bold;
  color: #409eff;
}

.type-description-detail {
  margin: 30px 0;
  text-align: left;
}

.primary-type-card {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.primary-type-card h4 {
  margin-top: 0;
  color: #303133;
}

.primary-type-card p {
  color: #606266;
  line-height: 1.6;
}

.result-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.progress {
  font-size: 14px;
  color: #909399;
}
</style> 