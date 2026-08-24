import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TableFilters from '../../components/common/TableFilters';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService'; 
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import stylesTableFilters from '../../components/common/TableFilters.module.css';

import moradorService from '../../services/moradorService';
import MoradorForm from './MoradorForm';
import MoradoresTable from './MoradoresTable';
import { parseIsoDateLocal, validarDataParaEnvio, validarDataSaida } from '../../utils/formatters';

function Moradores() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [moradores, setMoradores] = useState([]);
  const [editingMorador, setEditingMorador] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Moradores';
  const initialFilters = {
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    nome: ''
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'Id',
    direction: 'ASC',
    empresaId: user.empresaId,
    nome: ''
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

  const fetchMoradores = useCallback(async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      const data = await moradorService.getAllPaged(user.token, filters);
      setMoradores(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMoradores();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchMoradores]);

  const confirmDelete = (moradorId) => {
    setItemToDelete(moradorId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (moradorData) => {
    try {
      if (!validarDataParaEnvio(moradorData.dataEntrada)) {
        notificationService.error('Data de entrada inválida!');
        return;
      }
      
      if (moradorData.dataSaida && !validarDataParaEnvio(moradorData.dataSaida)) {
        notificationService.error('Data de saída inválida!');
        return;
      }
      
      if (moradorData.dataSaida && moradorData.dataEntrada) {
        const entrada = parseIsoDateLocal(moradorData.dataEntrada);
        const saida = parseIsoDateLocal(moradorData.dataSaida);
        
        if (saida < entrada) {
          notificationService.error('Data de saída não pode ser anterior à data de entrada!');
          return;
        }

        const validacaoData = validarDataSaida(moradorData.dataEntrada, moradorData.dataSaida);
        if (!validacaoData.valido) {
          notificationService.error(validacaoData.mensagem);
          return;
        }
      }

      if (editingMorador) {
        const dadosFormatados = {
          ...moradorData,
          dataEntrada: parseIsoDateLocal(moradorData.dataEntrada),
          dataSaida: moradorData.dataSaida
            ? parseIsoDateLocal(moradorData.dataSaida)
            : null,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };

        await moradorService.update({ ...dadosFormatados, id: editingMorador.id }, user.token);
        notificationService.success('Morador atualizado com sucesso!');
        setEditingMorador(null);
      } else {
        const IdEmpresa = user.empresaId;
        const dadosFormatados = {
          ...moradorData,
          dataEntrada: parseIsoDateLocal(moradorData.dataEntrada),
          dataInclusao: parseIsoDateLocal(new Date()),
          empresaId: IdEmpresa
        };

        await moradorService.create(dadosFormatados, user.token);
        notificationService.success('Morador adicionado com sucesso!');
      }
        
      setShowForm(false);
      await fetchMoradores();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = async (morador) => {
    try {
      setLoading(true);
      const moradorAtualizado = await moradorService.getById(morador.id, user.token);
      if (!moradorAtualizado) {
        notificationService.error('Este morador não foi encontrado ou já foi removido.');
        await fetchMoradores();
        return;
      }
      setEditingMorador(moradorAtualizado);
      setShowForm(true);
    } catch (err) {
          notificationService.error('Erro ao buscar dados atualizados do morador.');
          console.error(err);
        } finally {
          setLoading(false);
        }
  };

  const handleDelete = async () => {
    try {
      await moradorService.delete(itemToDelete, user.token);
      notificationService.success('Morador excluído com sucesso!');
      setShowModal(false);
      setItemToDelete(null);
      await fetchMoradores();
    } catch (err) {
      notificationService.error(`Não foi possível excluir: ${err.message}`);
      setShowModal(false);
      setItemToDelete(null);
      await fetchMoradores();
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando moradores...</p>
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
          Adicionar Novo Morador
        </Button>
      )}

      {showForm ? (
        <MoradorForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingMorador(null);
          }}
          moradorData={editingMorador}
        />
      ) : (
        <>
          <TableFilters 
              onClear={() => setFilters({ ...initialFilters, empresaId: user.empresaId })}
          >
            <div className={stylesTableFilters.tableFilters}>
              <Input 
                  placeholder="Filtrar por morador"
                  name="nome"
                  value={filters.nome}
                  onChange={handleFilterChange}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
              />
            </div>
          </TableFilters>

          <MoradoresTable
            moradores={moradores}
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
        message="Tem certeza que deseja excluir este morador?"
      />
    </div>
  );
}

export default Moradores;