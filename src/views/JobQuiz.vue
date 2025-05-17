<template>
  <div class="quiz-container">
    <el-card class="quiz-card">
      <template #header>
        <div class="card-header">
          <h2>职业倾向测评</h2>
          <div class="progress-info">
            <span>{{ currentStep + 1 }}/{{ totalSteps }}</span>
            <el-progress :percentage="progress" />
          </div>
        </div>
      </template>

      <div class="quiz-content">
        <div class="question-section">
          <h3>{{ questions[currentStep].text }}</h3>
          <div class="answer-options">
            <el-radio-group v-model="formData[questions[currentStep].id]" @change="handleAnswer(questions[currentStep].id, $event)">
              <el-radio label="true" class="answer-radio">是</el-radio>
              <el-radio label="false" class="answer-radio">否</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="navigation-buttons">
          <el-button @click="prevStep" :disabled="currentStep === 0">上一步</el-button>
          <el-button 
            type="primary" 
            @click="nextStep" 
            :disabled="currentStep === totalSteps - 1 || !formData[questions[currentStep].id]"
          >
            下一步
          </el-button>
          <el-button 
            type="success" 
            @click="submitQuiz" 
            :disabled="!isAllQuestionsAnswered"
          >
            提交测评
          </el-button>
        </div>

        <!-- 答题预览 -->
        <div class="preview-section">
          <h4>答题进度预览</h4>
          <div class="preview-grid">
            <el-tag
              v-for="(question, index) in questions"
              :key="question.id"
              :type="formData[question.id] ? 'success' : 'info'"
              class="preview-tag"
              @click="currentStep = index"
            >
              {{ index + 1 }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getRandomQuestions } from '@/data/questions'

const router = useRouter()

// 获取随机排序的题目
const questions = ref(getRandomQuestions())

// 当前步骤
const currentStep = ref(0)
const totalSteps = computed(() => questions.value.length)

// 计算进度
const progress = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

// 表单数据
const formData = ref({})

// 处理答案
const handleAnswer = (questionId, value) => {
  formData.value[questionId] = value
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 下一步
const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

// 检查是否所有题目都已回答
const isAllQuestionsAnswered = computed(() => {
  return questions.value.every(question => formData.value[question.id] !== undefined)
})

// 提交测评
const submitQuiz = () => {
  // 计算得分
  const scores = calculateScores()
  
  // 存储结果
  localStorage.setItem('quizResult', JSON.stringify({
    scores,
    date: new Date().toISOString()
  }))
  
  // 跳转到结果页面
  router.push('/job-result')
}

// 计算得分
const calculateScores = () => {
  const scores = {
    R: 0, // 现实型
    I: 0, // 研究型
    A: 0, // 艺术型
    S: 0, // 社会型
    E: 0, // 企业型
    C: 0  // 传统型
  }

  // 计算每个类型的得分
  Object.entries(formData.value).forEach(([questionId, answer]) => {
    const question = questions.value.find(q => q.id === parseInt(questionId))
    if (question && answer === 'true') {
      scores[question.type]++
    }
  })

  // 计算百分比得分
  const maxScores = {
    R: 5, // 现实型最多5题
    I: 6, // 研究型最多6题
    A: 9, // 艺术型最多9题
    S: 6, // 社会型最多6题
    E: 7, // 企业型最多7题
    C: 7  // 传统型最多7题
  }

  // 转换为百分比
  Object.keys(scores).forEach(type => {
    scores[type] = Math.round((scores[type] / maxScores[type]) * 100)
  })

  return scores
}

const getEducationLabel = (value) => {
  const educationMap = {
    high_school: '高中',
    college: '大专',
    bachelor: '本科',
    master: '硕士',
    phd: '博士'
  }
  return educationMap[value] || ''
}

const getAnswerLabel = (questionId, value) => {
  const question = questions.value.find(q => q.id === questionId)
  if (!question) return ''
  const option = question.options.find(opt => opt.value === value)
  return option ? option.label : ''
}
</script>

<style scoped>
.quiz-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.quiz-card {
  margin-bottom: 20px;
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

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 200px;
}

.progress-info span {
  margin-bottom: 5px;
  color: #606266;
}

.quiz-content {
  padding: 20px 0;
}

.question-section {
  margin-bottom: 30px;
}

.question-section h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
  line-height: 1.5;
}

.answer-options {
  margin-top: 20px;
}

.answer-options .el-radio-group {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.answer-radio {
  margin: 15px 0;
  font-size: 16px;
  padding: 10px 30px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.answer-radio:hover {
  background-color: #f5f7fa;
}

.answer-radio :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #409EFF;
  font-weight: bold;
}

.answer-radio :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #409EFF;
  border-color: #409EFF;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.answer-radio :deep(.el-radio__inner) {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.answer-radio :deep(.el-radio__inner::after) {
  width: 6px;
  height: 6px;
  transition: all 0.2s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.answer-radio :deep(.el-radio__input.is-checked .el-radio__inner::after) {
  transform: translate(-50%, -50%) scale(1.2);
  transition: all 0.2s ease;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.navigation-buttons .el-button {
  min-width: 100px;
}

.preview-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.preview-section h4 {
  margin-bottom: 15px;
  color: #606266;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
}

.preview-tag {
  cursor: pointer;
  text-align: center;
  padding: 8px;
}

.preview-tag:hover {
  opacity: 0.8;
}
</style> 