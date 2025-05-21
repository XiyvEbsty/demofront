<template>
  <div>
    <!-- 头部区域开始-->
    <div style="height:60px;display: flex;">
      <div style="width:210px;display: flex;align-items: center;padding-left:10px;background-color: #f5f7fa ">
        <img style="width: 40px;height: 40px;border-radius: 50%" src="@/assets/imgs/logo.png" alt="">
        <span style="font-size: 20px; font-weight: bold;color: #375959;margin-left: 15px">职位推荐系统</span>
      </div>
      <div style="flex:1;display: flex;align-items: center;padding-left:20px;border-bottom: 1px solid #ddd">
        <div style="display: flex; align-items: center;">
          <el-button 
            type="primary" 
            plain 
            size="small"
            @click="router.push('/')"
          >
            <el-icon style="margin-right: 5px;"><HomeFilled /></el-icon>
            返回主页
          </el-button>
        </div>
      </div>
      <!-- 头像 -->
      <div style="width: fit-content;padding-right: 20px;display: flex;align-items: center;border-bottom: 1px solid #ddd">
        <el-dropdown>
          <div style="display: flex;align-items: center">
            <img style="width: 40px;height: 40px;border-radius: 50%" :src="userInfo.avatar" alt="">
            <span style="margin-left: 5px">{{ userInfo.nickname }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">个人信息</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              <el-dropdown-item @click="router.push('/profile?tab=password')">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 头部区域结束 -->

    <!-- 下方区域开始 -->
    <div style="display: flex; height: calc(100vh - 60px); overflow: hidden;">
      <!-- 菜单区域开始 -->
      <div style="width: 210px; height: 100%; overflow-y: auto; background-color: #fff; border-right: 1px solid #e6e6e6;">
        <el-menu 
          :default-active="activeMenu"
          style="height: 100%; border-right: none;"
          @select="handleSelect"
          text-color="#333"
          active-text-color="#409EFF"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/manager/question">
              <el-icon><Document /></el-icon>
              <span>测评题库</span>
            </el-menu-item>
            <el-menu-item index="/manager/users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/manager/stats">
              <el-icon><DataAnalysis /></el-icon>
              <span>统计分析</span>
            </el-menu-item>
            <el-menu-item index="/manager/knowledge-graph">
              <el-icon><Connection /></el-icon>
              <span>知识图谱</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <!-- 菜单区域结束 -->

      <!--数据渲染区域开始 -->
      <div style="flex:1; overflow-y: auto; background-color: #f5f7fa;">
        <RouterView/>
      </div>
      <!-- 数据渲染区域结束 -->
    </div>
  </div>
</template>

<script setup>
import {Document, Location, User, DataAnalysis, Connection, HomeFilled} from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router'
import { userInfo } from '@/store/user'
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 计算当前路由名称
const currentRoute = computed(() => {
  const pathMap = {
    '/home': '首页',
    '/job-quiz': '职位测评',
    '/profile': '个人信息',
    '/job-recommendations': '职位推荐',
    '/quiz-history': '测评历史'
  }
  return pathMap[route.path] || '首页'
})

const handleSelect = (key) => {
  router.push(key)
}

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
    // 跳转到登录页
    router.push('/login')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<style scoped>
.el-menu {
  border-right: none !important;
}

.el-menu-item {
  color: #333 !important;
}

.el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409EFF !important;
  border-right: 3px solid #409EFF;
}

.el-menu-item:hover {
  background-color: #f5f7fa !important;
}

.el-sub-menu__title {
  color: #333 !important;
}

.el-sub-menu__title:hover {
  background-color: #f5f7fa !important;
}

.el-menu--collapse {
  width: 64px;
}

.el-menu-item .el-icon,
.el-sub-menu__title .el-icon {
  color: #333 !important;
}

.el-menu-item.is-active .el-icon {
  color: #409EFF !important;
}

.el-sub-menu.is-active .el-sub-menu__title {
  color: #409EFF !important;
}
</style>