<template>
  <div class="result-container">
    <el-card class="result-card">
      <template #header>
        <div class="card-header">
          <h2>职业测评结果</h2>
          <el-button type="primary" @click="router.push('/job-quiz')">重新测评</el-button>
        </div>
      </template>

      <!-- 类型得分展示 -->
      <div class="type-scores">
        <h3>您的职业倾向得分</h3>
        <div class="score-chart">
          <div v-for="(score, type) in typeScores" :key="type" class="score-item">
            <div class="type-label">{{ getTypeLabel(type) }}</div>
            <el-progress 
              :percentage="score" 
              :color="getTypeColor(type)"
              :format="format"
            />
          </div>
        </div>
      </div>

      <!-- 主要职业倾向 -->
      <div class="dominant-types">
        <h3>主要职业倾向</h3>
        <div class="type-tags">
          <el-tag 
            v-for="type in dominantTypes" 
            :key="type"
            :type="getTagType(type)"
            size="large"
          >
            {{ getTypeLabel(type) }}
          </el-tag>
        </div>
      </div>

      <!-- 职业推荐 -->
      <div class="job-recommendations">
        <h3>推荐职业</h3>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(job, index) in recommendedJobs" :key="index">
            <el-card class="job-card" shadow="hover">
              <h4>{{ job.title }}</h4>
              <p class="job-description">{{ job.description }}</p>
              <div class="job-requirements">
                <h5>所需能力：</h5>
                <el-tag 
                  v-for="(req, idx) in job.requirements" 
                  :key="idx"
                  size="small"
                  class="requirement-tag"
                >
                  {{ req }}
                </el-tag>
              </div>
              <div class="job-salary">
                <el-tag type="success">薪资范围：{{ job.salary }}</el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟测评结果数据
const typeScores = ref({
  R: 75,  // 现实型
  I: 85,  // 研究型
  A: 60,  // 艺术型
  S: 45,  // 社会型
  E: 70,  // 企业型
  C: 55   // 传统型
})

// 获取类型标签
const getTypeLabel = (type) => {
  const labels = {
    R: '现实型',
    I: '研究型',
    A: '艺术型',
    S: '社会型',
    E: '企业型',
    C: '传统型'
  }
  return labels[type] || type
}

// 获取类型颜色
const getTypeColor = (type) => {
  const colors = {
    R: '#67C23A',  // 绿色
    I: '#409EFF',  // 蓝色
    A: '#E6A23C',  // 橙色
    S: '#F56C6C',  // 红色
    E: '#909399',  // 灰色
    C: '#9B59B6'   // 紫色
  }
  return colors[type] || '#909399'
}

// 获取标签类型
const getTagType = (type) => {
  const types = {
    R: 'success',
    I: 'primary',
    A: 'warning',
    S: 'danger',
    E: 'info',
    C: ''
  }
  return types[type] || 'info'
}

// 格式化进度条显示
const format = (percentage) => {
  return percentage + '分'
}

// 计算主要职业倾向（得分最高的两个类型）
const dominantTypes = computed(() => {
  return Object.entries(typeScores.value)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([type]) => type)
})

// 获取推荐职业
const recommendedJobs = computed(() => {
  // 获取得分最高的三个类型
  const topThreeTypes = Object.entries(typeScores.value)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type)
    .join('')

  // 根据三位组合获取推荐职业
  const jobs = getJobsByHollandCode(topThreeTypes)
  return jobs
})

