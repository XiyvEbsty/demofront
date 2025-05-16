

<template>
<div>
  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button>


  <div>
    <el-icon size="25" color="blue"><Delete /></el-icon>
    <el-input placeholder="Pick a date" :suffix-icon="Calendar"/>
  </div>

</div>

</template>


<script setup>

import {Calendar} from "@element-plus/icons-vue";
</script>