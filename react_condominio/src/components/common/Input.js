import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={styles.input}
      {...props}
    />
  );
});

export default Input;