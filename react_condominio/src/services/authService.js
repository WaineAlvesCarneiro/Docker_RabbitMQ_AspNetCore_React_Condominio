import api from '../api/api';

const API_URL = '/auth';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post(`${API_URL}/login`, { username, password });
      
      return response.data;
    } catch (error) {
      
      if (error.response) {
        if (error.response.status === 401) throw new Error('Usuário ou senha inválidos.');
        throw new Error(error.response.data?.erro || 'Erro no servidor.');
      }

      throw new Error(error.request ? 'Sem resposta do servidor.' : 'Falha na comunicação.');
    }
  },

  definirSenhaPermanente: async (novaSenha) => {
    const response = await api.post(`${API_URL}/definir-senha-permanente`, { novaSenha });

    return response.data;
  },

  getAll: async (token, empresaId) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const validEmpresaId = empresaId ?? 0;
    const params = new URLSearchParams({ empresaId: validEmpresaId.toString() });

    const response = await api.get(`${API_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");

    const result = response.data;
    if (response.status < 200 || response.status >= 300) throw new Error(result.erro || "Falha ao buscar usuários.");

    return result.sucesso ? result.dados : result;
  },

  getAllPaged: async (token, filters) => {
    if (!token) throw new Error("Token não fornecido.");
    
    const queryParams = new URLSearchParams(filters);
    
    const response = await api.get(`${API_URL}/paginado?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.sucesso ? response.data.dados : Promise.reject(response.data.erro);
  },

  getById: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");
    
    const response = await api.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    if (response.status === 404) return null;
    
    return response.data.sucesso ? response.data.dados : Promise.reject(response.data.erro);
  },

  create: async (authData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await api.post(`${API_URL}/criar-usuario`, authData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    if (response.status < 200 || response.status >= 300) throw new Error(response.data?.erro || 'Falha ao criar o usuário.');

    return response.data?.dados;
  },

  update: async (authData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");
    
    const response = await api.put(`${API_URL}/${authData.id}`, authData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    if (response.status < 200 || response.status >= 300) throw new Error(response.data?.erro || 'Falha ao atualizar o usuário.');
  },

  delete: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");
    
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    if (response.status < 200 || response.status >= 300) throw new Error(response.data?.erro || 'Falha ao deletar o usuário.');
  }
};