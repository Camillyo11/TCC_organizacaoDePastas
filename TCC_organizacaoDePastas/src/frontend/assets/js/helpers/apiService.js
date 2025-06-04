/**
 * Serviço para comunicação com a API do backend
 */
const API_BASE_URL = 'http://localhost:3000/api'; // Altere se necessário

class ApiService {
    /**
     * Realiza o cadastro de um novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise} - Promise com a resposta da API
     */
    static async registerUser(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao cadastrar usuário');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    }
    
    // Outros métodos da API podem ser adicionados aqui...
}

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
} else {
    window.ApiService = ApiService;
}