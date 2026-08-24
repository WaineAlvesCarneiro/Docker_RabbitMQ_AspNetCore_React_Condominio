import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TableFilters from '../../components/common/TableFilters';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import stylesTableFilters from '../../components/common/TableFilters.module.css';

import { authService } from '../../services/authService';
import AuthForm from './AuthForm';
import AuthsTable from './AuthsTable';
import { parseIsoDateLocal } from '../../utils/formatters';

function Auths() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [auths, setAuths] = useState([]);
  const [editingAuth, setEditingAuth] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Usuários';
  const initialFilters = {
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    userName: ''
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    empresaId: '',
    userName: ''
  });

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
        ...prev,
        [name]: value,
        page: 1
    }));
  };

  const handleSort = (column) => {
    setFilters(prev => ({
        ...prev,
        sortBy: column,
        direction: prev.sortBy === column && prev.direction === 'ASC' ? 'DESC' : 'ASC',
        page: 1
    }));
  };

  const fetchAuths = useCallback(async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      const data = await authService.getAllPaged(user.token, filters);
      setAuths(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAuths();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchAuths]);

  const confirmDelete = (authId) => {
    setItemToDelete(authId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (authData) => {
    try {
      if (editingAuth) {
        const dadosFormatados = {
          ...authData,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };
        await authService.update({ ...dadosFormatados, id: editingAuth.id }, user.token);
        notificationService.success('Usuário atualizado com sucesso!');
        setEditingAuth(null);
      } else {
        const dadosFormatados = {
          ...authData,
          dataInclusao: parseIsoDateLocal(new Date()),
          ativo: 1
        };
        await authService.create(dadosFormatados, user.token);
        notificationService.success('Usuário adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchAuths();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = async (auth) => {
    try {
      setLoading(true);
      const authAtualizado = await authService.getById(auth.id, user.token);
      if (!authAtualizado) {
        notificationService.error('Este usuário não foi encontrado ou já foi removido.');
        await fetchAuths();
        return;
      }
      setEditingAuth(authAtualizado);
      setShowForm(true);
    } catch (err) {
      notificationService.error('Erro ao buscar dados atualizados do usuário.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await authService.delete(itemToDelete, user.token);
      notificationService.success('Usuário excluído com sucesso!');
      setShowModal(false);
      setItemToDelete(null);
      await fetchAuths();
    } catch (err) {
      notificationService.error(`Não foi possível excluir: ${err.message}`);
      setShowModal(false);
      setItemToDelete(null);
      await fetchAuths();
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className={stylesPageLayout.container}>
      <h3>{titulo}</h3>

      {!showForm && user.role === 'Suporte' && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
        >
          Adicionar Novo Usuário
        </Button>
      )}

      {showForm ? (
        <AuthForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAuth(null);
          }}
          authData={editingAuth}
        />
      ) : (
        <>
          <TableFilters 
              onClear={() => setFilters({ ...initialFilters, empresaId: user.empresaId })}
          >
            <div className={stylesTableFilters.tableFilters}>
              <Input 
                  placeholder="Filtrar por usuário"
                  name="userName"
                  value={filters.userName}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />
            </div>
          </TableFilters>

          <AuthsTable
            auths={auths}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onPageChange={handlePageChange}
            onSort={handleSort}
            currentSort={{ sortBy: filters.sortBy, direction: filters.direction }}
          />
        </>
      )}

      <ConfirmModal
        show={showModal}
        onConfirm={handleDelete}
        onCancel={handleCancel}
        title="Confirmação de Exclusão"
        message="Tem certeza que deseja excluir este usuário?"
      />
    </div>
  );
}

export default Auths;