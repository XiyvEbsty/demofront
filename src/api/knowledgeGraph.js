import axios from 'axios';
import { jobData } from '../data/job-data';

// API基础URL
const API_URL = 'http://localhost:8080/api/knowledge-graph';

/**
 * 初始化知识图谱
 * @returns {Promise} 返回初始化结果
 */
export const initializeKnowledgeGraph = async () => {
  try {
    const response = await axios.post(`${API_URL}/initialize`);
    return response.data;
  } catch (error) {
    console.error('初始化知识图谱失败:', error);
    throw error;
  }
};

/**
 * 从前端数据导入职位到知识图谱
 * @returns {Promise} 返回导入结果
 */
export const importJobsFromFrontend = async () => {
  try {
    const response = await axios.post(`${API_URL}/import-jobs`, jobData);
    return response.data;
  } catch (error) {
    console.error('导入职位数据失败:', error);
    throw error;
  }
};

/**
 * 根据霍兰德兴趣类型获取推荐职位
 * @param {Object} hollandScores 霍兰德兴趣评分
 * @returns {Promise} 返回职位推荐列表
 */
export const getRecommendationsByHolland = async (hollandScores) => {
  try {
    const response = await axios.post(`${API_URL}/recommend/holland`, hollandScores);
    return response.data;
  } catch (error) {
    console.error('获取霍兰德推荐失败:', error);
    throw error;
  }
};

/**
 * 根据职业锚点类型获取推荐职位
 * @param {Object} anchorScores 职业锚点评分
 * @returns {Promise} 返回职位推荐列表
 */
export const getRecommendationsByAnchor = async (anchorScores) => {
  try {
    const response = await axios.post(`${API_URL}/recommend/anchor`, anchorScores);
    return response.data;
  } catch (error) {
    console.error('获取职业锚点推荐失败:', error);
    throw error;
  }
};

/**
 * 根据综合评分获取推荐职位
 * @param {Object} hollandScores 霍兰德兴趣评分
 * @param {Object} anchorScores 职业锚点评分
 * @returns {Promise} 返回综合推荐职位列表
 */
export const getRecommendationsByCombined = async (hollandScores, anchorScores) => {
  try {
    const response = await axios.post(`${API_URL}/recommend/combined`, {
      hollandScores,
      anchorScores
    });
    return response.data;
  } catch (error) {
    console.error('获取综合推荐失败:', error);
    throw error;
  }
};

/**
 * 根据测评结果获取职位推荐，如果后端图谱不可用则回退到前端计算
 * @param {Object} hollandScores 霍兰德兴趣评分
 * @param {Object} anchorScores 职业锚点评分
 * @returns {Promise} 返回推荐职位列表
 */
export const getRecommendationsWithFallback = async (hollandScores, anchorScores) => {
  try {
    // 尝试使用知识图谱获取推荐
    const response = await getRecommendationsByCombined(hollandScores, anchorScores);
    return response;
  } catch (error) {
    console.warn('知识图谱推荐失败，回退到前端计算:', error);
    
    // 导入前端职位计算函数
    const { calculateJobMatch } = await import('../data/job-data');
    
    // 使用前端计算方法作为备选
    return calculateJobMatch(hollandScores, anchorScores);
  }
};

/**
 * 检查知识图谱连接状态
 * @returns {Promise<Object>} 返回连接状态信息
 */
export const checkGraphStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error('知识图谱状态检查失败:', error);
    return {
      connected: false,
      message: error.message || '连接失败，请确保Neo4j数据库已启动',
      initialized: false
    };
  }
};

/**
 * 初始化并导入数据到知识图谱
 * 这是一个便捷方法，组合初始化和数据导入操作
 * @returns {Promise<Object>} 返回操作结果
 */
export const setupKnowledgeGraph = async () => {
  try {
    // 先检查状态
    const status = await checkGraphStatus();
    
    if (!status.connected) {
      return {
        success: false,
        message: '无法连接到Neo4j知识图谱，请确保数据库已启动',
        details: status
      };
    }
    
    // 如果已初始化，则跳过
    if (status.initialized && status.jobNodeCount > 0) {
      return {
        success: true,
        message: '知识图谱已存在，无需重新初始化',
        details: status
      };
    }
    
    // 初始化知识图谱
    await initializeKnowledgeGraph();
    
    // 导入职位数据
    await importJobsFromFrontend();
    
    // 再次检查状态
    const newStatus = await checkGraphStatus();
    
    return {
      success: true,
      message: '知识图谱初始化和数据导入成功',
      details: newStatus
    };
  } catch (error) {
    console.error('知识图谱设置失败:', error);
    return {
      success: false,
      message: `知识图谱设置失败: ${error.message}`,
      error
    };
  }
}; 