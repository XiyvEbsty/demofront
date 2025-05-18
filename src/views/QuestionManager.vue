<template>
  <div class="question-manager">
    <h1 class="page-title">测评题库管理</h1>
    
    <el-alert
      title="在这里管理系统的霍兰德兴趣测评和职业锚点测评的题目"
      type="info"
      description="添加、编辑或删除测评题目，设置题目权重和分类"
      show-icon
      :closable="false"
      class="info-alert"
    />
    
    <el-tabs v-model="activeTab" class="question-tabs">
      <el-tab-pane label="霍兰德兴趣测评" name="holland">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="openQuestionDialog('holland')">添加题目</el-button>
            <el-input 
              v-model="hollandSearch" 
              placeholder="搜索题目" 
              class="search-input"
              clearable
            />
          </div>
          
          <el-table :data="filteredHollandQuestions" border stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="题目内容" min-width="300" />
            <el-table-column prop="type" label="兴趣类型" width="120">
              <template #default="scope">
                <el-tag :type="getHollandTypeColor(scope.row.type)">
                  {{ getHollandTypeName(scope.row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重" width="100" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editQuestion(scope.row, 'holland')">编辑</el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="confirmDeleteQuestion(scope.row.id, 'holland')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-pagination
            v-if="hollandQuestions.length > 10"
            layout="prev, pager, next"
            :total="hollandQuestions.length"
            :page-size="10"
            class="pagination"
          />
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="职业锚点测评" name="anchor">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="openQuestionDialog('anchor')">添加题目</el-button>
            <el-input 
              v-model="anchorSearch" 
              placeholder="搜索题目" 
              class="search-input"
              clearable
            />
          </div>
          
          <el-table :data="filteredAnchorQuestions" border stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="题目内容" min-width="300" />
            <el-table-column prop="type" label="锚点类型" width="120">
              <template #default="scope">
                <el-tag :type="getAnchorTypeColor(scope.row.type)">
                  {{ getAnchorTypeName(scope.row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重" width="100" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editQuestion(scope.row, 'anchor')">编辑</el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="confirmDeleteQuestion(scope.row.id, 'anchor')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-pagination
            v-if="anchorQuestions.length > 10"
            layout="prev, pager, next"
            :total="anchorQuestions.length"
            :page-size="10"
            class="pagination"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 题目编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="currentQuestion" label-width="120px">
        <el-form-item label="题目内容">
          <el-input 
            v-model="currentQuestion.content" 
            type="textarea" 
            :rows="4"
            placeholder="请输入题目内容"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="currentQuestion.type" placeholder="请选择分类">
            <el-option 
              v-for="option in activeTab === 'holland' ? hollandTypeOptions : anchorTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="权重">
          <el-input-number v-model="currentQuestion.weight" :min="1" :max="10" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveQuestion">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'QuestionManager',
  setup() {
    // 标签页控制
    const activeTab = ref('holland');
    
    // 搜索条件
    const hollandSearch = ref('');
    const anchorSearch = ref('');
    
    // 示例数据 - 实际应用中应从API获取
    const hollandQuestions = ref([
      { id: 1, content: '我喜欢动手组装或修理物品', type: 'R', weight: 5 },
      { id: 2, content: '我喜欢深入研究问题并找出解决方案', type: 'I', weight: 4 },
      { id: 3, content: '我喜欢参与艺术创作活动', type: 'A', weight: 5 },
      { id: 4, content: '我喜欢帮助和关心他人', type: 'S', weight: 4 },
      { id: 5, content: '我喜欢领导和管理他人完成任务', type: 'E', weight: 5 },
      { id: 6, content: '我喜欢按照规则和程序做事', type: 'C', weight: 4 },
    ]);
    
    const anchorQuestions = ref([
      { id: 1, content: '成为所在专业领域的技术专家对我很重要', type: 'TF', weight: 5 },
      { id: 2, content: '我梦想有一天能够管理一个组织', type: 'GM', weight: 4 },
      { id: 3, content: '我希望在工作中有充分的自主权', type: 'AU', weight: 5 },
      { id: 4, content: '工作稳定和安全感对我很重要', type: 'SE', weight: 4 },
      { id: 5, content: '我梦想创建自己的企业或产品', type: 'EC', weight: 5 },
      { id: 6, content: '能够帮助他人是我工作的重要动力', type: 'SV', weight: 4 },
      { id: 7, content: '我喜欢挑战自己解决看似不可能的问题', type: 'CH', weight: 5 },
      { id: 8, content: '工作与生活的平衡对我很重要', type: 'LS', weight: 4 },
    ]);
    
    // 筛选后的问题列表
    const filteredHollandQuestions = computed(() => {
      if (!hollandSearch.value) return hollandQuestions.value;
      return hollandQuestions.value.filter(q => 
        q.content.includes(hollandSearch.value) || 
        getHollandTypeName(q.type).includes(hollandSearch.value)
      );
    });
    
    const filteredAnchorQuestions = computed(() => {
      if (!anchorSearch.value) return anchorQuestions.value;
      return anchorQuestions.value.filter(q => 
        q.content.includes(anchorSearch.value) || 
        getAnchorTypeName(q.type).includes(anchorSearch.value)
      );
    });
    
    // 类型选项
    const hollandTypeOptions = [
      { value: 'R', label: '现实型(Realistic)' },
      { value: 'I', label: '研究型(Investigative)' },
      { value: 'A', label: '艺术型(Artistic)' },
      { value: 'S', label: '社会型(Social)' },
      { value: 'E', label: '企业型(Enterprising)' },
      { value: 'C', label: '常规型(Conventional)' },
    ];
    
    const anchorTypeOptions = [
      { value: 'TF', label: '技术/功能型' },
      { value: 'GM', label: '管理型' },
      { value: 'AU', label: '自主/独立型' },
      { value: 'SE', label: '安全/稳定型' },
      { value: 'EC', label: '创业型' },
      { value: 'SV', label: '服务型' },
      { value: 'CH', label: '挑战型' },
      { value: 'LS', label: '生活型' },
    ];
    
    // 类型名称映射
    const getHollandTypeName = (type) => {
      const map = {
        'R': '现实型',
        'I': '研究型',
        'A': '艺术型',
        'S': '社会型',
        'E': '企业型',
        'C': '常规型'
      };
      return map[type] || type;
    };
    
    const getAnchorTypeName = (type) => {
      const map = {
        'TF': '技术/功能型',
        'GM': '管理型',
        'AU': '自主/独立型',
        'SE': '安全/稳定型',
        'EC': '创业型',
        'SV': '服务型',
        'CH': '挑战型',
        'LS': '生活型'
      };
      return map[type] || type;
    };
    
    // 类型颜色映射
    const getHollandTypeColor = (type) => {
      const map = {
        'R': 'success',
        'I': 'info',
        'A': 'warning',
        'S': 'danger',
        'E': 'primary',
        'C': ''
      };
      return map[type] || '';
    };
    
    const getAnchorTypeColor = (type) => {
      const map = {
        'TF': 'success',
        'GM': 'primary',
        'AU': 'warning',
        'SE': 'info',
        'EC': 'danger',
        'SV': '',
        'CH': 'success',
        'LS': 'info'
      };
      return map[type] || '';
    };
    
    // 对话框控制
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const currentQuestion = ref({});
    const isEditing = ref(false);
    const questionType = ref('');
    
    // 打开添加题目对话框
    const openQuestionDialog = (type) => {
      dialogTitle.value = `添加${type === 'holland' ? '霍兰德兴趣' : '职业锚点'}测评题目`;
      currentQuestion.value = {
        content: '',
        type: type === 'holland' ? 'R' : 'TF',
        weight: 5
      };
      isEditing.value = false;
      questionType.value = type;
      dialogVisible.value = true;
    };
    
    // 打开编辑题目对话框
    const editQuestion = (question, type) => {
      dialogTitle.value = `编辑${type === 'holland' ? '霍兰德兴趣' : '职业锚点'}测评题目`;
      currentQuestion.value = { ...question };
      isEditing.value = true;
      questionType.value = type;
      dialogVisible.value = true;
    };
    
    // 确认删除
    const confirmDeleteQuestion = (id, type) => {
      ElMessageBox.confirm(
        '确定要删除这个题目吗？此操作不可逆。',
        '确认删除',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteQuestion(id, type);
      }).catch(() => {
        // 用户取消删除
      });
    };
    
    // 删除题目
    const deleteQuestion = (id, type) => {
      if (type === 'holland') {
        hollandQuestions.value = hollandQuestions.value.filter(q => q.id !== id);
      } else {
        anchorQuestions.value = anchorQuestions.value.filter(q => q.id !== id);
      }
      ElMessage.success('删除成功');
    };
    
    // 保存题目
    const saveQuestion = () => {
      if (!currentQuestion.value.content) {
        ElMessage.error('题目内容不能为空');
        return;
      }
      
      if (isEditing.value) {
        // 更新已有题目
        if (questionType.value === 'holland') {
          const index = hollandQuestions.value.findIndex(q => q.id === currentQuestion.value.id);
          if (index !== -1) {
            hollandQuestions.value[index] = { ...currentQuestion.value };
          }
        } else {
          const index = anchorQuestions.value.findIndex(q => q.id === currentQuestion.value.id);
          if (index !== -1) {
            anchorQuestions.value[index] = { ...currentQuestion.value };
          }
        }
        ElMessage.success('更新成功');
      } else {
        // 添加新题目
        const newId = questionType.value === 'holland' 
          ? Math.max(0, ...hollandQuestions.value.map(q => q.id)) + 1
          : Math.max(0, ...anchorQuestions.value.map(q => q.id)) + 1;
          
        const newQuestion = {
          ...currentQuestion.value,
          id: newId
        };
        
        if (questionType.value === 'holland') {
          hollandQuestions.value.push(newQuestion);
        } else {
          anchorQuestions.value.push(newQuestion);
        }
        ElMessage.success('添加成功');
      }
      
      dialogVisible.value = false;
    };
    
    return {
      activeTab,
      hollandSearch,
      anchorSearch,
      hollandQuestions,
      anchorQuestions,
      filteredHollandQuestions,
      filteredAnchorQuestions,
      hollandTypeOptions,
      anchorTypeOptions,
      dialogVisible,
      dialogTitle,
      currentQuestion,
      getHollandTypeName,
      getAnchorTypeName,
      getHollandTypeColor,
      getAnchorTypeColor,
      openQuestionDialog,
      editQuestion,
      confirmDeleteQuestion,
      saveQuestion
    };
  }
};
</script>

<style scoped>
.question-manager {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  text-align: center;
  color: #409EFF;
}

.info-alert {
  margin-bottom: 20px;
}

.question-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 