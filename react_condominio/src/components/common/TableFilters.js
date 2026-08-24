import React from 'react';
import Button from './Button';
import styles from './TableFilters.module.css';

function TableFilters({ onClear, children }) {
  return (
    <div className={styles.filterContainer}>
        {children}
        <Button variant="secondary" onClick={onClear}>Limpar</Button>
    </div>
  );
}

export default TableFilters;