import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Test service for Holland test and Career Anchor test
 */
export const testService = {
  /**
   * Get all Holland questions
   * @returns {Promise<Array>} List of questions
   */
  getHollandQuestions() {
    return axios.get(`${API_BASE_URL}/holland-questions`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get Holland questions');
      });
  },
  
  /**
   * Get Holland questions by type
   * @param {string} type Question type (R, I, A, S, E, C)
   * @returns {Promise<Array>} List of questions
   */
  getHollandQuestionsByType(type) {
    return axios.get(`${API_BASE_URL}/holland-questions/type/${type}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get Holland questions');
      });
  },
  
  /**
   * Get all Career Anchor questions
   * @returns {Promise<Array>} List of questions
   */
  getCareerAnchorQuestions() {
    return axios.get(`${API_BASE_URL}/career-anchor-questions`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get Career Anchor questions');
      });
  },
  
  /**
   * Get Career Anchor questions by type
   * @param {string} type Question type (TF, GM, AU, SE, EC, SV, CH, LS)
   * @returns {Promise<Array>} List of questions
   */
  getCareerAnchorQuestionsByType(type) {
    return axios.get(`${API_BASE_URL}/career-anchor-questions/type/${type}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get Career Anchor questions');
      });
  },
  
  /**
   * Save test result
   * @param {Object} testRecord Test record data
   * @returns {Promise<boolean>} Save success
   */
  saveTestRecord(testRecord) {
    return axios.post(`${API_BASE_URL}/test-records`, testRecord)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to save test record');
      });
  },
  
  /**
   * Get user's latest test record by type
   * @param {number} userId User ID
   * @param {string} testType Test type ("holland" or "career_anchor")
   * @returns {Promise<Object>} Test record
   */
  getLatestTestRecord(userId, testType) {
    return axios.get(`${API_BASE_URL}/test-records/user/${userId}/latest/${testType}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get test record');
      });
  },
  
  /**
   * Get all test records for a user
   * @param {number} userId User ID
   * @returns {Promise<Array>} List of test records
   */
  getUserTestRecords(userId) {
    return axios.get(`${API_BASE_URL}/test-records/user/${userId}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get test records');
      });
  }
}; 