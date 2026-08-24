import React, { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({ options = [], value, onChange, label, firstOptionLabel = "Selecione...", ...props }, ref) => {
  
  const handleInternalChange = (e) => {
    const { value: selectedValue } = e.target;
    const processedValue = selectedValue === "" ? "" : !isNaN(selectedValue) ? Number(selectedValue) : selectedValue;

    onChange({
      target: {
        name: props.name,
        value: processedValue
      }
    });
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        ref={ref}
        className={styles.select}
        value={value}
        onChange={handleInternalChange}
        {...props}
      >
        <option value="">{firstOptionLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;