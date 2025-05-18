<template>
  <div class="job-manager">
    <h1 class="page-title">职位管理</h1>
    
    <el-alert
      title="管理系统中的职位数据"
      type="info"
      description="添加、编辑职位信息，设置职位的RIASEC特征和职业锚点特征"
      show-icon
      :closable="false"
      class="info-alert"
    />
    
    <div class="toolbar">
      <el-button type="primary" @click="openJobDialog(null)">添加职位</el-button>
      <div class="search-area">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索职位" 
          class="search-input"
          clearable
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        <el-select v-model="industryFilter" placeholder="行业筛选" clearable>
          <el-option label="全部行业" value="" />
          <el-option 
            v-for="industry in industries" 
            :key="industry" 
            :label="industry" 
            :value="industry" 
          />
        </el-select>
      </div>
    </div>
    
    <el-table :data="filteredJobs" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="职位名称" min-width="150" />
      <el-table-column prop="industry" label="行业" width="120" />
      <el-table-column label="兴趣类型" width="200">
        <template #default="scope">
          <div class="tag-container">
            <el-tag
              v-for="type in scope.row.hollandTypes"
              :key="type"
              :type="getHollandTypeColor(type)"
              effect="plain"
              size="small"
              class="tag-item"
            >
              {{ getHollandTypeName(type) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="职业锚点" width="220">
        <template #default="scope">
          <div class="tag-container">
            <el-tag
              v-for="type in scope.row.anchorTypes"
              :key="type"
              :type="getAnchorTypeColor(type)"
              effect="plain"
              size="small"
              class="tag-item"
            >
              {{ getAnchorTypeName(type) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openJobDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="confirmDeleteJob(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-if="jobList.length > 10"
      layout="prev, pager, next"
      :total="jobList.length"
      :page-size="10"
      class="pagination"
    />
    
    <!-- 职位编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑职位' : '添加职位'"
      width="600px"
    >
      <el-form :model="currentJob" label-width="120px" :rules="rules" ref="jobForm">
        <el-form-item label="职位名称" prop="title">
          <el-input v-model="currentJob.title" />
        </el-form-item>
        
        <el-form-item label="行业" prop="industry">
          <el-select v-model="currentJob.industry" placeholder="请选择行业" filterable allow-create>
            <el-option 
              v-for="industry in industries" 
              :key="industry" 
              :label="industry" 
              :value="industry" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="职位描述" prop="description">
          <el-input 
            v-model="currentJob.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入职位描述"
          />
        </el-form-item>
        
        <el-divider content-position="center">兴趣类型配置</el-divider>
        
        <el-form-item label="兴趣类型" prop="hollandTypes">
          <el-select 
            v-model="currentJob.hollandTypes" 
            placeholder="选择主要兴趣类型" 
            multiple
            collapse-tags
          >
            <el-option 
              v-for="option in hollandTypeOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" 
            />
          </el-select>
        </el-form-item>
        
        <div class="score-inputs">
          <el-form-item label="现实型(R)" prop="realisticScore">
            <el-input-number v-model="currentJob.realisticScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="研究型(I)" prop="investigativeScore">
            <el-input-number v-model="currentJob.investigativeScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="艺术型(A)" prop="artisticScore">
            <el-input-number v-model="currentJob.artisticScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="社会型(S)" prop="socialScore">
            <el-input-number v-model="currentJob.socialScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="企业型(E)" prop="enterprisingScore">
            <el-input-number v-model="currentJob.enterprisingScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="常规型(C)" prop="conventionalScore">
            <el-input-number v-model="currentJob.conventionalScore" :min="0" :max="10" />
          </el-form-item>
        </div>
        
        <el-divider content-position="center">职业锚点配置</el-divider>
        
        <el-form-item label="职业锚点" prop="anchorTypes">
          <el-select 
            v-model="currentJob.anchorTypes" 
            placeholder="选择主要职业锚点类型" 
            multiple
            collapse-tags
          >
            <el-option 
              v-for="option in anchorTypeOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" 
            />
          </el-select>
        </el-form-item>
        
        <div class="score-inputs">
          <el-form-item label="技术/功能型" prop="technicalFunctionalScore">
            <el-input-number v-model="currentJob.technicalFunctionalScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="管理型" prop="generalManagerialScore">
            <el-input-number v-model="currentJob.generalManagerialScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="自主/独立型" prop="autonomyIndependenceScore">
            <el-input-number v-model="currentJob.autonomyIndependenceScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="安全/稳定型" prop="securityStabilityScore">
            <el-input-number v-model="currentJob.securityStabilityScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="创业型" prop="entrepreneurialCreativityScore">
            <el-input-number v-model="currentJob.entrepreneurialCreativityScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="服务型" prop="serviceDedicationScore">
            <el-input-number v-model="currentJob.serviceDedicationScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="挑战型" prop="pureChallengeScore">
            <el-input-number v-model="currentJob.pureChallengeScore" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="生活型" prop="lifestyleScore">
            <el-input-number v-model="currentJob.lifestyleScore" :min="0" :max="10" />
          </el-form-item>
        </div>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveJob">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

export default {
  name: 'JobManager',
  setup() {
    // 搜索和筛选
    const searchKeyword = ref('');
    const industryFilter = ref('');
    
    // 职位列表数据 - 实际应用中应从API获取
    const jobList = ref([
      {
        id: 1,
        title: '软件开发工程师',
        industry: 'IT技术',
        description: '负责公司产品的设计、开发和维护',
        hollandTypes: ['R', 'I', 'C'],
        realisticScore: 7,
        investigativeScore: 8,
        artisticScore: 4,
        socialScore: 3,
        enterprisingScore: 5,
        conventionalScore: 6,
        anchorTypes: ['TF', 'CH'],
        technicalFunctionalScore: 9,
        generalManagerialScore: 4,
        autonomyIndependenceScore: 6,
        securityStabilityScore: 5,
        entrepreneurialCreativityScore: 5,
        serviceDedicationScore: 3,
        pureChallengeScore: 8,
        lifestyleScore: 4
      },
      {
        id: 2,
        title: '人力资源专员',
        industry: '人力资源',
        description: '负责公司招聘、培训和员工关系管理',
        hollandTypes: ['S', 'E', 'C'],
        realisticScore: 2,
        investigativeScore: 4,
        artisticScore: 3,
        socialScore: 9,
        enterprisingScore: 6,
        conventionalScore: 7,
        anchorTypes: ['SV', 'SE'],
        technicalFunctionalScore: 4,
        generalManagerialScore: 6,
        autonomyIndependenceScore: 4,
        securityStabilityScore: 8,
        entrepreneurialCreativityScore: 3,
        serviceDedicationScore: 9,
        pureChallengeScore: 5,
        lifestyleScore: 6
      },
      {
        id: 3,
        title: '市场营销经理',
        industry: '市场营销',
        description: '负责公司市场策略制定和执行',
        hollandTypes: ['E', 'S', 'A'],
        realisticScore: 2,
        investigativeScore: 5,
        artisticScore: 6,
        socialScore: 7,
        enterprisingScore: 9,
        conventionalScore: 4,
        anchorTypes: ['EC', 'GM'],
        technicalFunctionalScore: 5,
        generalManagerialScore: 8,
        autonomyIndependenceScore: 7,
        securityStabilityScore: 4,
        entrepreneurialCreativityScore: 8,
        serviceDedicationScore: 6,
        pureChallengeScore: 7,
        lifestyleScore: 5
      },
      {
        id: 4,
        title: '财务分析师',
        industry: '金融财务',
        description: '负责公司财务报表分析和财务预测',
        hollandTypes: ['C', 'I', 'E'],
        realisticScore: 3,
        investigativeScore: 8,
        artisticScore: 2,
        socialScore: 4,
        enterprisingScore: 6,
        conventionalScore: 9,
        anchorTypes: ['TF', 'SE'],
        technicalFunctionalScore: 8,
        generalManagerialScore: 6,
        autonomyIndependenceScore: 4,
        securityStabilityScore: 9,
        entrepreneurialCreativityScore: 3,
        serviceDedicationScore: 5,
        pureChallengeScore: 6,
        lifestyleScore: 5
      }
    ]);
    
    // 行业列表
    const industries = computed(() => {
      return [...new Set(jobList.value.map(job => job.industry))];
    });
    
    // 筛选后的职位列表
    const filteredJobs = computed(() => {
      return jobList.value.filter(job => {
        const matchKeyword = searchKeyword.value 
          ? (job.title.includes(searchKeyword.value) || 
             job.description.includes(searchKeyword.value))
          : true;
          
        const matchIndustry = industryFilter.value 
          ? job.industry === industryFilter.value
          : true;
          
        return matchKeyword && matchIndustry;
      });
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
    const isEditing = ref(false);
    const currentJob = ref({
      title: '',
      industry: '',
      description: '',
      hollandTypes: [],
      realisticScore: 0,
      investigativeScore: 0,
      artisticScore: 0,
      socialScore: 0,
      enterprisingScore: 0,
      conventionalScore: 0,
      anchorTypes: [],
      technicalFunctionalScore: 0,
      generalManagerialScore: 0,
      autonomyIndependenceScore: 0,
      securityStabilityScore: 0,
      entrepreneurialCreativityScore: 0,
      serviceDedicationScore: 0,
      pureChallengeScore: 0,
      lifestyleScore: 0
    });
    
    // 表单验证规则
    const rules = {
      title: [
        { required: true, message: '请输入职位名称', trigger: 'blur' }
      ],
      industry: [
        { required: true, message: '请选择行业', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入职位描述', trigger: 'blur' }
      ],
      hollandTypes: [
        { required: true, message: '请选择至少一种兴趣类型', trigger: 'change', type: 'array', min: 1 }
      ],
      anchorTypes: [
        { required: true, message: '请选择至少一种职业锚点类型', trigger: 'change', type: 'array', min: 1 }
      ]
    };
    
    const jobForm = ref(null);
    
    // 打开职位编辑对话框
    const openJobDialog = (job) => {
      if (job) {
        // 编辑职位
        currentJob.value = { ...job };
        isEditing.value = true;
      } else {
        // 添加新职位
        currentJob.value = {
          title: '',
          industry: '',
          description: '',
          hollandTypes: [],
          realisticScore: 0,
          investigativeScore: 0,
          artisticScore: 0,
          socialScore: 0,
          enterprisingScore: 0,
          conventionalScore: 0,
          anchorTypes: [],
          technicalFunctionalScore: 0,
          generalManagerialScore: 0,
          autonomyIndependenceScore: 0,
          securityStabilityScore: 0,
          entrepreneurialCreativityScore: 0,
          serviceDedicationScore: 0,
          pureChallengeScore: 0,
          lifestyleScore: 0
        };
        isEditing.value = false;
      }
      dialogVisible.value = true;
    };
    
    // 确认删除职位
    const confirmDeleteJob = (job) => {
      ElMessageBox.confirm(
        `确定要删除职位 "${job.title}" 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteJob(job.id);
      }).catch(() => {
        // 用户取消删除
      });
    };
    
    // 删除职位
    const deleteJob = (id) => {
      jobList.value = jobList.value.filter(job => job.id !== id);
      ElMessage.success('职位删除成功');
    };
    
    // 保存职位
    const saveJob = () => {
      if (jobForm.value) {
        jobForm.value.validate((valid) => {
          if (valid) {
            if (isEditing.value) {
              // 更新现有职位
              const index = jobList.value.findIndex(j => j.id === currentJob.value.id);
              if (index !== -1) {
                jobList.value[index] = { ...currentJob.value };
              }
              ElMessage.success('职位信息更新成功');
            } else {
              // 添加新职位
              const newId = Math.max(0, ...jobList.value.map(j => j.id)) + 1;
              const newJob = {
                ...currentJob.value,
                id: newId
              };
              jobList.value.push(newJob);
              ElMessage.success('职位创建成功');
            }
            dialogVisible.value = false;
          } else {
            return false;
          }
        });
      }
    };
    
    return {
      searchKeyword,
      industryFilter,
      industries,
      jobList,
      filteredJobs,
      dialogVisible,
      currentJob,
      isEditing,
      rules,
      jobForm,
      hollandTypeOptions,
      anchorTypeOptions,
      getHollandTypeName,
      getAnchorTypeName,
      getHollandTypeColor,
      getAnchorTypeColor,
      Search,
      openJobDialog,
      confirmDeleteJob,
      saveJob
    };
  }
};
</script>

<style scoped>
.job-manager {
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

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-area {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  margin: 2px;
}

.score-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .score-inputs {
    grid-template-columns: 1fr;
  }
}
</style> 