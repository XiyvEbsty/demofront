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
    
    <!-- 知识图谱维护模块 -->
    <div class="maintenance-section">
      <h2>知识图谱维护</h2>
      
      <el-card class="maintenance-card">
        <template #header>
          <div class="card-header">
            <span>节点与关系管理</span>
            <div>
              <el-button type="primary" @click="openAddNodeDialog">添加节点</el-button>
              <el-button type="success" @click="openAddRelationDialog">添加关系</el-button>
            </div>
          </div>
        </template>

        <!-- 筛选和搜索区域 -->
        <div class="filter-area">
          <el-form :inline="true">
            <el-form-item label="节点类型">
              <el-select v-model="queryParams.nodeType" placeholder="选择节点类型" clearable>
                <el-option label="职位(Job)" value="Job" />
                <el-option label="霍兰德类型(HollandType)" value="HollandType" />
                <el-option label="职业锚点(CareerAnchor)" value="CareerAnchor" />
                <el-option label="行业(Industry)" value="Industry" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键词">
              <el-input v-model="queryParams.keyword" placeholder="输入关键词" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchNodes">搜索</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 表格区域：节点列表 -->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="节点管理" name="nodes">
            <el-table :data="nodesList" border style="width: 100%" v-loading="loading">
              <el-table-column prop="id" label="ID" width="100" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="type" label="类型">
                <template #default="scope">
                  <el-tag :type="getNodeTypeColor(scope.row.type)">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="properties" label="属性">
                <template #default="scope">
                  <div v-for="(value, key) in scope.row.properties" :key="key" class="property-item">
                    <span class="property-key">{{ key }}:</span>
                    <span class="property-value">{{ value }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editNode(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="confirmDeleteNode(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, prev, pager, next"
                :total="totalNodes"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handlePageChange"
              />
            </div>
          </el-tab-pane>
          
          <!-- 关系列表 -->
          <el-tab-pane label="关系管理" name="relations">
            <el-table :data="relationsList" border style="width: 100%" v-loading="loading">
              <el-table-column prop="id" label="ID" width="100" />
              <el-table-column prop="type" label="关系类型">
                <template #default="scope">
                  <el-tag :type="getRelationTypeColor(scope.row.type)">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="sourceNode" label="源节点" />
              <el-table-column prop="targetNode" label="目标节点" />
              <el-table-column prop="properties" label="属性">
                <template #default="scope">
                  <div v-for="(value, key) in scope.row.properties" :key="key" class="property-item">
                    <span class="property-key">{{ key }}:</span>
                    <span class="property-value">{{ value }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editRelation(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="confirmDeleteRelation(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, prev, pager, next"
                :total="totalRelations"
                :current-page="relationsPage"
                :page-size="pageSize"
                @current-change="handleRelationsPageChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    
    <!-- 添加/编辑节点对话框 -->
    <el-dialog
      v-model="nodeDialog.visible"
      :title="nodeDialog.isEdit ? '编辑节点' : '添加节点'"
      width="500px"
    >
      <el-form :model="nodeForm" label-width="100px" :rules="nodeRules" ref="nodeFormRef">
        <el-form-item label="节点类型" prop="type">
          <el-select v-model="nodeForm.type" placeholder="选择节点类型" :disabled="nodeDialog.isEdit">
            <el-option label="职位(Job)" value="Job" />
            <el-option label="霍兰德类型(HollandType)" value="HollandType" />
            <el-option label="职业锚点(CareerAnchor)" value="CareerAnchor" />
            <el-option label="行业(Industry)" value="Industry" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="nodeForm.name" placeholder="输入节点名称" />
        </el-form-item>
        
        <!-- 职位节点的特殊属性 -->
        <template v-if="nodeForm.type === 'Job'">
          <el-form-item label="行业">
            <el-input v-model="nodeForm.properties.industry" placeholder="输入行业" />
          </el-form-item>
          <el-form-item label="薪资范围">
            <el-input v-model="nodeForm.properties.salary" placeholder="输入薪资范围" />
          </el-form-item>
          <el-form-item label="技能要求">
            <el-input v-model="nodeForm.properties.skills" placeholder="输入技能要求，用逗号分隔" />
          </el-form-item>
        </template>
        
        <!-- 霍兰德类型的特殊属性 -->
        <template v-if="nodeForm.type === 'HollandType'">
          <el-form-item label="代码">
            <el-input v-model="nodeForm.properties.code" placeholder="输入代码 (R/I/A/S/E/C)" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="nodeForm.properties.description" placeholder="输入类型描述" />
          </el-form-item>
        </template>
        
        <!-- 职业锚点的特殊属性 -->
        <template v-if="nodeForm.type === 'CareerAnchor'">
          <el-form-item label="代码">
            <el-input v-model="nodeForm.properties.code" placeholder="输入代码 (TF/GM/AU/...)" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="nodeForm.properties.description" placeholder="输入锚点描述" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="nodeDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitNode" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑关系对话框 -->
    <el-dialog
      v-model="relationDialog.visible"
      :title="relationDialog.isEdit ? '编辑关系' : '添加关系'"
      width="500px"
    >
      <el-form :model="relationForm" label-width="100px" :rules="relationRules" ref="relationFormRef">
        <el-form-item label="关系类型" prop="type">
          <el-select v-model="relationForm.type" placeholder="选择关系类型" :disabled="relationDialog.isEdit">
            <el-option label="具有霍兰德特征(HAS_HOLLAND)" value="HAS_HOLLAND" />
            <el-option label="具有职业锚点(HAS_ANCHOR)" value="HAS_ANCHOR" />
            <el-option label="所属行业(BELONGS_TO)" value="BELONGS_TO" />
            <el-option label="职业相似性(SIMILAR_TO)" value="SIMILAR_TO" />
          </el-select>
        </el-form-item>
        <el-form-item label="源节点" prop="sourceNodeId">
          <el-select v-model="relationForm.sourceNodeId" filterable placeholder="选择源节点">
            <el-option-group
              v-for="group in nodesOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="目标节点" prop="targetNodeId">
          <el-select v-model="relationForm.targetNodeId" filterable placeholder="选择目标节点">
            <el-option-group
              v-for="group in nodesOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" v-if="['HAS_HOLLAND', 'HAS_ANCHOR', 'SIMILAR_TO'].includes(relationForm.type)">
          <el-slider v-model="relationForm.properties.weight" :min="0" :max="1" :step="0.1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="relationDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitRelation" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>

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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import KnowledgeGraphStatus from '../components/KnowledgeGraphStatus.vue';

// 模拟数据 - 实际项目中应从API获取
const mockNodes = [
  { id: 1, name: '软件工程师', type: 'Job', properties: { industry: '互联网', salary: '15k-30k', skills: 'Java,Spring,MySQL' } },
  { id: 2, name: '研究型', type: 'HollandType', properties: { code: 'I', description: '喜欢思考和研究' } },
  { id: 3, name: '创业型', type: 'CareerAnchor', properties: { code: 'EC', description: '追求创新和创业' } },
  { id: 4, name: '互联网', type: 'Industry', properties: { companies: 'BAT,TMD' } },
];

const mockRelations = [
  { id: 1, type: 'HAS_HOLLAND', sourceNode: '软件工程师', targetNode: '研究型', properties: { weight: 0.8 } },
  { id: 2, type: 'BELONGS_TO', sourceNode: '软件工程师', targetNode: '互联网', properties: {} },
];

// 状态变量
const activeTab = ref('nodes');
const loading = ref(false);
const submitLoading = ref(false);
const nodesList = ref([]);
const relationsList = ref([]);
const currentPage = ref(1);
const relationsPage = ref(1);
const pageSize = ref(10);
const totalNodes = ref(0);
const totalRelations = ref(0);

// 查询参数
const queryParams = reactive({
  nodeType: '',
  keyword: ''
});

// 节点表单相关
const nodeDialog = reactive({
  visible: false,
  isEdit: false
});

const nodeForm = reactive({
  id: null,
  name: '',
  type: '',
  properties: {}
});

const nodeRules = {
  type: [{ required: true, message: '请选择节点类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
};

const nodeFormRef = ref(null);

// 关系表单相关
const relationDialog = reactive({
  visible: false,
  isEdit: false
});

const relationForm = reactive({
  id: null,
  type: '',
  sourceNodeId: '',
  targetNodeId: '',
  properties: { weight: 0.5 }
});

const relationRules = {
  type: [{ required: true, message: '请选择关系类型', trigger: 'change' }],
  sourceNodeId: [{ required: true, message: '请选择源节点', trigger: 'change' }],
  targetNodeId: [{ required: true, message: '请选择目标节点', trigger: 'change' }]
};

const relationFormRef = ref(null);

// 节点选项列表，用于关系选择器
const nodesOptions = ref([
  {
    label: '职位',
    options: []
  },
  {
    label: '霍兰德类型',
    options: []
  },
  {
    label: '职业锚点',
    options: []
  },
  {
    label: '行业',
    options: []
  }
]);

// 初始化
onMounted(() => {
  loadData();
  prepareNodesOptions();
});

// 加载数据
const loadData = () => {
  loading.value = true;
  
  // 模拟API请求 - 实际项目中应替换为真实API调用
  setTimeout(() => {
    nodesList.value = mockNodes;
    relationsList.value = mockRelations;
    totalNodes.value = mockNodes.length;
    totalRelations.value = mockRelations.length;
    loading.value = false;
  }, 500);
};

// 准备节点下拉选项
const prepareNodesOptions = () => {
  // 实际项目中应调用API获取所有节点
  nodesOptions.value[0].options = mockNodes
    .filter(node => node.type === 'Job')
    .map(node => ({ label: node.name, value: node.id }));
  
  nodesOptions.value[1].options = mockNodes
    .filter(node => node.type === 'HollandType')
    .map(node => ({ label: node.name, value: node.id }));
  
  nodesOptions.value[2].options = mockNodes
    .filter(node => node.type === 'CareerAnchor')
    .map(node => ({ label: node.name, value: node.id }));
  
  nodesOptions.value[3].options = mockNodes
    .filter(node => node.type === 'Industry')
    .map(node => ({ label: node.name, value: node.id }));
};

// 节点类型颜色
const getNodeTypeColor = (type) => {
  const colors = {
    'Job': 'primary',
    'HollandType': 'success',
    'CareerAnchor': 'warning',
    'Industry': 'info'
  };
  return colors[type] || 'default';
};

// 关系类型颜色
const getRelationTypeColor = (type) => {
  const colors = {
    'HAS_HOLLAND': 'success',
    'HAS_ANCHOR': 'warning',
    'BELONGS_TO': 'info',
    'SIMILAR_TO': 'primary'
  };
  return colors[type] || 'default';
};

// 搜索节点
const searchNodes = () => {
  // 实际项目中应调用API进行搜索
  console.log('搜索参数:', queryParams);
  loadData();
};

// 重置查询
const resetQuery = () => {
  queryParams.nodeType = '';
  queryParams.keyword = '';
  searchNodes();
};

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};

const handleRelationsPageChange = (page) => {
  relationsPage.value = page;
  loadData();
};

// 添加节点对话框
const openAddNodeDialog = () => {
  nodeDialog.isEdit = false;
  nodeForm.id = null;
  nodeForm.name = '';
  nodeForm.type = '';
  nodeForm.properties = {};
  nodeDialog.visible = true;
};

// 编辑节点
const editNode = (row) => {
  nodeDialog.isEdit = true;
  nodeForm.id = row.id;
  nodeForm.name = row.name;
  nodeForm.type = row.type;
  nodeForm.properties = { ...row.properties };
  nodeDialog.visible = true;
};

// 提交节点表单
const submitNode = () => {
  nodeFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      
      // 模拟API请求 - 实际项目中替换为真实API调用
      setTimeout(() => {
        if (nodeDialog.isEdit) {
          // 更新节点
          const index = nodesList.value.findIndex(node => node.id === nodeForm.id);
          if (index !== -1) {
            nodesList.value[index] = { ...nodeForm };
          }
          ElMessage.success('节点更新成功');
        } else {
          // 添加节点
          const newNode = { ...nodeForm, id: nodesList.value.length + 1 };
          nodesList.value.push(newNode);
          totalNodes.value++;
          ElMessage.success('节点添加成功');
        }
        
        nodeDialog.visible = false;
        submitLoading.value = false;
        prepareNodesOptions(); // 更新节点选项
      }, 500);
    }
  });
};

// 确认删除节点
const confirmDeleteNode = (row) => {
  ElMessageBox.confirm(`确定要删除节点 "${row.name}" 吗？相关的关系也将被删除。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API删除请求
    loading.value = true;
    setTimeout(() => {
      nodesList.value = nodesList.value.filter(node => node.id !== row.id);
      totalNodes.value--;
      // 同时删除相关的关系
      relationsList.value = relationsList.value.filter(
        relation => !(relation.sourceNode === row.name || relation.targetNode === row.name)
      );
      totalRelations.value = relationsList.value.length;
      loading.value = false;
      ElMessage.success('节点删除成功');
      prepareNodesOptions(); // 更新节点选项
    }, 500);
  }).catch(() => {});
};

// 添加关系对话框
const openAddRelationDialog = () => {
  relationDialog.isEdit = false;
  relationForm.id = null;
  relationForm.type = '';
  relationForm.sourceNodeId = '';
  relationForm.targetNodeId = '';
  relationForm.properties = { weight: 0.5 };
  relationDialog.visible = true;
};

// 编辑关系
const editRelation = (row) => {
  relationDialog.isEdit = true;
  relationForm.id = row.id;
  relationForm.type = row.type;
  
  // 查找源节点和目标节点的ID
  const sourceNode = mockNodes.find(node => node.name === row.sourceNode);
  const targetNode = mockNodes.find(node => node.name === row.targetNode);
  
  relationForm.sourceNodeId = sourceNode ? sourceNode.id : '';
  relationForm.targetNodeId = targetNode ? targetNode.id : '';
  relationForm.properties = { ...row.properties };
  
  relationDialog.visible = true;
};

// 提交关系表单
const submitRelation = () => {
  relationFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      
      // 获取源节点和目标节点的名称
      const sourceNode = mockNodes.find(node => node.id === relationForm.sourceNodeId);
      const targetNode = mockNodes.find(node => node.id === relationForm.targetNodeId);
      
      if (!sourceNode || !targetNode) {
        ElMessage.error('节点不存在');
        submitLoading.value = false;
        return;
      }
      
      // 模拟API请求
      setTimeout(() => {
        const relationData = {
          id: relationForm.id || relationsList.value.length + 1,
          type: relationForm.type,
          sourceNode: sourceNode.name,
          targetNode: targetNode.name,
          properties: { ...relationForm.properties }
        };
        
        if (relationDialog.isEdit) {
          // 更新关系
          const index = relationsList.value.findIndex(relation => relation.id === relationForm.id);
          if (index !== -1) {
            relationsList.value[index] = relationData;
          }
          ElMessage.success('关系更新成功');
        } else {
          // 添加关系
          relationsList.value.push(relationData);
          totalRelations.value++;
          ElMessage.success('关系添加成功');
        }
        
        relationDialog.visible = false;
        submitLoading.value = false;
      }, 500);
    }
  });
};

// 确认删除关系
const confirmDeleteRelation = (row) => {
  ElMessageBox.confirm(`确定要删除关系 "${row.sourceNode} → ${row.targetNode}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API删除请求
    loading.value = true;
    setTimeout(() => {
      relationsList.value = relationsList.value.filter(relation => relation.id !== row.id);
      totalRelations.value--;
      loading.value = false;
      ElMessage.success('关系删除成功');
    }, 500);
  }).catch(() => {});
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

.features-section, .maintenance-section {
  margin-top: 40px;
}

.features-section h2, .maintenance-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #606266;
}

.feature-card, .maintenance-card {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-area {
  margin-bottom: 20px;
}

.property-item {
  margin-bottom: 5px;
  font-size: 13px;
}

.property-key {
  font-weight: bold;
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style> 