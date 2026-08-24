import React from 'react';
import styles from './Boolean.module.css';

function Boolean({ label, checked, onChange, name, ...props }) {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
        {...props}
      />
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

export default Boolean;