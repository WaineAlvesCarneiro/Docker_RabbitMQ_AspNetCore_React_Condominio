import React from 'react';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { formatarCnpj, formatarCelular } from '../../utils/formatters';
import { useEnum } from '../../hooks/useEnum';
import { useAuth } from '../../hooks/useAuth';

function EmpresasTable({ empresas, onEdit, onDelete, onPageChange, onSort, currentSort }) {
  const { options: tipoCondominioOptions } = useEnum('tipo-condominio');
  const { options: tipoEmpresaAtivoOptions } = useEnum('tipo-empresa-ativo');
  const { user } = useAuth();

  const data = empresas?.items || [];
  const pagination = {
    currentPage: empresas?.currentPage || 1,
    totalPages: empresas?.totalPages || 1,
    hasPrevious: empresas?.hasPreviousPage,
    hasNext: empresas?.hasNextPage
  };

  const getTipoCondominioLabel = (id) => tipoCondominioOptions.find(opt => opt.value === id)?.label|| 'Não definido';
  const getTipoEmpresaAtivoLabel = (id) => tipoEmpresaAtivoOptions.find(opt => opt.value === id)?.label || 'Não definido';

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
            <th>Ativo</th>
            <th onClick={() => onSort('RazaoSocial')} style={{cursor: 'pointer'}}>
              Razão Social {getSortIcon('RazaoSocial')}
            </th>
            <th>Fantasia</th>
            <th>Cnpj</th>
            <th>Tipo De Condomínio</th>
            <th>Nome</th>
            <th>Celular</th>
            {user.role === 'Suporte' && (
              <th className={stylesDataTable.action}>Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>  Nenhum empresa encontrado.</td>
            </tr>
          )}
          {data.map(empresa => (
            <tr key={empresa.id}>
              <td>{empresa.id}</td>
              <td>{getTipoEmpresaAtivoLabel(empresa.ativo)}</td>
              <td>{empresa.razaoSocial}</td>
              <td>{empresa.fantasia}</td>
              <td>{formatarCnpj(empresa.cnpj)}</td>
              <td>{getTipoCondominioLabel(empresa.tipoDeCondominio)}</td>
              <th>{empresa.nome}</th>
              <th>{formatarCelular(empresa.celular)}</th>
              {user.role === 'Suporte' && (
                <td className={stylesDataTable.actionContainer}>
                  <Button variant="primary" size="small" onClick={() => onEdit(empresa)} customClass={stylesDataTable.actionButton}>Editar</Button>
                  <Button variant="danger" size="small" onClick={() => onDelete(empresa.id)} customClass={stylesDataTable.actionButton}>Excluir</Button>
                </td>
              )}
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

export default EmpresasTable;