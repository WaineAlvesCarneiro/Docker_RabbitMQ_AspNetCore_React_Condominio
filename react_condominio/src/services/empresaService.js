import api from '../api/api';

const API_URL = '/empresa';

const empresaService = {
  getAll: async (token, empresaId = null) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const validEmpresaId = empresaId ?? 0;
    const response = await api.get(`${API_URL}`, {
      params: { empresaId: validEmpresaId }
    });

    const result = response.data;
    
    if (result.sucesso) return result.dados;

    throw new Error(result.erro || 'Erro desconhecido na API.');
  },

  getAllPaged: async (token, filters) => {
    if (!token) throw new Error("Token não fornecido.");

    const response = await api.get(`${API_URL}/paginado`, { params: filters });

    const result = response.data;

    return result.sucesso ? result.dados : Promise.reject(result.erro);
  },

  getById: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await api.get(`${API_URL}/${id}`);
    const result = response.data;

    return result.sucesso ? result.dados : Promise.reject(result.erro);
  },

  create: async (empresaData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await api.post(`${API_URL}`, empresaData);
    const result = response.data;

    if (response.status < 200 || response.status >= 300 || !result.sucesso) throw new Error(result.erro || 'Falha ao criar a empresa.');
    
    return result.dados;
  },

  update: async (empresaData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await api.put(`${API_URL}/${empresaData.id}`, empresaData);
    const result = response.data;
    if (response.status === 204)  return { sucesso: true };
    
    if (response.status < 200 || response.status >= 300) throw new Error(result.erro || 'Falha ao atualizar a empresa.');

    return result.dados;
  },

  delete: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await api.delete(`${API_URL}/${id}`);
    const result = response.data;

    if (response.status < 200 || response.status >= 300 || !result.sucesso) throw new Error(result.erro || 'Falha ao deletar a empresa.');

    return result.dados;
  }
};

export default empresaService;