// 根据霍兰德代码获取推荐职业
const getJobsByHollandCode = (code) => {
  const jobMap = {
    'RIA': [
      { title: '牙科技术员', description: '负责制作牙科修复体和牙科设备', requirements: ['精细操作能力', '耐心', '专业知识'], salary: '8k-15k' },
      { title: '陶工', description: '负责制作陶瓷制品', requirements: ['艺术感知', '手工技能', '创造力'], salary: '6k-12k' },
      { title: '建筑设计员', description: '负责建筑设计和规划', requirements: ['空间感知', '绘图能力', '专业知识'], salary: '10k-20k' }
    ],
    'RIS': [
      { title: '厨师', description: '负责菜品制作和厨房管理', requirements: ['烹饪技能', '团队协作', '创新意识'], salary: '8k-15k' },
      { title: '林务员', description: '负责森林资源管理和保护', requirements: ['专业知识', '户外工作能力', '责任心'], salary: '6k-12k' },
      { title: '电器修理', description: '负责电器设备维修和保养', requirements: ['技术能力', '问题解决', '安全意识'], salary: '7k-14k' }
    ],
    'RIE': [
      { title: '建筑工程师', description: '负责建筑工程设计和施工管理', requirements: ['专业知识', '项目管理', '沟通能力'], salary: '12k-25k' },
      { title: '机械工程师', description: '负责机械设备设计和维护', requirements: ['机械设计', '问题解决', '团队协作'], salary: '10k-20k' },
      { title: '电气工程师', description: '负责电气系统设计和维护', requirements: ['电气知识', '安全意识', '技术能力'], salary: '10k-20k' }
    ],
    'RIC': [
      { title: '机械装配工', description: '负责机械设备装配和调试', requirements: ['动手能力', '技术知识', '团队协作'], salary: '6k-12k' },
      { title: '质量检验员', description: '负责产品质量检验和控制', requirements: ['细心', '专业知识', '责任心'], salary: '5k-10k' },
      { title: '设备维护员', description: '负责设备维护和保养', requirements: ['技术能力', '问题解决', '安全意识'], salary: '6k-12k' }
    ],
    'RAI': [
      { title: '手工雕刻师', description: '负责工艺品雕刻和制作', requirements: ['艺术感知', '手工技能', '创造力'], salary: '8k-15k' },
      { title: '家具设计师', description: '负责家具设计和制作', requirements: ['设计能力', '工艺技能', '创新意识'], salary: '10k-20k' },
      { title: '印刷工艺师', description: '负责印刷工艺设计和制作', requirements: ['专业知识', '工艺技能', '创新意识'], salary: '7k-14k' }
    ],
    'RSE': [
      { title: '消防员', description: '负责火灾救援和安全保障', requirements: ['体能', '应急能力', '团队协作'], salary: '8k-15k' },
      { title: '警察', description: '负责治安维护和案件处理', requirements: ['责任心', '沟通能力', '应变能力'], salary: '8k-15k' },
      { title: '安全管理员', description: '负责安全管理和监督', requirements: ['安全意识', '管理能力', '责任心'], salary: '7k-14k' }
    ],
    'RSI': [
      { title: '职业教师', description: '负责职业技能培训', requirements: ['专业知识', '教学能力', '沟通技巧'], salary: '8k-15k' },
      { title: '技术培训师', description: '负责技术培训指导', requirements: ['专业知识', '教学能力', '实践经验'], salary: '10k-18k' },
      { title: '工艺指导', description: '负责工艺技术指导', requirements: ['专业知识', '教学能力', '实践经验'], salary: '8k-15k' }
    ],
    'REC': [
      { title: '实验室技术员', description: '负责实验室日常管理和实验操作', requirements: ['专业知识', '实验技能', '责任心'], salary: '6k-12k' },
      { title: '动物管理员', description: '负责动物饲养和管理', requirements: ['专业知识', '责任心', '爱心'], salary: '5k-10k' },
      { title: '设备操作员', description: '负责设备操作和维护', requirements: ['技术能力', '责任心', '安全意识'], salary: '6k-12k' }
    ],
    'REI': [
      { title: '船长', description: '负责船舶航行和管理', requirements: ['专业知识', '领导能力', '责任心'], salary: '15k-30k' },
      { title: '实验研究员', description: '负责实验研究和数据分析', requirements: ['专业知识', '研究能力', '分析能力'], salary: '10k-20k' },
      { title: '技术主管', description: '负责技术团队管理和指导', requirements: ['专业知识', '管理能力', '领导力'], salary: '12k-25k' }
    ],
    'RES': [
      { title: '酒店经理', description: '负责酒店运营和管理', requirements: ['管理能力', '服务意识', '沟通能力'], salary: '12k-25k' },
      { title: '导游', description: '负责旅游接待和讲解', requirements: ['专业知识', '沟通能力', '服务意识'], salary: '6k-12k' },
      { title: '服务主管', description: '负责服务团队管理', requirements: ['管理能力', '服务意识', '沟通能力'], salary: '8k-15k' }
    ],
    'RCI': [
      { title: '测量工程师', description: '负责工程测量和数据分析', requirements: ['专业知识', '技术能力', '责任心'], salary: '8k-15k' },
      { title: '质量工程师', description: '负责质量控制和改进', requirements: ['专业知识', '分析能力', '责任心'], salary: '8k-15k' },
      { title: '技术检验员', description: '负责技术检验和质量控制', requirements: ['专业知识', '技术能力', '责任心'], salary: '6k-12k' }
    ],
    'RCS': [
      { title: '公交车司机', description: '负责公交车辆驾驶', requirements: ['驾驶技能', '安全意识', '服务意识'], salary: '6k-12k' },
      { title: '建筑工人', description: '负责建筑施工', requirements: ['体力', '技术能力', '团队协作'], salary: '5k-10k' },
      { title: '维修技术员', description: '负责设备维修和保养', requirements: ['技术能力', '问题解决', '责任心'], salary: '6k-12k' }
    ],
    'RCE': [
      { title: '农场管理员', description: '负责农场运营和管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '8k-15k' },
      { title: '设备操作员', description: '负责设备操作和维护', requirements: ['技术能力', '责任心', '安全意识'], salary: '6k-12k' },
      { title: '物流管理员', description: '负责物流运输管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '7k-14k' }
    ],
    'IAS': [
      { title: '经济学家', description: '负责经济分析和研究', requirements: ['专业知识', '分析能力', '研究能力'], salary: '15k-30k' },
      { title: '心理学家', description: '负责心理研究和咨询', requirements: ['专业知识', '沟通能力', '同理心'], salary: '12k-25k' },
      { title: '内科医生', description: '负责疾病诊断和治疗', requirements: ['专业知识', '临床经验', '责任心'], salary: '20k-40k' }
    ],
    'IAR': [
      { title: '人类学家', description: '负责人文研究', requirements: ['专业知识', '研究能力', '分析能力'], salary: '12k-25k' },
      { title: '天文学家', description: '负责天文研究', requirements: ['专业知识', '研究能力', '数学能力'], salary: '15k-30k' },
      { title: '物理学家', description: '负责物理研究', requirements: ['专业知识', '研究能力', '数学能力'], salary: '15k-30k' }
    ],
    'ISE': [
      { title: '营养学家', description: '负责营养研究和指导', requirements: ['专业知识', '研究能力', '沟通能力'], salary: '10k-20k' },
      { title: '饮食顾问', description: '负责饮食方案制定', requirements: ['专业知识', '沟通能力', '服务意识'], salary: '8k-15k' },
      { title: '食品安全检查员', description: '负责食品安全检查', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' }
    ],
    'ISC': [
      { title: '侦察员', description: '负责信息收集和分析', requirements: ['观察力', '分析能力', '责任心'], salary: '8k-15k' },
      { title: '医学实验技师', description: '负责医学实验操作', requirements: ['专业知识', '实验技能', '责任心'], salary: '8k-15k' },
      { title: '调查研究员', description: '负责调查研究工作', requirements: ['研究能力', '分析能力', '沟通能力'], salary: '10k-20k' }
    ],
    'ISR': [
      { title: '水生生物学者', description: '负责水生生物研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '微生物学家', description: '负责微生物研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '牙科医生', description: '负责牙科治疗', requirements: ['专业知识', '临床经验', '责任心'], salary: '15k-30k' }
    ],
    'ISA': [
      { title: '实验心理学家', description: '负责心理实验研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '临床心理学家', description: '负责心理治疗', requirements: ['专业知识', '临床经验', '沟通能力'], salary: '15k-30k' },
      { title: '精神病学家', description: '负责精神疾病治疗', requirements: ['专业知识', '临床经验', '责任心'], salary: '20k-40k' }
    ],
    'IES': [
      { title: '细菌学家', description: '负责细菌研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '生理学家', description: '负责生理研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '化学专家', description: '负责化学研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' }
    ],
    'IEC': [
      { title: '档案保管员', description: '负责档案管理', requirements: ['专业知识', '责任心', '细心'], salary: '6k-12k' },
      { title: '保险统计员', description: '负责保险统计', requirements: ['专业知识', '数学能力', '责任心'], salary: '8k-15k' },
      { title: '数据分析师', description: '负责数据分析', requirements: ['专业知识', '分析能力', '数学能力'], salary: '10k-20k' }
    ],
    'ICR': [
      { title: '质量检验技术员', description: '负责质量检验', requirements: ['专业知识', '责任心', '细心'], salary: '6k-12k' },
      { title: '地质学技师', description: '负责地质研究', requirements: ['专业知识', '研究能力', '责任心'], salary: '8k-15k' },
      { title: '工程师', description: '负责工程设计', requirements: ['专业知识', '技术能力', '责任心'], salary: '12k-25k' }
    ],
    'IRA': [
      { title: '地理学家', description: '负责地理研究', requirements: ['专业知识', '研究能力', '分析能力'], salary: '12k-25k' },
      { title: '地质学家', description: '负责地质研究', requirements: ['专业知识', '研究能力', '分析能力'], salary: '12k-25k' },
      { title: '气象学家', description: '负责气象研究', requirements: ['专业知识', '研究能力', '分析能力'], salary: '12k-25k' }
    ],
    'IRS': [
      { title: '流体物理学家', description: '负责流体物理研究', requirements: ['专业知识', '研究能力', '数学能力'], salary: '15k-30k' },
      { title: '农业科学家', description: '负责农业研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' },
      { title: '生物学家', description: '负责生物研究', requirements: ['专业知识', '研究能力', '实验技能'], salary: '12k-25k' }
    ],
    'IRE': [
      { title: '化学工程师', description: '负责化学工程', requirements: ['专业知识', '技术能力', '责任心'], salary: '12k-25k' },
      { title: '纺织工程师', description: '负责纺织工程', requirements: ['专业知识', '技术能力', '责任心'], salary: '10k-20k' },
      { title: '电气工程师', description: '负责电气工程', requirements: ['专业知识', '技术能力', '责任心'], salary: '12k-25k' }
    ],
    'IRC': [
      { title: '飞行员', description: '负责飞机驾驶', requirements: ['专业知识', '技术能力', '责任心'], salary: '20k-40k' },
      { title: '物理实验室技师', description: '负责物理实验', requirements: ['专业知识', '实验技能', '责任心'], salary: '8k-15k' },
      { title: '生物技师', description: '负责生物实验', requirements: ['专业知识', '实验技能', '责任心'], salary: '8k-15k' }
    ],
    'CRI': [
      { title: '簿记员', description: '负责账务记录', requirements: ['专业知识', '细心', '责任心'], salary: '5k-10k' },
      { title: '会计', description: '负责会计核算', requirements: ['专业知识', '细心', '责任心'], salary: '8k-15k' },
      { title: '记时员', description: '负责时间记录', requirements: ['细心', '责任心', '时间管理'], salary: '5k-10k' }
    ],
    'CRS': [
      { title: '仓库保管员', description: '负责仓库管理', requirements: ['责任心', '细心', '管理能力'], salary: '5k-10k' },
      { title: '档案管理员', description: '负责档案管理', requirements: ['责任心', '细心', '管理能力'], salary: '6k-12k' },
      { title: '缝纫工', description: '负责服装制作', requirements: ['技术能力', '细心', '责任心'], salary: '6k-12k' }
    ],
    'CRE': [
      { title: '标价员', description: '负责商品标价', requirements: ['细心', '责任心', '专业知识'], salary: '5k-10k' },
      { title: '实验室工作者', description: '负责实验室工作', requirements: ['专业知识', '责任心', '细心'], salary: '6k-12k' },
      { title: '广告管理员', description: '负责广告管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '8k-15k' }
    ],
    'CIS': [
      { title: '记账员', description: '负责账务记录', requirements: ['专业知识', '细心', '责任心'], salary: '5k-10k' },
      { title: '顾客服务员', description: '负责顾客服务', requirements: ['服务意识', '沟通能力', '责任心'], salary: '5k-10k' },
      { title: '保险公司职员', description: '负责保险业务', requirements: ['专业知识', '沟通能力', '责任心'], salary: '8k-15k' }
    ],
    'CIE': [
      { title: '打字员', description: '负责文字录入', requirements: ['打字技能', '细心', '责任心'], salary: '5k-10k' },
      { title: '统计员', description: '负责数据统计', requirements: ['专业知识', '细心', '责任心'], salary: '6k-12k' },
      { title: '办公室工作人员', description: '负责办公室工作', requirements: ['责任心', '细心', '沟通能力'], salary: '5k-10k' }
    ],
    'CIR': [
      { title: '校对员', description: '负责文字校对', requirements: ['细心', '责任心', '专业知识'], salary: '5k-10k' },
      { title: '工程职员', description: '负责工程管理', requirements: ['专业知识', '责任心', '管理能力'], salary: '8k-15k' },
      { title: '检修计划员', description: '负责检修计划', requirements: ['专业知识', '责任心', '计划能力'], salary: '8k-15k' }
    ],
    'CSE': [
      { title: '接待员', description: '负责接待工作', requirements: ['服务意识', '沟通能力', '责任心'], salary: '5k-10k' },
      { title: '电话接线员', description: '负责电话接听', requirements: ['沟通能力', '责任心', '服务意识'], salary: '5k-10k' },
      { title: '旅游办事员', description: '负责旅游业务', requirements: ['专业知识', '沟通能力', '服务意识'], salary: '6k-12k' }
    ],
    'CSR': [
      { title: '运货代理商', description: '负责货物运输', requirements: ['专业知识', '沟通能力', '责任心'], salary: '8k-15k' },
      { title: '铁路职员', description: '负责铁路工作', requirements: ['专业知识', '责任心', '服务意识'], salary: '6k-12k' },
      { title: '银行财务职员', description: '负责银行财务', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' }
    ],
    'CSA': [
      { title: '秘书', description: '负责文秘工作', requirements: ['责任心', '细心', '沟通能力'], salary: '6k-12k' },
      { title: '图书管理员', description: '负责图书管理', requirements: ['责任心', '细心', '管理能力'], salary: '5k-10k' },
      { title: '办公室办事员', description: '负责办公室工作', requirements: ['责任心', '细心', '沟通能力'], salary: '5k-10k' }
    ],
    'CER': [
      { title: '邮递员', description: '负责邮件投递', requirements: ['责任心', '体力', '服务意识'], salary: '5k-10k' },
      { title: '数据处理员', description: '负责数据处理', requirements: ['专业知识', '细心', '责任心'], salary: '6k-12k' },
      { title: '办公室办事员', description: '负责办公室工作', requirements: ['责任心', '细心', '沟通能力'], salary: '5k-10k' }
    ],
    'CEI': [
      { title: '推销员', description: '负责产品销售', requirements: ['沟通能力', '销售技巧', '责任心'], salary: '8k-15k' },
      { title: '经济分析家', description: '负责经济分析', requirements: ['专业知识', '分析能力', '责任心'], salary: '12k-25k' },
      { title: '市场调研员', description: '负责市场调研', requirements: ['专业知识', '分析能力', '责任心'], salary: '8k-15k' }
    ],
    'CES': [
      { title: '银行会计', description: '负责银行会计', requirements: ['专业知识', '细心', '责任心'], salary: '8k-15k' },
      { title: '记账员', description: '负责账务记录', requirements: ['专业知识', '细心', '责任心'], salary: '5k-10k' },
      { title: '速记员', description: '负责速记工作', requirements: ['速记技能', '细心', '责任心'], salary: '5k-10k' }
    ],
    'ECI': [
      { title: '银行行长', description: '负责银行管理', requirements: ['专业知识', '管理能力', '领导力'], salary: '30k-60k' },
      { title: '审计员', description: '负责审计工作', requirements: ['专业知识', '责任心', '分析能力'], salary: '12k-25k' },
      { title: '信用管理员', description: '负责信用管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '10k-20k' }
    ],
    'ECS': [
      { title: '信用办事员', description: '负责信用业务', requirements: ['专业知识', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '保险人员', description: '负责保险业务', requirements: ['专业知识', '沟通能力', '责任心'], salary: '8k-15k' },
      { title: '海关服务经理', description: '负责海关服务', requirements: ['专业知识', '管理能力', '责任心'], salary: '15k-30k' }
    ],
    'ERI': [
      { title: '建筑物管理员', description: '负责建筑物管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '8k-15k' },
      { title: '工业工程师', description: '负责工业工程', requirements: ['专业知识', '管理能力', '责任心'], salary: '12k-25k' },
      { title: '农场管理员', description: '负责农场管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '10k-20k' }
    ],
    'ERS': [
      { title: '仓库管理员', description: '负责仓库管理', requirements: ['管理能力', '责任心', '细心'], salary: '6k-12k' },
      { title: '房屋管理员', description: '负责房屋管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '6k-12k' },
      { title: '货栈监督管理员', description: '负责货栈监督', requirements: ['管理能力', '责任心', '细心'], salary: '8k-15k' }
    ],
    'ERC': [
      { title: '邮政局长', description: '负责邮政管理', requirements: ['管理能力', '责任心', '领导力'], salary: '15k-30k' },
      { title: '渔船船长', description: '负责渔船管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '20k-40k' },
      { title: '机械操作领班', description: '负责机械操作', requirements: ['专业知识', '管理能力', '责任心'], salary: '10k-20k' }
    ],
    'EIR': [
      { title: '科学管理员', description: '负责科学管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '15k-30k' },
      { title: '技术管理员', description: '负责技术管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '15k-30k' },
      { title: '周期出版物管理员', description: '负责出版物管理', requirements: ['专业知识', '管理能力', '责任心'], salary: '10k-20k' }
    ],
    'EIC': [
      { title: '专利代理人', description: '负责专利代理', requirements: ['专业知识', '沟通能力', '责任心'], salary: '15k-30k' },
      { title: '鉴定人', description: '负责鉴定工作', requirements: ['专业知识', '责任心', '分析能力'], salary: '12k-25k' },
      { title: '运输服务检查员', description: '负责运输检查', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' }
    ],
    'EIS': [
      { title: '警官', description: '负责治安管理', requirements: ['责任心', '沟通能力', '应变能力'], salary: '8k-15k' },
      { title: '侦察员', description: '负责侦察工作', requirements: ['责任心', '观察力', '分析能力'], salary: '8k-15k' },
      { title: '安全咨询员', description: '负责安全咨询', requirements: ['专业知识', '沟通能力', '责任心'], salary: '10k-20k' }
    ],
    'EAS': [
      { title: '法官', description: '负责案件审判', requirements: ['专业知识', '责任心', '公正心'], salary: '20k-40k' },
      { title: '律师', description: '负责法律咨询', requirements: ['专业知识', '沟通能力', '责任心'], salary: '15k-30k' },
      { title: '公证人', description: '负责公证工作', requirements: ['专业知识', '责任心', '公正心'], salary: '12k-25k' }
    ],
    'EAR': [
      { title: '展览室管理员', description: '负责展览管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '舞台管理员', description: '负责舞台管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '播音员', description: '负责播音工作', requirements: ['专业知识', '沟通能力', '责任心'], salary: '10k-20k' }
    ],
    'ESC': [
      { title: '理发师', description: '负责理发服务', requirements: ['技术能力', '服务意识', '责任心'], salary: '6k-12k' },
      { title: '政府行政管理员', description: '负责行政管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '12k-25k' },
      { title: '商业经理', description: '负责商业管理', requirements: ['管理能力', '责任心', '领导力'], salary: '15k-30k' }
    ],
    'ESR': [
      { title: '家具售货员', description: '负责家具销售', requirements: ['销售技巧', '沟通能力', '责任心'], salary: '6k-12k' },
      { title: '书店售货员', description: '负责图书销售', requirements: ['销售技巧', '沟通能力', '责任心'], salary: '5k-10k' },
      { title: '日用品售货员', description: '负责日用品销售', requirements: ['销售技巧', '沟通能力', '责任心'], salary: '5k-10k' }
    ],
    'ESI': [
      { title: '博物馆管理员', description: '负责博物馆管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '8k-15k' },
      { title: '图书馆管理员', description: '负责图书馆管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '8k-15k' },
      { title: '饮食业经理', description: '负责饮食管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '12k-25k' }
    ],
    'ESA': [
      { title: '博物馆馆长', description: '负责博物馆管理', requirements: ['管理能力', '责任心', '领导力'], salary: '15k-30k' },
      { title: '报刊管理员', description: '负责报刊管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '8k-15k' },
      { title: '音乐器材售货员', description: '负责音乐器材销售', requirements: ['销售技巧', '专业知识', '责任心'], salary: '8k-15k' }
    ],
    'ASE': [
      { title: '戏剧导演', description: '负责戏剧导演', requirements: ['专业知识', '创造力', '领导力'], salary: '15k-30k' },
      { title: '舞蹈教师', description: '负责舞蹈教学', requirements: ['专业知识', '教学能力', '责任心'], salary: '10k-20k' },
      { title: '广告撰稿人', description: '负责广告文案', requirements: ['专业知识', '创造力', '责任心'], salary: '10k-20k' }
    ],
    'ASI': [
      { title: '音乐教师', description: '负责音乐教学', requirements: ['专业知识', '教学能力', '责任心'], salary: '10k-20k' },
      { title: '乐器教师', description: '负责乐器教学', requirements: ['专业知识', '教学能力', '责任心'], salary: '10k-20k' },
      { title: '管弦乐指挥', description: '负责音乐指挥', requirements: ['专业知识', '领导力', '责任心'], salary: '15k-30k' }
    ],
    'AER': [
      { title: '新闻摄影师', description: '负责新闻摄影', requirements: ['专业知识', '技术能力', '责任心'], salary: '8k-15k' },
      { title: '电视摄影师', description: '负责电视摄影', requirements: ['专业知识', '技术能力', '责任心'], salary: '10k-20k' },
      { title: '艺术指导', description: '负责艺术指导', requirements: ['专业知识', '创造力', '领导力'], salary: '15k-30k' }
    ],
    'AEI': [
      { title: '音乐指挥', description: '负责音乐指挥', requirements: ['专业知识', '领导力', '责任心'], salary: '15k-30k' },
      { title: '舞台指导', description: '负责舞台指导', requirements: ['专业知识', '领导力', '责任心'], salary: '12k-25k' },
      { title: '电影导演', description: '负责电影导演', requirements: ['专业知识', '创造力', '领导力'], salary: '20k-40k' }
    ],
    'AES': [
      { title: '流行歌手', description: '负责音乐表演', requirements: ['专业知识', '表演能力', '创造力'], salary: '15k-30k' },
      { title: '舞蹈演员', description: '负责舞蹈表演', requirements: ['专业知识', '表演能力', '创造力'], salary: '12k-25k' },
      { title: '电影导演', description: '负责电影导演', requirements: ['专业知识', '创造力', '领导力'], salary: '20k-40k' }
    ],
    'AIS': [
      { title: '画家', description: '负责绘画创作', requirements: ['专业知识', '创造力', '艺术感知'], salary: '10k-20k' },
      { title: '剧作家', description: '负责剧本创作', requirements: ['专业知识', '创造力', '写作能力'], salary: '12k-25k' },
      { title: '编辑', description: '负责内容编辑', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' }
    ],
    'AIE': [
      { title: '花匠', description: '负责园艺工作', requirements: ['专业知识', '技术能力', '责任心'], salary: '6k-12k' },
      { title: '皮衣设计师', description: '负责服装设计', requirements: ['专业知识', '创造力', '责任心'], salary: '10k-20k' },
      { title: '工业产品设计师', description: '负责产品设计', requirements: ['专业知识', '创造力', '责任心'], salary: '12k-25k' }
    ],
    'AIR': [
      { title: '建筑师', description: '负责建筑设计', requirements: ['专业知识', '创造力', '责任心'], salary: '15k-30k' },
      { title: '摄影师', description: '负责摄影工作', requirements: ['专业知识', '技术能力', '创造力'], salary: '10k-20k' },
      { title: '绘图员', description: '负责绘图工作', requirements: ['专业知识', '技术能力', '责任心'], salary: '8k-15k' }
    ],
    'SEC': [
      { title: '社会活动家', description: '负责社会活动', requirements: ['沟通能力', '领导力', '责任心'], salary: '10k-20k' },
      { title: '退伍军人服务官员', description: '负责退伍军人服务', requirements: ['专业知识', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '教育咨询者', description: '负责教育咨询', requirements: ['专业知识', '沟通能力', '责任心'], salary: '10k-20k' }
    ],
    'SER': [
      { title: '体育教练', description: '负责体育训练', requirements: ['专业知识', '教学能力', '责任心'], salary: '10k-20k' },
      { title: '游泳指导', description: '负责游泳教学', requirements: ['专业知识', '教学能力', '责任心'], salary: '8k-15k' },
      { title: '运动训练师', description: '负责运动训练', requirements: ['专业知识', '教学能力', '责任心'], salary: '10k-20k' }
    ],
    'SEI': [
      { title: '大学校长', description: '负责大学管理', requirements: ['管理能力', '领导力', '责任心'], salary: '30k-60k' },
      { title: '学院院长', description: '负责学院管理', requirements: ['管理能力', '领导力', '责任心'], salary: '25k-50k' },
      { title: '医院行政管理员', description: '负责医院管理', requirements: ['管理能力', '责任心', '专业知识'], salary: '20k-40k' }
    ],
    'SEA': [
      { title: '娱乐活动管理员', description: '负责娱乐活动管理', requirements: ['管理能力', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '社会服务助理', description: '负责社会服务', requirements: ['责任心', '沟通能力', '服务意识'], salary: '6k-12k' },
      { title: '宗教教育工作者', description: '负责宗教教育', requirements: ['专业知识', '教学能力', '责任心'], salary: '8k-15k' }
    ],
    'SCE': [
      { title: '部长助理', description: '负责部长助理工作', requirements: ['管理能力', '责任心', '沟通能力'], salary: '15k-30k' },
      { title: '福利机构职员', description: '负责福利工作', requirements: ['责任心', '沟通能力', '服务意识'], salary: '6k-12k' },
      { title: '生产协调人', description: '负责生产协调', requirements: ['管理能力', '责任心', '沟通能力'], salary: '10k-20k' }
    ],
    'SRI': [
      { title: '外科医师助手', description: '负责外科协助', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' },
      { title: '医院服务员', description: '负责医院服务', requirements: ['责任心', '服务意识', '沟通能力'], salary: '5k-10k' },
      { title: '医疗助理', description: '负责医疗协助', requirements: ['专业知识', '责任心', '细心'], salary: '6k-12k' }
    ],
    'SRE': [
      { title: '体育教师', description: '负责体育教学', requirements: ['专业知识', '教学能力', '责任心'], salary: '8k-15k' },
      { title: '职业病治疗者', description: '负责职业病治疗', requirements: ['专业知识', '责任心', '沟通能力'], salary: '10k-20k' },
      { title: '专业运动员', description: '负责体育训练', requirements: ['专业知识', '体能', '责任心'], salary: '15k-30k' }
    ],
    'SRC': [
      { title: '护理员', description: '负责护理工作', requirements: ['专业知识', '责任心', '爱心'], salary: '6k-12k' },
      { title: '护理助理', description: '负责护理协助', requirements: ['专业知识', '责任心', '爱心'], salary: '5k-10k' },
      { title: '医院勤杂工', description: '负责医院勤杂', requirements: ['责任心', '服务意识', '体力'], salary: '5k-10k' }
    ],
    'SIA': [
      { title: '社会学家', description: '负责社会研究', requirements: ['专业知识', '研究能力', '责任心'], salary: '12k-25k' },
      { title: '心理咨询者', description: '负责心理咨询', requirements: ['专业知识', '沟通能力', '责任心'], salary: '15k-30k' },
      { title: '学校心理学家', description: '负责心理辅导', requirements: ['专业知识', '教学能力', '责任心'], salary: '12k-25k' }
    ],
    'SIE': [
      { title: '营养学家', description: '负责营养研究', requirements: ['专业知识', '研究能力', '责任心'], salary: '12k-25k' },
      { title: '饮食学家', description: '负责饮食研究', requirements: ['专业知识', '研究能力', '责任心'], salary: '12k-25k' },
      { title: '海关检查员', description: '负责海关检查', requirements: ['专业知识', '责任心', '细心'], salary: '8k-15k' }
    ],
    'SIC': [
      { title: '描图员', description: '负责描图工作', requirements: ['专业知识', '技术能力', '细心'], salary: '6k-12k' },
      { title: '兽医助手', description: '负责兽医协助', requirements: ['专业知识', '责任心', '爱心'], salary: '6k-12k' },
      { title: '诊所助理', description: '负责诊所协助', requirements: ['专业知识', '责任心', '细心'], salary: '6k-12k' }
    ],
    'SIR': [
      { title: '理疗员', description: '负责理疗工作', requirements: ['专业知识', '责任心', '沟通能力'], salary: '8k-15k' },
      { title: '救护队工作人员', description: '负责救护工作', requirements: ['专业知识', '责任心', '应变能力'], salary: '8k-15k' },
      { title: '手足病医生', description: '负责手足病治疗', requirements: ['专业知识', '责任心', '细心'], salary: '15k-30k' }
    ]
  }

  // 如果没有完全匹配的组合，返回得分最高的类型的推荐职业
  if (!jobMap[code]) {
    const primaryType = code[0]
    return jobRecommendations[primaryType].slice(0, 3)
  }

  return jobMap[code]
}

// 职业推荐数据
const jobRecommendations = {
  R: [
    {
      title: '技术工程师',
      description: '负责系统开发、硬件维护和技术实现',
      requirements: ['动手能力强', '注重细节', '善于解决问题'],
      salary: '8k-15k'
    },
    {
      title: '机械工程师',
      description: '负责机械设备的设计、制造和维护',
      requirements: ['机械设计能力', '动手能力强', '团队协作'],
      salary: '7k-12k'
    },
    {
      title: '电气工程师',
      description: '负责电气系统的设计、安装和维护',
      requirements: ['电气知识', '安全意识', '问题解决能力'],
      salary: '8k-14k'
    }
  ],
  I: [
    {
      title: '数据分析师',
      description: '负责数据收集、分析和报告',
      requirements: ['数据分析能力', '逻辑思维', '编程基础'],
      salary: '10k-18k'
    },
    {
      title: '研究员',
      description: '负责科研项目的研究和开发',
      requirements: ['研究能力', '创新思维', '学术背景'],
      salary: '12k-20k'
    },
    {
      title: '系统架构师',
      description: '负责系统架构设计和优化',
      requirements: ['系统设计能力', '技术广度', '问题分析能力'],
      salary: '15k-25k'
    }
  ],
  A: [
    {
      title: 'UI设计师',
      description: '负责用户界面设计和视觉优化',
      requirements: ['设计能力', '创意思维', '用户体验'],
      salary: '8k-15k'
    },
    {
      title: '内容创作者',
      description: '负责内容策划和创作',
      requirements: ['写作能力', '创意思维', '市场洞察'],
      salary: '6k-12k'
    },
    {
      title: '艺术总监',
      description: '负责艺术创作和团队管理',
      requirements: ['艺术修养', '管理能力', '创意思维'],
      salary: '15k-25k'
    }
  ],
  S: [
    {
      title: '人力资源专员',
      description: '负责招聘、培训和员工关系',
      requirements: ['沟通能力', '人际交往', '组织协调'],
      salary: '6k-12k'
    },
    {
      title: '心理咨询师',
      description: '提供心理咨询和辅导服务',
      requirements: ['心理学知识', '同理心', '沟通技巧'],
      salary: '8k-15k'
    },
    {
      title: '教育顾问',
      description: '提供教育咨询和规划服务',
      requirements: ['教育背景', '沟通能力', '规划能力'],
      salary: '7k-14k'
    }
  ],
  E: [
    {
      title: '项目经理',
      description: '负责项目管理和团队协调',
      requirements: ['管理能力', '沟通技巧', '领导力'],
      salary: '12k-20k'
    },
    {
      title: '销售经理',
      description: '负责销售团队管理和业绩达成',
      requirements: ['销售能力', '团队管理', '市场洞察'],
      salary: '10k-18k'
    },
    {
      title: '创业顾问',
      description: '提供创业咨询和指导服务',
      requirements: ['创业经验', '商业洞察', '沟通能力'],
      salary: '15k-25k'
    }
  ],
  C: [
    {
      title: '财务分析师',
      description: '负责财务分析和报告',
      requirements: ['财务知识', '分析能力', '细心谨慎'],
      salary: '8k-15k'
    },
    {
      title: '行政主管',
      description: '负责日常行政事务管理',
      requirements: ['组织能力', '沟通技巧', '执行力'],
      salary: '7k-12k'
    },
    {
      title: '质量管理员',
      description: '负责质量控制和流程管理',
      requirements: ['质量管理', '流程优化', '问题解决'],
      salary: '6k-12k'
    }
  ]
}
</script>

<style scoped>
.result-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.result-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.type-scores {
  margin: 20px 0;
}

.score-chart {
  margin-top: 20px;
}

.score-item {
  margin-bottom: 15px;
}

.type-label {
  margin-bottom: 5px;
  font-weight: bold;
}

.dominant-types {
  margin: 30px 0;
}

.type-tags {
  margin-top: 15px;
}

.type-tags .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  padding: 8px 16px;
}

.job-recommendations {
  margin-top: 30px;
}

.job-card {
  margin-bottom: 20px;
  height: 100%;
}

.job-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.job-description {
  color: #606266;
  margin-bottom: 15px;
}

.job-requirements {
  margin: 15px 0;
}

.job-requirements h5 {
  margin: 0 0 10px 0;
  color: #606266;
}

.requirement-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.job-salary {
  margin-top: 15px;
}
</style> 