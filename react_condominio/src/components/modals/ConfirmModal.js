import React from 'react';
import Button from '../common/Button';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ show, onConfirm, onCancel, title, message }) => {
    if (!show) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                </div>
                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        size="small"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;