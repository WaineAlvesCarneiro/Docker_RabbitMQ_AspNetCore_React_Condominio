import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './Dashboard.module.css';
import { authService } from '../../services/authService';
import empresaService from '../../services/empresaService';
import imovelService from '../../services/imovelService';
import moradorService from '../../services/moradorService';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    usuarios: [],
    empresas: [],
    imoveis: [],
    moradores: []
  });

  const titulo = 'Bem-vindo ao Painel de Controle!';

  const fetchDashboard = useCallback(async () => {
    if (!user?.token) {
      setError("Acesso não autorizado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { role, token, empresaId } = user;
      const requests = [];

      if (role === 'Suporte') requests.push(authService.getAll(token, empresaId).then(res => ({ usuarios: res })));      
      if (role === 'Suporte') requests.push(empresaService.getAll(token, empresaId).then(res => ({ empresas: res })));
      if (role === 'Sindico' || role === 'Porteiro') {
        requests.push(imovelService.getAll(token, empresaId).then(res => ({ imoveis: res })));
        requests.push(moradorService.getAll(token, empresaId).then(res => ({ moradores: res })));
      }

      const results = await Promise.all(requests);
      
      const combinedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setData(prev => ({ ...prev, ...combinedData }));
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <div className={styles.dashboardContainer}><p>Carregando dados...</p></div>;
  if (error) return <div className={styles.dashboardContainer}><p style={{ color: 'red' }}>{error}</p></div>;

  const renderCard = (title, count, path) => (
    <div className={styles.dashboardCard}>
      <h2>{title}</h2>
      <p>Total: {count}</p>
      <Button variant="secondary" size="medium" onClick={() => navigate(path)}>
        Ver Detalhes
      </Button>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <h3>{user.role === 'Suporte' ? 'Painel Administrativo' : titulo}</h3>
      <div className={styles.dashboardGrid}>
        
        {(user.role === 'Suporte') && (
          <>
            {renderCard("Empresas Cadastradas", data.empresas.length, '/empresas')}
            {renderCard("Usuários Cadastrados", data.usuarios.length, '/auths')}
          </>
        )}
        
        {(user.role === 'Sindico' || user.role === 'Porteiro') && (
          <>
            {renderCard("Imóveis Cadastrados", data.imoveis.length, '/imoveis')}
            {renderCard("Moradores Ativos", data.moradores.length, '/moradores')}
          </>
        )}
        
      </div>
    </div>
  );
}

export default Dashboard;