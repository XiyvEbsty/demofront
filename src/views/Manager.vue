<template>
  <div>
    <!-- 头部区域开始-->
    <div style="height:60px;display: flex;">
      <div style="width:210px;display: flex;align-items: center;padding-left:10px;background-color: #c7d8ca ">
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
            <img style="width: 40px;height: 40px;border-radius: 50%" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">
            <span style="margin-left: 5px">管理员</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
            </el-dropdown-menu>

          </template>
        </el-dropdown>

      </div>
    </div>
    <!-- 头部区域结束 -->

    <!-- 下方区域开始 -->
    <div style="display: flex">
      <!-- 菜单区域开始 -->
      <div style="width: 210px">
        <el-menu default-active="/manager/home" style="min-height: calc(100vh - 60px)">
          <el-menu-item index="/manager/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="1-1">二级菜单</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <!-- 菜单区域结束 -->

      <!--数据渲染区域开始 -->
      <div style="flex:1;width 0;padding: 10px;background-color: #efefea">
        <RouterView/>
      </div>
      <!-- 数据渲染区域结束 -->
  </div>

  </div>

</template>

<script setup>

import {House} from "@element-plus/icons-vue";
</script>

<style>
.el-menu{
  background-color: #c7d8ca;
  border:none;
  box-shadow: 0 0 8px rgba(0, 0, 0, .12);
}
.el-sub-menu__title{
  background-color: #c7d8ca;
  color: #bd2525;
}
.el-menu-item{
  height: 50px;
  color: #bd2525;
}
.el-sub-menu.is-active{
  background-color: #cabbbb;
  color: rgb(121.3, 187.1, 255);
}
.el-sub-menu__title:hover{
  background-color: #c7d8ca;
}
.el-menu-item:not(.is-active)hover{
  background-color: #18aeae;
  color: #bd2525;
}
.el-tooltip__trigger{
  outline: none;
}
.el-dropdown{
/*  鼠标移入小手*/
  cursor: pointer;
}
</style>