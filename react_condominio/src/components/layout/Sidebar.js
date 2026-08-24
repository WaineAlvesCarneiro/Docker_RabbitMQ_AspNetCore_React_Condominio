import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { user } = useAuth();
  return (
    <nav className={styles.sidebar}>
      <ul>
        {['Suporte', 'Sindico', 'Porteiro'].includes(user?.role) && (
          <li>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          </li>
        )}

        {['Sindico', 'Porteiro'].includes(user?.role) && (
          <li>
            <Link to="/imoveis" className={styles.navLink}>Imóveis</Link>
          </li>
        )}
      
        {['Sindico', 'Porteiro'].includes(user?.role) && (
          <li>
            <Link to="/moradores" className={styles.navLink}>Moradores</Link>
          </li>
        )}

        {['Suporte'].includes(user?.role) && (
          <li>
            <Link to="/empresas" className={styles.navLink}>Empresas</Link>
          </li>
        )}
        
        {['Suporte'].includes(user?.role) && (
          <li>
            <Link to="/auths" className={styles.navLink}>Usuários</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;