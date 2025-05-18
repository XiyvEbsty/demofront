import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Job service for interacting with the job-related APIs
 */
export const jobService = {
  /**
   * Get all available jobs
   * @returns {Promise<Array>} List of jobs
   */
  getAllJobs() {
    return axios.get(`${API_BASE_URL}/jobs`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch jobs');
      });
  },
  
  /**
   * Get job details by ID
   * @param {number} id Job ID
   * @returns {Promise<Object>} Job details
   */
  getJobById(id) {
    return axios.get(`${API_BASE_URL}/jobs/${id}`)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch job details');
      });
  },
  
  /**
   * Get jobs that match the user's Holland code and Career Anchor scores
   * @param {Object} hollandScores Holland code dimension scores
   * @param {Object} anchorScores Career Anchor dimension scores
   * @param {number} limit Number of top matches to return (default: 3)
   * @returns {Promise<Array>} List of matching jobs
   */
  getMatchingJobs(hollandScores, anchorScores, limit = 3) {
    const data = {
      // Holland code dimensions
      realistic: hollandScores.realistic,
      investigative: hollandScores.investigative,
      artistic: hollandScores.artistic,
      social: hollandScores.social,
      enterprising: hollandScores.enterprising,
      conventional: hollandScores.conventional,
      
      // Career anchor dimensions
      technicalFunctional: anchorScores.technicalFunctional,
      generalManagerial: anchorScores.generalManagerial,
      autonomyIndependence: anchorScores.autonomyIndependence,
      securityStability: anchorScores.securityStability,
      entrepreneurialCreativity: anchorScores.entrepreneurialCreativity,
      serviceDedication: anchorScores.serviceDedication,
      pureChallenge: anchorScores.pureChallenge,
      lifestyle: anchorScores.lifestyle,
      
      // Number of results to return
      limit
    };
    
    return axios.post(`${API_BASE_URL}/jobs/match`, data)
      .then(response => {
        if (response.data.code === '200') {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to find matching jobs');
      });
  }
}; 