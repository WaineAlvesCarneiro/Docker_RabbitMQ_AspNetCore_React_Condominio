import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import stylesForm from '../../components/common/Form.module.css';
import { useEnum } from '../../hooks/useEnum'
import Select from '../../components/common/Select';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import empresaService from '../../services/empresaService';

function AuthForm({ onSave, onCancel, authData }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { options: tipoPerfilOptions, loading: loadingEnums } = useEnum('tipo-role');
    const { options: tipoUserAtivoOptions, loading: loadingAtivoEnums } = useEnum('tipo-user-ativo');
    
    const [auth, setAuth] = useState(authData || {
        id: 0,
        ativo: '',
        empresaId: 0,
        userName: '',
        email: '',
        role: '',
        dataInclusao: null,
        dataAlteracao: null
    });
    const userNameRef = useRef(null);
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            if (user?.token) {
                try {
                    const IdEmpresa = user.empresaId;
                    const data = await empresaService.getAll(user.token, IdEmpresa);
                    const options = data.map(empresa => ({
                        value: empresa.id,
                        label: empresa.razaoSocial
                    }));
                    setEmpresas(options);
                } catch (err) {
                    notificationService.error(`${err.message}`);
                }
            }
        };
        fetchEmpresas();
    }, [user]);

    useEffect(() => {
        if (userNameRef.current) {
            userNameRef.current.focus();
        }
    }, [authData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAuth(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toSend = {
            ...auth,
            empresaId: auth.role === 'Suporte' || auth.role === 1 ? null : parseInt(auth.empresaId)
        };
        
        await onSave(toSend);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{authData ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
                {auth.id !== 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="ativo">Ativo:</label>
                        <Select
                            id="ativo"
                            name="ativo"
                            value={auth.ativo}
                            onChange={handleChange}
                            options={tipoUserAtivoOptions}
                            disabled={loadingAtivoEnums}
                            firstOptionLabel={loadingAtivoEnums ? "Carregando..." : "Selecione uma opção"}
                            required
                        />
                    </div>
                )}

                <div className={stylesForm.formGroup}>
                    <label htmlFor="userName">Usuário:</label>
                    <Input
                        id="userName"
                        name="userName"
                        value={auth.userName}
                        onChange={handleChange}
                        ref={userNameRef}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="email">E-mail:</label>
                    <Input
                        id="email"
                        name="email"
                        value={auth.email}
                        onChange={handleChange}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>
                {(user.role === 'Suporte') && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="role">Perfil de Acesso:</label>
                        <Select
                            id="role"
                            name="role"
                            value={auth.role}
                            onChange={handleChange}
                            options={tipoPerfilOptions}
                            disabled={loadingEnums}
                            firstOptionLabel={loadingEnums ? "Carregando..." : "Selecione uma opção"}
                            required
                        />
                    </div>
                )}
                {(user.role === 'Suporte') && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="empresaId">Empresa:</label>
                        <Select
                            id="empresaId"
                            name="empresaId"
                            value={auth.empresaId}
                            onChange={handleChange}
                            options={empresas}
                        />
                    </div>
                )}
                <div className={stylesForm.formActions}>
                    <Button
                        type="submit"
                        loading={loading}
                        loadingText="Salvando..."
                        variant="primary"
                        size="medium"
                    >
                        Salvar
                    </Button>
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="secondary"
                        size="medium"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AuthForm;