import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { useEnum } from '../../hooks/useEnum';
import { formatarData } from '../../utils/formatters';

function AuthsTable({ auths, onEdit, onDelete, onPageChange, onSort, currentSort }) {
  const { user } = useAuth();
  const { options: tipoPerfilOptions } = useEnum('tipo-role');
  const { options: tipoUserAtivoOptions } = useEnum('tipo-user-ativo');
  const { options: tipoEmpresaAtivoOptions } = useEnum('tipo-empresa-ativo');

  const data = auths?.items || [];
  const pagination = {
    currentPage: auths?.currentPage || 1,
    totalPages: auths?.totalPages || 1,
    hasPrevious: auths?.hasPreviousPage,
    hasNext: auths?.hasNextPage
  };

  const getTipoPerfilLabel = (id) => tipoPerfilOptions.find(opt => opt.value === id)?.label || 'Não definido';
  const getTipoUserAtivoLabel = (id) => tipoUserAtivoOptions.find(opt => opt.value === id)?.label || 'Não definido';
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
            <th onClick={() => onSort('UserName')} style={{cursor: 'pointer'}}>
              Usuário {getSortIcon('UserName')}
            </th>
            <th onClick={() => onSort('Role')} style={{cursor: 'pointer'}}>
              Perfil {getSortIcon('Role')}
            </th>
            <th>Data Inclusão</th>
            <th>Ativo</th>
            <th>Código Empresa</th>
            <th>Empresa</th>
            <th>Empresa Ativa</th>
            {(user.role === 'Suporte' || user.role === 'Sindico') && (
              <th className={stylesDataTable.action}>Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</td>
            </tr>
          ) : (
            data.map(auth => (
              <tr key={auth.id}>
                <td>{auth.userName}</td>
                <td>{getTipoPerfilLabel(auth.role)}</td>
                <td>{auth.dataInclusao && formatarData(auth.dataInclusao)}</td>
                <td>{getTipoUserAtivoLabel(auth.ativo)}</td>
                <td>{auth.empresaId}</td>
                <td>{auth.empresaDto?.razaoSocial || '-' }</td>
                <td>{getTipoEmpresaAtivoLabel(auth.empresaAtiva)}</td>
                <td className={stylesDataTable.actionContainer}>
                  {(user.role === 'Suporte' || user.role === 'Sindico') && (
                    <Button variant="primary" size="small" onClick={() => onEdit(auth)} customClass={stylesDataTable.actionButton}>Editar</Button>
                  )}
                  {user.role === 'Suporte' && (
                    <Button variant="danger" size="small" onClick={() => onDelete(auth.id)} customClass={stylesDataTable.actionButton}>Excluir</Button>
                  )}
                </td>
              </tr>
            ))
          )}
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

export default AuthsTable;