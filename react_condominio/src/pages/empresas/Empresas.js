import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TableFilters from '../../components/common/TableFilters';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import stylesTableFilters from '../../components/common/TableFilters.module.css';

import empresaService from '../../services/empresaService';
import EmpresasTable from './EmpresasTable';
import EmpresaForm from './EmpresaForm';
import { parseIsoDateLocal } from '../../utils/formatters';

function Empresas() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Empresas';
  const initialFilters = {
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    razaoSocial: '',
    cnpj: ''
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    empresaId: user.empresaId,
    razaoSocial: '',
    cnpj: ''
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

  const fetchEmpresas = useCallback(async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      const data = await empresaService.getAllPaged(user.token, filters);
      setEmpresas(data);
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
      fetchEmpresas();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchEmpresas]);

  const confirmDelete = (empresaId) => {
    setItemToDelete(empresaId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (empresaData) => {
    try {
      if (editingEmpresa) {
        const dadosFormatados = {
          ...empresaData,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };
        await empresaService.update({ ...dadosFormatados, id: editingEmpresa.id }, user.token);
        notificationService.success('Empresa atualizado com sucesso!');
        setEditingEmpresa(null);
      } else {
        const dadosFormatados = {
          ...empresaData,
          dataInclusao: parseIsoDateLocal(new Date()),
          ativo: 1,
        };
        await empresaService.create(dadosFormatados, user.token);
        notificationService.success('Empresa adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchEmpresas();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = async (empresa) => {
    try {
      setLoading(true);    
      const empresaAtualizada = await empresaService.getById(empresa.id, user.token);
      if (!empresaAtualizada) {
        notificationService.error('Esta empresa não foi encontrada ou já foi removida.');
        await fetchEmpresas();
        return;
      }
      setEditingEmpresa(empresaAtualizada);
      setShowForm(true);
    } catch (err) {
      notificationService.error('Erro ao buscar dados atualizados do empresa.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await empresaService.delete(itemToDelete, user.token);
      notificationService.success('Empresa excluído com sucesso!');
      setShowModal(false);
      setItemToDelete(null);
      await fetchEmpresas();
    } catch (err) {
      notificationService.error(`Não foi possível excluir: ${err.message}`);
      setShowModal(false);
      setItemToDelete(null);
      await fetchEmpresas();
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando empresas...</p>
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

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
        >
          Adicionar Novo Empresa
        </Button>
      )}

      {showForm ? (
        <EmpresaForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingEmpresa(null);
          }}
          empresaData={editingEmpresa}
        />
      ) : (
        <>
          <TableFilters 
              onClear={() => setFilters({ ...initialFilters, empresaId: user.empresaId })}
          >
            <div className={stylesTableFilters.tableFilters}>
              <Input 
                  placeholder="Filtrar por razão social"
                  name="razaoSocial"
                  value={filters.razaoSocial}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />

              <Input 
                  placeholder="Filtrar por CNPJ"
                  name="cnpj"
                  value={filters.cnpj}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />
            </div>
          </TableFilters>

          <EmpresasTable
            empresas={empresas}
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
        message="Tem certeza que deseja excluir esta empresa?"
      />
    </div>
  );
}

export default Empresas;