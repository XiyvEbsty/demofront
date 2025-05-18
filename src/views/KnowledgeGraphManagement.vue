<template>
  <div class="knowledge-graph-management">
    <h1 class="page-title">知识图谱管理</h1>
    
    <el-alert
      title="知识图谱是本系统的核心功能之一，能够提供更智能的职位推荐"
      type="info"
      description="请确保Neo4j数据库已正确安装并启动，连接信息配置正确。系统将自动将职位数据和职业特征导入到知识图谱中。"
      show-icon
      :closable="false"
      class="info-alert"
    />
    
    <knowledge-graph-status />
    
    <div class="features-section">
      <h2>知识图谱功能介绍</h2>
      
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <span>基于知识图谱的智能推荐</span>
          </div>
        </template>
        <div class="feature-content">
          <p>通过知识图谱，系统能够：</p>
          <ul>
            <li>基于霍兰德兴趣类型和职业锚点进行智能职位匹配</li>
            <li>挖掘职业之间的相似性和关联性</li>
            <li>提供更个性化的职业发展路径建议</li>
            <li>动态更新职业特征和关系网络</li>
          </ul>
        </div>
      </el-card>
      
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <span>知识图谱结构</span>
          </div>
        </template>
        <div class="feature-content">
          <p>系统的知识图谱包含以下节点和关系：</p>
          <ul>
            <li><strong>节点类型</strong>：职位(Job)、霍兰德类型(HollandType)、职业锚点(CareerAnchor)、行业(Industry)</li>
            <li><strong>关系类型</strong>：具有特征(HAS_HOLLAND, HAS_ANCHOR)、所属行业(BELONGS_TO)、职业相似性(SIMILAR_TO)</li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import KnowledgeGraphStatus from '../components/KnowledgeGraphStatus.vue';

export default {
  name: 'KnowledgeGraphManagement',
  components: {
    KnowledgeGraphStatus
  }
};
</script>

<style scoped>
.knowledge-graph-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #409EFF;
}

.info-alert {
  margin-bottom: 30px;
}

.features-section {
  margin-top: 40px;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #606266;
}

.feature-card {
  margin-bottom: 20px;
}

.feature-content {
  line-height: 1.6;
}

.feature-content ul {
  padding-left: 20px;
}

.feature-content li {
  margin-bottom: 8px;
}
</style> 