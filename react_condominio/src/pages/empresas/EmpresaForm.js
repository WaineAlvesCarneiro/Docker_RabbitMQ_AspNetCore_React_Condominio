import React, { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import stylesForm from '../../components/common/Form.module.css';
import stylesInput from '../../components/common/Input.module.css';
import { buscarCep } from '../../services/cepService';
import { useEnum } from '../../hooks/useEnum';
import { notificationService } from '../../services/notificationService';

function EmpresaForm({ onSave, onCancel, empresaData }) {
    const [loading, setLoading] = useState(false);
    const { options: tipoCondominioOptions, loading: loadingEnums } = useEnum('tipo-condominio');
    const { options: tipoEmpresaAtivoOptions, loading: loadingAtivoEnums } = useEnum('tipo-empresa-ativo');

    const [empresa, setEmpresa] = useState(empresaData || {
        id: 0,
        ativo: '',
        razaoSocial: '',
        fantasia: '',
        cnpj: '',
        tipoDeCondominio: '',
        nome: '',
        celular: '',
        telefone: '',
        email: '',
        senha: '',
        host: 'smtp.gmail.com',
        porta: 587,
        cep: '',
        uf: '',
        cidade: '',
        endereco: '',
        bairro: '',
        complemento: '',
        dataInclusao: null,
        dataAlteracao: null,
    });

    const [errors, setErrors] = useState({});

    const validarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14) return false;
        return true;
    };

    const handleCepAccept = async (value) => {
        setEmpresa(prev => ({ ...prev, cep: value }));

        if (value.length === 8) {
            const resultado = await buscarCep(value);
            
            if (resultado && !resultado.error) {
                setEmpresa(prev => ({
                    ...prev,
                    uf: resultado.uf,
                    cidade: resultado.cidade,
                    endereco: resultado.endereco,
                    bairro: resultado.bairro
                }));
            }
        }
    };
    
    const razaoSocialRef = useRef(null);

    useEffect(() => {
        if (razaoSocialRef.current) razaoSocialRef.current.focus();
    }, [empresaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if ((!empresa.id || empresa.id === 0) && !empresa.senha) {
            notificationService.error("A senha é obrigatória para novas empresas.");
            setLoading(false);
            return;
        }
        await onSave(empresa);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{empresaData ? 'Editar Empresa' : 'Adicionar Novo Empresa'}</h2>
            <form onSubmit={handleSubmit}>
                {empresa.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input id="id" name="id" value={empresa.id} disabled />
                    </div>
                )}
                {empresa.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="ativo">Ativo:</label>
                        <Select
                            id="ativo"
                            name="ativo"
                            value={empresa.ativo}
                            onChange={handleChange}
                            options={tipoEmpresaAtivoOptions}
                            disabled={loadingAtivoEnums}
                            firstOptionLabel={loadingAtivoEnums ? "Carregando..." : "Selecione uma opção"}
                            required
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="razaoSocial">Razão Social:</label>
                    <Input
                        id="razaoSocial"
                        name="razaoSocial"
                        value={empresa.razaoSocial}
                        onChange={handleChange}
                        ref={razaoSocialRef}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="fantasia">Fantasia:</label>
                    <Input
                        id="fantasia"
                        name="fantasia"
                        value={empresa.fantasia}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="cnpj">Cnpj:</label>
                    <IMaskInput
                        mask="00.000.000/0000-00"
                        value={empresa.cnpj}
                        unmask={true}
                        onAccept={(value) => {
                            setEmpresa(prev => ({ ...prev, cnpj: value }));
                            if (value.length === 14 && !validarCNPJ(value)) {
                                setErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
                            } else {
                                setErrors(prev => ({ ...prev, cnpj: null }));
                            }
                        }}
                        className={`${stylesInput.input} ${errors.cnpj ? stylesInput.inputError : ''}`}
                        required
                    />
                    {errors.cnpj && <span className={stylesForm.errorMessage}>{errors.cnpj}</span>}
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="tipoDeCondominio">Tipo De Condomínio:</label>
                    <Select
                        id="tipoDeCondominio"
                        name="tipoDeCondominio"
                        value={empresa.tipoDeCondominio}
                        onChange={handleChange}
                        options={tipoCondominioOptions}
                        disabled={loadingEnums}
                        firstOptionLabel={loadingEnums ? "Carregando..." : "Selecione uma opção"}
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="nome">Nome do Responsével:</label>
                    <Input
                        id="nome"
                        name="nome"
                        value={empresa.nome}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="celular">Celular:</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        value={empresa.celular}
                        unmask={true}
                        onAccept={(value) => setEmpresa(prev => ({ ...prev, celular: value }))}
                        autoComplete="off"
                        placeholder="(99) 99999-9999"
                        className={stylesInput.input}
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="telefone">Telefone:</label>
                    <IMaskInput
                        mask="(00) 0000-0000"
                        value={empresa.telefone}
                        unmask={true}
                        onAccept={(value) => setEmpresa(prev => ({ ...prev, telefone: value }))}
                        autoComplete="off"
                        placeholder="(00) 0000-0000"
                        className={stylesInput.input}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <Input
                        id="email"
                        name="email"
                        value={empresa.email}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="senha">Senha:</label>
                    <Input
                        id="senha"
                        name="senha"
                        type="password"
                        value={empresa.senha}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required={!empresa.id || empresa.id === 0}
                        placeholder={empresa.id > 0 ? "Deixe em branco para manter a atual" : "Digite a senha"}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="host">Host:</label>
                    <Input
                        id="host"
                        name="host"
                        value={empresa.host}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="porta">Porta:</label>
                    <Input
                        id="porta"
                        name="porta"
                        value={empresa.porta}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={10}
                        autoComplete="off"
                        className={stylesInput.input}
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="cep">Cep:</label>
                    <IMaskInput
                        mask="00000-000"
                        value={empresa.cep}
                        unmask={true}
                        onAccept={handleCepAccept}
                        autoComplete="off"
                        placeholder="00000-000"
                        className={stylesInput.input}
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="uf">Uf:</label>
                    <Input
                        id="uf"
                        name="uf"
                        value={empresa.uf}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={2}
                        readOnly
                        className={stylesInput.disabledInput}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="cidade">Cidade:</label>
                    <Input
                        id="cidade"
                        name="cidade"
                        value={empresa.cidade}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        readOnly
                        className={stylesInput.disabledInput}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="endereco">Endereço:</label>
                    <Input
                        id="endereco"
                        name="endereco"
                        value={empresa.endereco}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        readOnly
                        className={stylesInput.disabledInput}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="bairro">Bairro:</label>
                    <Input
                        id="bairro"
                        name="bairro"
                        value={empresa.bairro}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        readOnly
                        className={stylesInput.disabledInput}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="complemento">Complemento:</label>
                    <Input
                        id="complemento"
                        name="complemento"
                        value={empresa.complemento}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                    />
                </div>

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

export default EmpresaForm;