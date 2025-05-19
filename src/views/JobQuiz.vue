<template>
  <AppLayout>
    <div class="quiz-container">
      <el-card v-if="!quizCompleted">
        <template #header>
          <div class="card-header">
            <h2>职业兴趣测评</h2>
            <div class="progress">题目进度: {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</div>
          </div>
        </template>

        <div v-if="currentQuestion" class="question-section">
          <div class="question-text">{{ currentQuestion.text }}</div>
          <div class="options">
            <el-radio-group v-model="currentAnswer" @change="handleAnswer">
              <el-radio 
                v-for="score in [5, 4, 3, 2, 1]" 
                :key="score" 
                :label="score"
                class="option-item"
              >
                <div class="option-content">
                  <span class="option-score">{{ score }}</span>
                  <span class="option-text">{{ getOptionLabel(score) }}</span>
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

        <!-- 题目预览区（移到题目下方） -->
        <div class="question-preview">
          <div class="preview-title">整卷预览</div>
          <div class="preview-items">
            <div 
              v-for="(_, index) in quizQuestions" 
              :key="index" 
              :class="['preview-item', {
                'answered': answeredQuestions[index],
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
          <h3>您的霍兰德职业兴趣类型得分：</h3>
          <div class="score-grid">
            <div v-for="(score, type) in scores" :key="type" class="score-item">
              <div class="type-label">{{ getTypeLabel(type) }}</div>
              <el-progress type="dashboard" :percentage="Math.round(score * 20)" />
              <div class="type-description">{{ getTypeDescription(type) }}</div>
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { questions } from '../data/questions'
import { ElMessage } from 'element-plus'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()
const totalQuestions = 20 // 设置要随机抽取的题目数量
const quizQuestions = ref([])
const currentQuestionIndex = ref(0)
const quizCompleted = ref(false)
const currentAnswer = ref(null)
const answeredQuestions = reactive({}) // 记录已回答的题目
const answers = reactive({}) // 存储所有答案

// RIASEC得分
const scores = ref({
  R: 0, // 实际型
  I: 0, // 研究型
  A: 0, // 艺术型
  S: 0, // 社会型
  E: 0, // 企业型
  C: 0  // 常规型
})

// 随机抽取题目
const getRandomQuestions = () => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, totalQuestions)
}

// 当前题目
const currentQuestion = computed(() => {
  return quizQuestions.value[currentQuestionIndex.value]
})

// 处理答题
const handleAnswer = (value) => {
  // 记录答案
  answers[currentQuestionIndex.value] = value
  
  // 标记题目已回答
  answeredQuestions[currentQuestionIndex.value] = true
  
  // 延迟后自动进入下一题（给用户时间看到选中效果）
  setTimeout(() => {
    if (currentQuestionIndex.value < totalQuestions - 1) {
      nextQuestion()
    }
  }, 300)
}

// 获取选项标签
const getOptionLabel = (score) => {
  const labels = {
    5: '非常符合',
    4: '比较符合',
    3: '一般',
    2: '比较不符合',
    1: '非常不符合'
  }
  return labels[score]
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value++
    // 如果已回答过，显示答案
    currentAnswer.value = answers[currentQuestionIndex.value] || null
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
      if (!answeredQuestions[i]) {
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
    currentAnswer.value = answers[currentQuestionIndex.value] || null
  }
}

// 跳转到指定题目
const jumpToQuestion = (index) => {
  currentQuestionIndex.value = index
  currentAnswer.value = answers[index] || null
}

// 计算得分
const calculateScores = () => {
  // 重置得分
  Object.keys(scores.value).forEach(key => {
    scores.value[key] = 0
  })
  
  // 计算每种类型的得分
  Object.keys(answers).forEach(index => {
    const questionType = quizQuestions.value[index].type
    scores.value[questionType] += answers[index] / totalQuestions
  })
}

// 获取类型标签
const getTypeLabel = (type) => {
  const labels = {
    R: '实际型 (Realistic)',
    I: '研究型 (Investigative)',
    A: '艺术型 (Artistic)',
    S: '社会型 (Social)',
    E: '企业型 (Enterprising)',
    C: '常规型 (Conventional)'
  }
  return labels[type]
}

// 获取类型描述
const getTypeDescription = (type) => {
  const descriptions = {
    R: '喜欢动手操作、制作、修理物品',
    I: '喜欢研究、分析、探索新知识',
    A: '具有创造力，喜欢艺术表现',
    S: '喜欢与人交往，乐于助人',
    E: '具有领导能力，善于组织管理',
    C: '喜欢按规则办事，注重细节'
  }
  return descriptions[type]
}

// 跳转到职业推荐页面
const goToRecommendations = () => {
  // 将分数保存到 localStorage
  localStorage.setItem('riasecScores', JSON.stringify(scores.value))
  router.push('/job-recommendations')
}

// 重新开始测评
const restartQuiz = () => {
  currentQuestionIndex.value = 0
  quizCompleted.value = false
  currentAnswer.value = null
  Object.keys(scores.value).forEach(key => {
    scores.value[key] = 0
  })
  Object.keys(answeredQuestions).forEach(key => {
    delete answeredQuestions[key]
  })
  Object.keys(answers).forEach(key => {
    delete answers[key]
  })
  quizQuestions.value = getRandomQuestions()
}

// 组件挂载时初始化题目
onMounted(() => {
  quizQuestions.value = getRandomQuestions()
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
  cursor: help;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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