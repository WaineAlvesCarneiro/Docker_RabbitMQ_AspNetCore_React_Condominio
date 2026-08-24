import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

function ImoveisTable({ imoveis, onEdit, onDelete, onPageChange, onSort, currentSort }) {
  const { user } = useAuth();

  const data = imoveis?.items || [];
  const pagination = {
    currentPage: imoveis?.currentPage || 1,
    totalPages: imoveis?.totalPages || 1,
    hasPrevious: imoveis?.hasPreviousPage,
    hasNext: imoveis?.hasNextPage
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
            <th onClick={() => onSort('Bloco')} style={{cursor: 'pointer'}}>
              Bloco {getSortIcon('Bloco')}
            </th>
            <th onClick={() => onSort('Apartamento')} style={{cursor: 'pointer'}}>
              Apartamento {getSortIcon('Apartamento')}
            </th>
            <th>Box Garagem</th>
            <th className={stylesDataTable.action}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>  Nenhum imóvel encontrado.</td>
            </tr>
          )}
          {data.map(imovel => (
            <tr key={imovel.id}>
              <td>{imovel.id}</td>
              <td>{imovel.bloco}</td>
              <td>{imovel.apartamento}</td>
              <td>{imovel.boxGaragem}</td>
              <td className={stylesDataTable.actionContainer}>
                <Button variant="primary" size="small" onClick={() => onEdit(imovel)} customClass={stylesDataTable.actionButton}>
                  {user.role === 'Sindico' ? 'Editar' : 'Visualizar'}
                </Button>
                {user.role === 'Sindico' && (
                  <Button variant="danger" size="small" onClick={() => onDelete(imovel.id)} customClass={stylesDataTable.actionButton}>Excluir</Button>
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

export default ImoveisTable;