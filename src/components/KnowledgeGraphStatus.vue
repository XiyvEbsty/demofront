<template>
  <div class="graph-status-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>知识图谱状态</span>
          <el-button type="primary" size="small" @click="checkStatus" :loading="loading">
            检查连接
          </el-button>
        </div>
      </template>
      
      <div v-if="status">
        <div class="status-indicator">
          <el-tag :type="status.connected ? 'success' : 'danger'" effect="dark">
            {{ status.connected ? '已连接' : '未连接' }}
          </el-tag>
          <el-tag v-if="status.initialized" type="success" effect="plain" class="ml-2">
            已初始化
          </el-tag>
          <el-tag v-else-if="status.connected" type="warning" effect="plain" class="ml-2">
            未初始化
          </el-tag>
        </div>
        
        <p class="status-message">{{ status.message }}</p>
        
        <div v-if="status.connected" class="graph-stats">
          <el-descriptions title="知识图谱统计" :column="3" border>
            <el-descriptions-item label="霍兰德类型">
              {{ status.hollandTypeCount || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="职业锚点">
              {{ status.careerAnchorCount || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="职位数量">
              {{ status.jobNodeCount || 0 }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="action-buttons">
          <el-button 
            type="success" 
            :disabled="!status.connected || loading" 
            @click="setupGraph"
            :loading="setupLoading">
            {{ status.initialized ? '重新初始化知识图谱' : '初始化知识图谱' }}
          </el-button>
        </div>
      </div>
      
      <div v-else class="not-checked">
        <el-empty description="尚未检查连接状态"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { checkGraphStatus, setupKnowledgeGraph } from '../api/knowledgeGraph';
import { ElMessage } from 'element-plus';

export default {
  name: 'KnowledgeGraphStatus',
  setup() {
    const status = ref(null);
    const loading = ref(false);
    const setupLoading = ref(false);
    
    // 检查连接状态
    const checkStatus = async () => {
      loading.value = true;
      try {
        status.value = await checkGraphStatus();
      } catch (error) {
        console.error('检查状态失败', error);
        ElMessage.error('检查状态失败: ' + error.message);
      } finally {
        loading.value = false;
      }
    };
    
    // 设置知识图谱
    const setupGraph = async () => {
      setupLoading.value = true;
      try {
        const result = await setupKnowledgeGraph();
        if (result.success) {
          ElMessage.success(result.message);
          status.value = result.details;
        } else {
          ElMessage.error(result.message);
        }
      } catch (error) {
        console.error('设置知识图谱失败', error);
        ElMessage.error('设置知识图谱失败: ' + error.message);
      } finally {
        setupLoading.value = false;
      }
    };
    
    // 页面加载时自动检查状态
    checkStatus();
    
    return {
      status,
      loading,
      setupLoading,
      checkStatus,
      setupGraph
    };
  }
};
</script>

<style scoped>
.graph-status-container {
  max-width: 800px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  margin-bottom: 15px;
}

.status-message {
  margin: 15px 0;
  font-size: 14px;
  color: #606266;
}

.graph-stats {
  margin: 20px 0;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.not-checked {
  padding: 30px 0;
  text-align: center;
}

.ml-2 {
  margin-left: 8px;
}
</style> 