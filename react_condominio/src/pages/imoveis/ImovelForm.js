import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import stylesForm from '../../components/common/Form.module.css';

function ImovelForm({ onSave, onCancel, imovelData }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [imovel, setImovel] = useState(imovelData || {
        id: 0,
        bloco: '',
        apartamento: '',
        boxGaragem: '',
        empresaId: 0
    });
    const blocoRef = useRef(null);

    useEffect(() => {
        if (blocoRef.current) blocoRef.current.focus();
    }, [imovelData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setImovel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toSend = {
            ...imovel,
            empresaId: parseInt(imovel.empresaId)
        };
        await onSave(toSend);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{imovelData ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</h2>
            <form onSubmit={handleSubmit}>
                {imovel.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input
                            id="id"
                            name="id"
                            value={imovel.id}
                            onChange={handleChange}
                            autoComplete="off"
                            disabled
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="bloco">Bloco:</label>
                    <Input
                        id="bloco"
                        name="bloco"
                        value={imovel.bloco}
                        onChange={handleChange}
                        ref={blocoRef}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="apartamento">Apartamento:</label>
                    <Input
                        id="apartamento"
                        name="apartamento"
                        value={imovel.apartamento}
                        onChange={handleChange}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="boxGaragem">Box garagem:</label>
                    <Input
                        id="boxGaragem"
                        name="boxGaragem"
                        value={imovel.boxGaragem}
                        onChange={handleChange}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                        disabled={user.role === 'Porteiro'}
                    />
                </div>

                <div className={stylesForm.formActions}>
                    {user.role === 'Sindico' && (
                        <Button
                            type="submit"
                            loading={loading}
                            loadingText="Salvando..."
                            variant="primary"
                            size="medium"
                        >
                            Salvar
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="secondary"
                        size="medium"
                    >
                        {user.role === 'Sindico' ? 'Cancelar' : 'Fechar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ImovelForm;