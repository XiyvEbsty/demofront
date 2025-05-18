<template>
  <div class="app-layout">
    <!-- 顶部导航栏背景 -->
    <div class="nav-container">
      <!-- 顶部导航栏 -->
      <el-menu mode="horizontal" :router="true" class="nav-menu">
        <el-menu-item index="/">主页</el-menu-item>
        
        <!-- 职位测评下拉菜单 -->
        <el-sub-menu index="2">
          <template #title>职位测评</template>
          <el-menu-item index="/job-quiz">霍兰德测评</el-menu-item>
          <el-menu-item index="/career-anchor-quiz">职业锚点测评</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/job-recommendations">职位推荐</el-menu-item>
        <el-menu-item index="/profile">个人中心</el-menu-item>
        
        <!-- 未登录状态显示登录按钮 -->
        <el-menu-item v-if="!isLoggedIn" index="/login" class="login-button">登录</el-menu-item>
        
        <!-- 已登录状态显示用户信息和下拉菜单 -->
        <div v-else class="user-dropdown">
          <el-dropdown trigger="hover">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar"></el-avatar>
              <span class="username">{{ userInfo.nickname }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-menu>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { userInfo } from '../store/user'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

// 用户登录状态
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

// 检查用户角色
const userRole = computed(() => {
  return localStorage.getItem('userRole')
})

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 清除登录状态
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    // 跳转到首页
    router.push('/')
  }).catch(() => {
    // 取消退出
  })
}

// 在组件挂载时检查登录状态
onMounted(() => {
  // 如果有必要，可以在这里添加其他初始化逻辑
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-container {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
}

.nav-menu {
  display: flex;
  justify-content: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.el-menu-item {
  padding: 0 35px;
}

.login-button {
  position: absolute;
  right: 20px;
}

.user-dropdown {
  position: absolute;
  right: 20px;
  height: 60px;
  display: flex;
  align-items: center;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}

/* 用户信息和下拉菜单样式 */
.user-dropdown {
  margin-left: auto;
  height: 60px;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  height: 40px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin-left: 8px;
  margin-right: 4px;
  font-size: 14px;
  color: #606266;
}

.user-info:hover .username {
  color: #409EFF;
}
</style> 