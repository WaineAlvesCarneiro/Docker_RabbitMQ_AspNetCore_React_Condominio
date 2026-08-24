import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.module.css';
import styles from './Input.module.css';

const DatePicker = ({ id, name, value, onChange, placeholder, required, disabled }) => {
    return (
        <ReactDatePicker
            id={id}
            name={name}
            selected={value}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            showTimeSelect={false}
            timeFormat="HH:mm"
            timeIntervals={15}
            placeholderText={placeholder}
            className={styles.input}
            required={required}
            disabled={disabled}
        />
    );
};

export default DatePicker;