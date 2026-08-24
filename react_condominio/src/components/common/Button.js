import React from 'react';
import styles from './Button.module.css';

function Button({ children, onClick, type = 'button', disabled = false, loading = false, loadingText = 'Carregando...', variant = 'primary', size = 'medium', customClass = '' }) {
  const isDisabled = disabled || loading;

  const buttonClass = `${styles.button} ${styles[`button_${variant}`]} ${styles[`button_${size}`]} ${customClass}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default Button;