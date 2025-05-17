<template>
  <div>
    <!-- 头部区域开始-->
    <div style="height:60px;display: flex;">
      <div style="width:210px;display: flex;align-items: center;padding-left:10px;background-color: #f5f7fa ">
        <img style="width: 40px;height: 40px;border-radius: 50%" src="@/assets/imgs/logo.png" alt="">
        <span style="font-size: 20px; font-weight: bold;color: #375959;margin-left: 15px">职位推荐系统</span>
      </div>
      <div style="flex:1;display: flex;align-items: center;padding-left:20px ;border-bottom: 1px solid #ddd">
        首页 / 数据分析
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
              <el-dropdown-item>退出登录</el-dropdown-item>
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
      <div style="width: 210px; height: 100%; overflow-y: auto; background-color: #c7d8ca;">
        <el-menu 
          default-active="/home" 
          style="height: 100%; border-right: none;"
          @select="handleSelect"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/job-quiz">
              <el-icon><Document /></el-icon>
              <span>职位测评</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <!-- 菜单区域结束 -->

      <!--数据渲染区域开始 -->
      <div style="flex:1; overflow-y: auto; background-color: #efefea;">
        <RouterView/>
      </div>
      <!-- 数据渲染区域结束 -->
    </div>

  </div>

</template>

<script setup>
import {House, Document} from "@element-plus/icons-vue";
import { useRouter } from 'vue-router'
import { userInfo } from '@/store/user'

const router = useRouter()

const handleSelect = (key) => {
  router.push(key)
}
</script>

<style scoped>
.manager-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #409EFF 0%, #36D1DC 100%);
  color: white;
  height: 100%;
  transition: all 0.3s;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2em;
  color: white;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-left: 4px solid white;
}

.menu-item i {
  margin-right: 10px;
  font-size: 1.2em;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.header {
  background: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left i {
  font-size: 1.5em;
  color: #409EFF;
  margin-right: 10px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-right i {
  font-size: 1.2em;
  color: #409EFF;
  margin-left: 20px;
  cursor: pointer;
}

.content {
  padding: 20px;
}

.el-dropdown-menu {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-dropdown-menu__item {
  padding: 8px 20px;
  color: #606266;
}

.el-dropdown-menu__item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}
</style>