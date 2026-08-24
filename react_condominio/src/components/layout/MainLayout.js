import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.css';

function MainLayout() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy;Condomínio 2025</p>
      </footer>
    </div>
  );
}

export default MainLayout;