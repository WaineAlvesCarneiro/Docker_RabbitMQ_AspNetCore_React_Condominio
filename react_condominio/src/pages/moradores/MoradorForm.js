import React, { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Switch from '../../components/common/Switch';
import Button from '../../components/common/Button';
import DatePicker from '../../components/common/DatePicker';
import { notificationService } from '../../services/notificationService';
import stylesInput from '../../components/common/Input.module.css';
import stylesForm from '../../components/common/Form.module.css';
import { parseIsoDateLocal, formatarData } from '../../utils/formatters';
import imovelService from '../../services/imovelService';

function MoradorForm({ onSave, onCancel, moradorData }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [morador, setMorador] = useState(() => {
        const initialData = moradorData || {
            id: 0,
            nome: '',
            celular: '',
            email: '',
            isProprietario: false,
            dataEntrada: null,
            dataSaida: null,
            dataInclusao: null,
            dataAlteracao: null,
            imovelId: 0,
            empresaId: 0
        };
        if (initialData.dataEntrada) initialData.dataEntrada = parseIsoDateLocal(initialData.dataEntrada);
        if (initialData.dataSaida) initialData.dataSaida = parseIsoDateLocal(initialData.dataSaida);
        if (initialData.dataInclusao) initialData.dataInclusao = parseIsoDateLocal(initialData.dataInclusao);
        if (initialData.dataAlteracao) initialData.dataAlteracao = parseIsoDateLocal(initialData.dataAlteracao);

        return initialData;
    });
    const nomeRef = useRef(null);
    const [imoveis, setImoveis] = useState([]);

    useEffect(() => {
        const fetchImoveis = async () => {
            if (user?.token) {
                try {
                    const IdEmpresa = user.empresaId;
                    const data = await imovelService.getAll(user.token, IdEmpresa);
                    const options = data.map(imovel => ({
                        value: imovel.id,
                        label: `Bloco ${imovel.bloco} - Apartamento ${imovel.apartamento}`
                    }));
                    setImoveis(options);
                } catch (err) {
                    notificationService.error(`${err.message}`);
                }
            }
        };
        fetchImoveis();
    }, [user]);

    useEffect(() => {
        if (nomeRef.current) nomeRef.current.focus();
    }, [moradorData]);

    const handleChange = (e) => {
        if (user.role === 'Porteiro' && e.target.name === 'isProprietario') return;

        const { name, value, type, checked } = e.target;
        setMorador(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date, name) => {
        if (user.role === 'Porteiro') return;
        setMorador(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toSend = {
            ...morador,
            dataEntrada: morador.dataEntrada ? formatarData(morador.dataEntrada) : null,
            dataSaida: morador.dataSaida ? formatarData(morador.dataSaida) : null,
            imovelId: parseInt(morador.imovelId),
            empresaId: parseInt(morador.empresaId)
        };

        delete toSend.imovelDto;

        await onSave(toSend);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{moradorData ? 'Editar Morador' : 'Adicionar Novo Morador'}</h2>
            <form onSubmit={handleSubmit}>
                {morador.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input id="id" name="id" value={morador.id} disabled />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="nome">Nome:</label>
                    <Input
                        id="nome"
                        name="nome"
                        value={morador.nome}
                        onChange={handleChange}
                        ref={nomeRef}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        disabled={user.role === 'Porteiro'}
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="celular">Celular:</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        id="celular"
                        name="celular"
                        value={morador.celular}
                        onAccept={(value) => setMorador(prev => ({ ...prev, celular: value }))}
                        autoComplete="off"
                        required
                        unmask={true}
                        placeholder="(00) 00000-0000"
                        className={stylesInput.input}
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <Input
                        id="email"
                        name="email"
                        value={morador.email}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="dataEntrada">Data Entrada:</label>
                    <DatePicker
                        id="dataEntrada"
                        name="dataEntrada"
                        value={morador.dataEntrada}
                        onChange={(date) => handleDateChange(date, 'dataEntrada')}
                        required
                        placeholder="dd/mm/aaaa"
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                {morador.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="dataSaida">Data Saída:</label>
                        <DatePicker
                            id="dataSaida"
                            name="dataSaida"
                            value={morador.dataSaida}
                            onChange={(date) => handleDateChange(date, 'dataSaida')}
                            placeholder="dd/mm/aaaa"
                            disabled={user.role === 'Porteiro'}
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="imovelId">Imóvel:</label>
                    <Select
                        id="imovelId"
                        name="imovelId"
                        value={morador.imovelId}
                        onChange={handleChange}
                        options={imoveis}
                        required
                        disabled={user.role === 'Porteiro'}
                    />
                </div>
                <Switch
                    label="É proprietário?"
                    name="isProprietario"
                    checked={morador.isProprietario}
                    onChange={handleChange}
                    disabled={user.role === 'Porteiro'}
                />

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

export default MoradorForm;