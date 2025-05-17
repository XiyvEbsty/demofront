<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar" />
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <el-button type="primary" size="small" class="change-avatar-btn">
                更换头像
              </el-button>
            </el-upload>
          </div>
          <div class="user-info">
            <h2>{{ userInfo.nickname }}</h2>
            <p class="user-role">{{ userInfo.role }}</p>
          </div>
          <el-divider />
          <div class="info-list">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>用户名：{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <span>邮箱：{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>手机：{{ userInfo.phone }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧功能区域 -->
      <el-col :span="16">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="昵称">
                <el-input v-model="userInfo.nickname" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="手机">
                <el-input v-model="userInfo.phone" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveBasicInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 修改密码 -->
          <el-tab-pane label="修改密码" name="password">
            <el-form :model="passwordForm" label-width="100px">
              <el-form-item label="原密码">
                <el-input v-model="passwordForm.oldPassword" type="password" />
              </el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="passwordForm.newPassword" type="password" />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input v-model="passwordForm.confirmPassword" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 测评历史 -->
          <el-tab-pane label="测评历史" name="history">
            <el-timeline>
              <el-timeline-item
                v-for="(history, index) in quizHistory"
                :key="index"
                :timestamp="history.date"
                placement="top"
              >
                <el-card>
                  <h4>测评结果</h4>
                  <p>主要倾向：{{ history.dominantType }}</p>
                  <p>推荐职位：{{ history.recommendations[0].title }}</p>
                  <el-button type="text" @click="viewDetail(history)">查看详情</el-button>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>

          <!-- 简历管理 -->
          <el-tab-pane label="简历管理" name="resume">
            <div class="resume-upload">
              <el-upload
                class="upload-demo"
                drag
                action="#"
                :on-change="handleResumeChange"
                :before-upload="beforeResumeUpload"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 PDF、Word 格式，文件大小不超过 10MB
                  </div>
                </template>
              </el-upload>
            </div>
            <div class="resume-list" v-if="resumeList.length > 0">
              <h3>已上传简历</h3>
              <el-table :data="resumeList" style="width: 100%">
                <el-table-column prop="name" label="文件名" />
                <el-table-column prop="date" label="上传时间" />
                <el-table-column prop="size" label="文件大小" />
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text" @click="viewResume(scope.row)">查看</el-button>
                    <el-button type="text" @click="deleteResume(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Message, Phone, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userInfo, updateUserInfo } from '@/store/user'

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 测评历史
const quizHistory = ref([
  {
    date: '2024-03-15',
    dominantType: '技术类',
    recommendations: [
      { title: '软件工程师', description: '负责系统开发、代码编写和技术实现' }
    ]
  },
  {
    date: '2024-03-10',
    dominantType: '管理类',
    recommendations: [
      { title: '项目经理', description: '负责项目管理和团队协调' }
    ]
  }
])

// 简历列表
const resumeList = ref([
  {
    name: '个人简历.pdf',
    date: '2024-03-15',
    size: '2.5MB'
  }
])

// 当前激活的标签页
const activeTab = ref('basic')

// 头像上传前的处理
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 简历上传前的处理
const beforeResumeUpload = (file) => {
  const isPDF = file.type === 'application/pdf'
  const isWord = file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isPDF && !isWord) {
    ElMessage.error('简历只能是 PDF 或 Word 格式!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('简历大小不能超过 10MB!')
    return false
  }
  return true
}

// 处理简历上传
const handleResumeChange = (file) => {
  // 这里添加简历上传的逻辑
  ElMessage.success('简历上传成功')
}

// 保存基本信息
const saveBasicInfo = () => {
  // 更新全局状态
  updateUserInfo({
    nickname: userInfo.value.nickname,
    email: userInfo.value.email,
    phone: userInfo.value.phone
  })
  ElMessage.success('基本信息保存成功')
}

// 修改密码
const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  // 这里添加修改密码的逻辑
  ElMessage.success('密码修改成功')
}

// 查看测评详情
const viewDetail = (history) => {
  // 这里添加查看详情的逻辑
  console.log('查看详情', history)
}

// 查看简历
const viewResume = (resume) => {
  // 这里添加查看简历的逻辑
  console.log('查看简历', resume)
}

// 删除简历
const deleteResume = (resume) => {
  // 这里添加删除简历的逻辑
  ElMessage.success('简历删除成功')
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  min-height: calc(100vh - 100px);
}

.profile-card {
  text-align: center;
}

.avatar-container {
  margin: 20px 0;
  position: relative;
  display: inline-block;
}

.change-avatar-btn {
  margin-top: 10px;
}

.user-info {
  margin: 20px 0;
}

.user-info h2 {
  margin: 10px 0;
  color: #303133;
}

.user-role {
  color: #909399;
  font-size: 14px;
}

.info-list {
  text-align: left;
  padding: 0 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  color: #606266;
}

.info-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
}

.profile-tabs {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.resume-upload {
  margin-bottom: 30px;
}

.resume-list {
  margin-top: 20px;
}

.resume-list h3 {
  margin-bottom: 20px;
  color: #303133;
}

.el-timeline-item__content {
  color: #606266;
}

.el-timeline-item__timestamp {
  color: #909399;
}
</style> 