import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
    return axios.post(`${API_BASE_URL}/users/login`, null, {
      params: { username, password }
    })
      .then(response => {
        if (response.data.code === '200') {
          // 保存token到localStorage
          localStorage.setItem('token', response.data.data);
          return response.data.data;
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
    return axios.post(`${API_BASE_URL}/users/register`, user)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Registration failed');
      });
  },
  
  /**
   * Get current user info
   * @param {number} id User ID
   * @returns {Promise<Object>} User info
   */
  getUserInfo(id) {
    return axios.get(`${API_BASE_URL}/users/${id}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get user info');
      });
  },
  
  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('token');
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean} True if logged in
   */
  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }
}; 