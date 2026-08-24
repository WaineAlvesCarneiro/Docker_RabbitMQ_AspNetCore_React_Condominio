import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TableFilters from '../../components/common/TableFilters';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import stylesTableFilters from '../../components/common/TableFilters.module.css';

import imovelService from '../../services/imovelService';
import ImovelForm from './ImovelForm';
import ImoveisTable from './ImoveisTable';

function Imoveis() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imoveis, setImoveis] = useState([]);
  const [editingImovel, setEditingImovel] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Imóveis';
  const initialFilters = {
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    bloco: '',
    apartamento: ''
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    empresaId: user.empresaId,
    bloco: '',
    apartamento: ''
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

  const fetchImoveis = useCallback(async () => {
    if (!user || !user.token) return;

    try {
        setLoading(true);
        const data = await imovelService.getAllPaged(user.token, filters);
        setImoveis(data);
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
      fetchImoveis();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchImoveis]);

  const confirmDelete = (imovelId) => {
    setItemToDelete(imovelId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (imovelData) => {
    try {
      if (editingImovel) {
        await imovelService.update({ ...imovelData, id: editingImovel.id }, user.token);
        notificationService.success('Imóvel atualizado com sucesso!');
        setEditingImovel(null);
      } else {
        const IdEmpresa = user.empresaId;
        const dadosFormatados = {
          ...imovelData,
           empresaId: IdEmpresa
        };
        await imovelService.create(dadosFormatados, user.token);
        notificationService.success('Imóvel adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchImoveis();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = async (imovel) => {
    try {
      setLoading(true);
      const imovelAtualizado = await imovelService.getById(imovel.id, user.token);
      if (!imovelAtualizado) {
        notificationService.error('Este imóvel não foi encontrado ou já foi removido.');
        await fetchImoveis();
        return;
      }
      setEditingImovel(imovelAtualizado);
      setShowForm(true);
    } catch (err) {
      notificationService.error('Erro ao buscar dados atualizados do imóvel.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await imovelService.delete(itemToDelete, user.token);
      notificationService.success('Imóvel excluído com sucesso!');
      setShowModal(false);
      setItemToDelete(null);
      await fetchImoveis();
    } catch (err) {
      notificationService.error(`Não foi possível excluir: ${err.message}`);
      setShowModal(false);
      setItemToDelete(null);
      await fetchImoveis();
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando imóveis...</p>
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

      {!showForm && user.role === 'Sindico' && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
        >
          Adicionar Novo Imóvel
        </Button>
      )}

      {showForm ? (
        <ImovelForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingImovel(null);
          }}
          imovelData={editingImovel}
        />
      ) : (
        <>
          <TableFilters 
              onClear={() => setFilters({ ...initialFilters, empresaId: user.empresaId })}
          >
            <div className={stylesTableFilters.tableFilters}>
              <Input 
                  placeholder="Filtrar por Bloco"
                  name="bloco"
                  value={filters.bloco}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />

              <Input 
                  placeholder="Filtrar por Apartamento"
                  name="apartamento"
                  value={filters.apartamento}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />
            </div>
          </TableFilters>

          <ImoveisTable
            imoveis={imoveis}
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
        message="Tem certeza que deseja excluir este imóvel?"
      />
    </div>
  );
}

export default Imoveis;