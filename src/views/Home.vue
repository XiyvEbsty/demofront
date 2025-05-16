

<template>
<div>
  <el-button>Default</el-button>
  <el-button type="primary" style="background: #3741fb">测试颜色</el-button>
  <el-button type="success">Success</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button>


  <div>
    <el-icon size="25" color="blue"><Delete /></el-icon>
    <el-input placeholder="Pick a date" :suffix-icon="Calendar" :prefix-icon="Search"/>
  </div>

</div>

</template>


<script setup>

import {Calendar, Search} from "@element-plus/icons-vue";
</script>