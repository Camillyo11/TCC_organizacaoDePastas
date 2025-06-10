// src/frontend/assets/js/apiConfig.js
const API_BASE_URL = 'http://localhost:3000:3000/api'; // Altere para produção

class ApiService {
  static async request(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Autenticação necessária');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(data) : null
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição ${method} para ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos específicos serão adicionados conforme as páginas
}

export default ApiService;