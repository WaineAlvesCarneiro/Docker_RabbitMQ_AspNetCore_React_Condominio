import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>Condomínio</div>

        {user ? (
          <div className={styles.userSection}>
            <span className={styles.welcomeMessage}>Bem-vindo, {user.username}</span>
            <Button
              variant="danger"
              size="small"
              onClick={handleLogout}>
              Sair
            </Button>
          </div>
        ) : (
          <p className={styles.notLoggedIn}>Você não está logado.</p>
        )}
      </nav>
    </header>
  );
}

export default Header;