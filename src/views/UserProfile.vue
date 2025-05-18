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
          </div>
        </template>

        <el-timeline>
          <el-timeline-item
            v-for="(history, index) in quizHistory"
            :key="index"
            :timestamp="history.date"
            placement="top"
          >
            <el-card>
              <h4>测评结果</h4>
              <div class="result-tags">
                <el-tag 
                  v-for="(score, type) in history.scores" 
                  :key="type"
                  :type="getTagType(type)"
                >
                  {{ type }}: {{ score }}%
                </el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const isEditing = ref(false)
const userInfo = ref({
  username: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  education: 'bachelor',
  workYears: 3
})

// 模拟测评历史数据
const quizHistory = ref([
  {
    date: '2024-03-15',
    scores: {
      R: 60,
      I: 80,
      A: 40,
      S: 70,
      E: 50,
      C: 30
    }
  },
  {
    date: '2024-03-01',
    scores: {
      R: 50,
      I: 70,
      A: 60,
      S: 80,
      E: 40,
      C: 30
    }
  }
])

const getTagType = (type) => {
  const typeMap = {
    R: 'success',
    I: 'info',
    A: 'warning',
    S: 'primary',
    E: 'danger',
    C: ''
  }
  return typeMap[type]
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
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style> 