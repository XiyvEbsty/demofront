<template>
  <div class="stats-manager">
    <h1 class="page-title">统计分析</h1>
    
    <el-alert
      title="系统使用数据分析"
      type="info"
      description="查看用户测评数据统计、职位推荐统计和系统使用情况"
      show-icon
      :closable="false"
      class="info-alert"
    />
    
    <div class="filter-bar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="dateShortcuts"
        value-format="YYYY-MM-DD"
      />
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </div>
    
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag type="success">{{ totalUsers }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{ activeUsers }}</div>
              </el-col>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">新增用户</div>
                <div class="stat-value">{{ newUsers }}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>测评次数</span>
              <el-tag type="primary">{{ totalAssessments }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">霍兰德测评</div>
                <div class="stat-value">{{ hollandAssessments }}</div>
              </el-col>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">职业锚点</div>
                <div class="stat-value">{{ anchorAssessments }}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>职位推荐</span>
              <el-tag type="warning">{{ totalRecommendations }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">推荐次数</div>
                <div class="stat-value">{{ recommendationCount }}</div>
              </el-col>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">点击率</div>
                <div class="stat-value">{{ clickRate }}%</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>知识图谱</span>
              <el-tag type="info">{{ graphStatus }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">职位节点</div>
                <div class="stat-value">{{ jobNodes }}</div>
              </el-col>
              <el-col :span="12" class="stat-item">
                <div class="stat-label">关系数</div>
                <div class="stat-value">{{ relationships }}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>霍兰德类型分布</span>
            </div>
          </template>
          <div class="chart-container" ref="hollandChart"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>职业锚点分布</span>
            </div>
          </template>
          <div class="chart-container" ref="anchorChart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户活跃度趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="trendChart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="table-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>热门职位推荐排行</span>
              <el-select v-model="jobSortType" size="small">
                <el-option label="推荐次数" value="recommend" />
                <el-option label="点击次数" value="click" />
                <el-option label="收藏次数" value="favorite" />
              </el-select>
            </div>
          </template>
          
          <el-table :data="popularJobs" stripe style="width: 100%">
            <el-table-column prop="rank" label="排名" width="80" />
            <el-table-column prop="title" label="职位名称" min-width="150" />
            <el-table-column prop="industry" label="行业" width="120" />
            <el-table-column prop="recommendCount" label="推荐次数" width="120">
              <template #default="scope">
                <el-progress :percentage="scope.row.recommendPercent" :format="format => `${scope.row.recommendCount}`" />
              </template>
            </el-table-column>
            <el-table-column prop="clickCount" label="点击次数" width="120">
              <template #default="scope">
                <el-progress :percentage="scope.row.clickPercent" :format="format => `${scope.row.clickCount}`" color="#409EFF" />
              </template>
            </el-table-column>
            <el-table-column prop="favoriteCount" label="收藏次数" width="120">
              <template #default="scope">
                <el-progress :percentage="scope.row.favoritePercent" :format="format => `${scope.row.favoriteCount}`" color="#E6A23C" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必要的组件
echarts.use([
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent,
  PieChart, 
  BarChart, 
  LineChart, 
  CanvasRenderer
]);

export default {
  name: 'StatsManager',
  setup() {
    // 日期选择器
    const dateRange = ref([
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    ]);
    
    const dateShortcuts = [
      {
        text: '最近一周',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 7 * 24 * 60 * 60 * 1000);
          return [start, end];
        },
      },
      {
        text: '最近一月',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 30 * 24 * 60 * 60 * 1000);
          return [start, end];
        },
      },
      {
        text: '最近三月',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 3);
          return [start, end];
        },
      },
    ];

    // 图表引用
    const hollandChart = ref(null);
    const anchorChart = ref(null);
    const trendChart = ref(null);
    
    // 趋势图周期
    const trendPeriod = ref('month');
    
    // 职位排序类型
    const jobSortType = ref('recommend');
    
    // 统计数据
    const totalUsers = ref(1258);
    const activeUsers = ref(425);
    const newUsers = ref(87);
    const totalAssessments = ref(2836);
    const hollandAssessments = ref(1675);
    const anchorAssessments = ref(1161);
    const totalRecommendations = ref(3542);
    const recommendationCount = ref(1863);
    const clickRate = ref(68);
    const graphStatus = ref('正常');
    const jobNodes = ref(256);
    const relationships = ref(1846);
    
    // 热门职位数据
    const popularJobs = ref([
      {
        rank: 1,
        title: '软件开发工程师',
        industry: 'IT技术',
        recommendCount: 567,
        recommendPercent: 100,
        clickCount: 423,
        clickPercent: 85,
        favoriteCount: 289,
        favoritePercent: 72
      },
      {
        rank: 2,
        title: '数据分析师',
        industry: 'IT技术',
        recommendCount: 485,
        recommendPercent: 86,
        clickCount: 356,
        clickPercent: 71,
        favoriteCount: 203,
        favoritePercent: 51
      },
      {
        rank: 3,
        title: '人力资源经理',
        industry: '人力资源',
        recommendCount: 412,
        recommendPercent: 73,
        clickCount: 278,
        clickPercent: 56,
        favoriteCount: 187,
        favoritePercent: 47
      },
      {
        rank: 4,
        title: '市场营销专员',
        industry: '市场营销',
        recommendCount: 386,
        recommendPercent: 68,
        clickCount: 295,
        clickPercent: 59,
        favoriteCount: 176,
        favoritePercent: 44
      },
      {
        rank: 5,
        title: '产品经理',
        industry: 'IT技术',
        recommendCount: 354,
        recommendPercent: 62,
        clickCount: 312,
        clickPercent: 62,
        favoriteCount: 198,
        favoritePercent: 49
      }
    ]);
    
    // 霍兰德类型分布数据
    const hollandData = [
      { value: 28, name: '现实型(R)' },
      { value: 22, name: '研究型(I)' },
      { value: 16, name: '艺术型(A)' },
      { value: 15, name: '社会型(S)' },
      { value: 12, name: '企业型(E)' },
      { value: 7, name: '常规型(C)' }
    ];
    
    // 职业锚点分布数据
    const anchorData = [
      { value: 24, name: '技术/功能型(TF)' },
      { value: 18, name: '管理型(GM)' },
      { value: 15, name: '自主/独立型(AU)' },
      { value: 12, name: '安全/稳定型(SE)' },
      { value: 11, name: '创业型(EC)' },
      { value: 8, name: '服务型(SV)' },
      { value: 7, name: '挑战型(CH)' },
      { value: 5, name: '生活型(LS)' }
    ];
    
    // 趋势图数据
    const getTrendData = (period) => {
      // 实际应用中应该根据period从API获取数据
      if (period === 'week') {
        return {
          xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: [120, 132, 101, 134, 90, 230, 210]
        };
      } else if (period === 'month') {
        return {
          xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          data: [320, 302, 301, 334, 390, 330, 320, 285, 310, 350, 365, 380]
        };
      } else {
        return {
          xAxis: ['2018', '2019', '2020', '2021', '2022', '2023'],
          data: [820, 932, 901, 934, 1290, 1330]
        };
      }
    };
    
    // 初始化霍兰德类型分布图表
    const initHollandChart = () => {
      if (hollandChart.value) {
        const chart = echarts.init(hollandChart.value);
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: hollandData.map(item => item.name)
          },
          series: [
            {
              name: '霍兰德类型',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: hollandData
            }
          ]
        };
        
        chart.setOption(option);
        
        window.addEventListener('resize', function() {
          chart.resize();
        });
      }
    };
    
    // 初始化职业锚点分布图表
    const initAnchorChart = () => {
      if (anchorChart.value) {
        const chart = echarts.init(anchorChart.value);
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: anchorData.map(item => item.name)
          },
          series: [
            {
              name: '分布比例',
              type: 'bar',
              data: anchorData.map(item => item.value)
            }
          ]
        };
        
        chart.setOption(option);
        
        window.addEventListener('resize', function() {
          chart.resize();
        });
      }
    };
    
    // 初始化趋势图
    const initTrendChart = () => {
      if (trendChart.value) {
        const chart = echarts.init(trendChart.value);
        const data = getTrendData(trendPeriod.value);
        
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: data.xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '活跃用户',
              type: 'line',
              data: data.data,
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              markLine: {
                data: [{ type: 'average', name: '平均值' }]
              }
            }
          ]
        };
        
        chart.setOption(option);
        
        window.addEventListener('resize', function() {
          chart.resize();
        });
      }
    };
    
    // 刷新数据
    const refreshData = () => {
      // 实际应用中应该从API获取数据
      // 这里模拟刷新数据，随机变化一些值
      totalUsers.value = Math.floor(1200 + Math.random() * 200);
      activeUsers.value = Math.floor(400 + Math.random() * 100);
      newUsers.value = Math.floor(70 + Math.random() * 40);
      
      // 重新初始化图表
      initHollandChart();
      initAnchorChart();
      initTrendChart();
    };
    
    // 监听趋势图周期变化
    watch(trendPeriod, () => {
      initTrendChart();
    });
    
    // 监听职位排序类型变化
    watch(jobSortType, () => {
      // 根据排序类型对职位进行排序
      if (jobSortType.value === 'recommend') {
        popularJobs.value.sort((a, b) => b.recommendCount - a.recommendCount);
      } else if (jobSortType.value === 'click') {
        popularJobs.value.sort((a, b) => b.clickCount - a.clickCount);
      } else {
        popularJobs.value.sort((a, b) => b.favoriteCount - a.favoriteCount);
      }
      
      // 重新设置排名
      popularJobs.value.forEach((job, index) => {
        job.rank = index + 1;
      });
    });
    
    // 组件挂载后初始化图表
    onMounted(() => {
      initHollandChart();
      initAnchorChart();
      initTrendChart();
    });
    
    return {
      dateRange,
      dateShortcuts,
      hollandChart,
      anchorChart,
      trendChart,
      trendPeriod,
      jobSortType,
      totalUsers,
      activeUsers,
      newUsers,
      totalAssessments,
      hollandAssessments,
      anchorAssessments,
      totalRecommendations,
      recommendationCount,
      clickRate,
      graphStatus,
      jobNodes,
      relationships,
      popularJobs,
      refreshData
    };
  }
};
</script>

<style scoped>
.stats-manager {
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.dashboard-cards {
  margin-bottom: 20px;
}

.dashboard-card {
  height: 140px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 350px;
}

.chart-container {
  height: 280px;
}

.table-row {
  margin-bottom: 20px;
}
</style> 