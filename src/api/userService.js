import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加token到请求头
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('拦截器检测到的令牌:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('请求头中添加令牌:', config.headers['Authorization']);
    }
    console.log('请求URL:', config.url);
    console.log('请求方法:', config.method);
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误情况
apiClient.interceptors.response.use(
  response => {
    // 如果响应成功，则返回响应数据
    return response;
  },
  error => {
    if (error.response) {
      // 处理401未授权错误
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        // 可以选择重定向到登录页面
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * User service for authentication and user management
 */
export const userService = {
  /**
   * User login
   * @param {string} username Username
   * @param {string} password Password
   * @returns {Promise<string>} Authentication token
   */
  login(username, password) {
    console.log('正在尝试登录:', username);
    return apiClient.post('/users/login', {
      username,
      password
    })
      .then(response => {
        console.log('登录响应:', response.data);
        if (response.data.code === '200') {
          // 保存token到localStorage
          const token = response.data.data;
          console.log('获取到的令牌:', token);
          localStorage.setItem('token', token);
          
          // 直接设置令牌到默认请求头中
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return token;
        }
        throw new Error(response.data.message || 'Login failed');
      });
  },
  
  /**
   * User registration
   * @param {Object} user User data
   * @returns {Promise<boolean>} Registration success
   */
  register(user) {
    return apiClient.post('/users/register', user)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Registration failed');
      });
  },
  
  /**
   * Get user info by ID
   * @param {number} id User ID
   * @returns {Promise<Object>} User info
   */
  getUserInfo(id) {
    return apiClient.get(`/users/${id}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get user info');
      });
  },
  
  /**
   * Debug token status
   * @returns {Object} Token status information
   */
  checkTokenStatus() {
    const token = localStorage.getItem('token');
    const authHeader = apiClient.defaults.headers.common['Authorization'];
    
    console.log('localStorage中的令牌:', token);
    console.log('API客户端中的Authorization头:', authHeader);
    
    return {
      tokenExists: !!token,
      authHeaderExists: !!authHeader,
      tokenValue: token,
      authHeaderValue: authHeader
    };
  },
  
  /**
   * Get current logged in user info
   * @returns {Promise<Object>} Current user info
   */
  getCurrentUser() {
    console.log('正在获取当前用户信息');
    
    // 检查并重新设置令牌到请求头
    const token = localStorage.getItem('token');
    console.log('当前令牌:', token);
    
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('已重新设置Authorization头:', apiClient.defaults.headers.common['Authorization']);
    } else {
      console.warn('没有找到令牌，无法设置Authorization头');
    }
    
    return apiClient.get('/users/current')
      .then(response => {
        console.log('获取用户信息响应:', response.data);
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get current user info');
      })
      .catch(error => {
        console.error('获取用户信息错误:', error);
        throw error;
      });
  },
  
  /**
   * Update user info
   * @param {Object} user User data to update
   * @returns {Promise<boolean>} Update success
   */
  updateUserInfo(user) {
    return apiClient.put(`/users/${user.id || 'current'}`, user)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update user info');
      });
  },
  
  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean} True if logged in
   */
  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }
}; 