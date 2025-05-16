<template>
<div>
  <div class="card" style="margin-bottom: 5px">
    <el-input style="width: 240px;margin-right: 10px" v-model="data.name" placeholder="请输入名称查询" :prefix-icon="Search"></el-input>
    <el-button type="primary">查 询</el-button>
  </div>
  <div class="card" style="margin-bottom: 5px">
    <el-button type="success">新增</el-button>
    <el-button type="danger">删除</el-button>
  </div>
  <div class="card" style="margin-bottom: 5px">

  </div>
</div>


</template>


<script setup>
import { reactive  } from "vue";
import {Search} from "@element-plus/icons-vue";
const data = reactive({
  name:null
})

</script>