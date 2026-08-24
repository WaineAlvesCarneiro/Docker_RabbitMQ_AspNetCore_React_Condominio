import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { formatarCelular, formatarData } from '../../utils/formatters';

import styles from './MoradoresTable.module.css';

function MoradoresTable({ moradores, onEdit, onDelete, onPageChange, onSort, currentSort }) {
  const { user } = useAuth();
  
  const data = moradores?.items || [];
  const pagination = {
    currentPage: moradores?.currentPage || 1,
    totalPages: moradores?.totalPages || 1,
    hasPrevious: moradores?.hasPreviousPage,
    hasNext: moradores?.hasNextPage
  };

  const getSortIcon = (column) => {
    if (currentSort?.sortBy !== column) return '↕';
    return currentSort.direction === 'ASC' ? '▲' : '▼';
  };

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            <th>Código</th>
            <th onClick={() => onSort('Nome')} style={{cursor: 'pointer'}}>
              Nome {getSortIcon('Nome')}
            </th>
            <th>Celular</th>
            <th>Data entrada</th>
            <th>Data saída</th>
            <th>Imóvel 'Bloco-Apto'</th>
            <th>Proprietário</th>
            <th className={stylesDataTable.action}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>  Nenhum morador encontrado.</td>
            </tr>
          )}
          {data.map(morador => (
            <tr key={morador.id}>
              <td>{morador.id}</td>
              <td>{morador.nome}</td>
              <td>{formatarCelular(morador.celular)}</td>
              <td>
                {morador.dataEntrada && formatarData(morador.dataEntrada)}
              </td>
              <td>
                {morador.dataSaida && formatarData(morador.dataSaida)}
              </td>
              <td>{morador.imovelDto?.bloco} - {morador.imovelDto?.apartamento}</td>
              <td className={`${styles.status} ${morador.isProprietario ? styles.sim : styles.nao}`}>
                {morador.isProprietario ? 'Sim' : 'Não'}
              </td>
              <td className={stylesDataTable.actionContainer}>
                <Button variant="primary" size="small" onClick={() => onEdit(morador)} customClass={stylesDataTable.actionButton}>
                  {user.role === 'Sindico' ? 'Editar' : 'Visualizar'}
                </Button>
                {user.role === 'Sindico' && (
                  <Button variant="danger" size="small" onClick={() => onDelete(morador.id)} customClass={stylesDataTable.actionButton}>Excluir</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={stylesDataTable.paginationControls} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <Button 
          disabled={!pagination.hasPrevious} 
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Anterior
        </Button>
        
        <span>Página {pagination.currentPage} de {pagination.totalPages}</span>
        
        <Button 
          disabled={!pagination.hasNext} 
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}

export default MoradoresTable;