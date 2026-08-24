import { format, isValid } from 'date-fns';

export const parseIsoDateLocal = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;

    try {
        if (dateString.includes('-')) {
            const [datePart] = dateString.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
        
        const date = new Date(dateString);
        return isValid(date) ? date : null;
    } catch (e) {
        console.error("Erro no parse da data:", e);
        return null;
    }
};

export const formatarData = (data) => {
    const d = parseIsoDateLocal(data);
    return d ? format(d, 'dd/MM/yyyy') : '';
};

export const validarDataParaEnvio = (data) => {
    if (!data) return true;
    const d = parseIsoDateLocal(data);
    return d && isValid(d);
};

export const validarDataSaida = (dataEntrada, dataSaida) => {
    if (!dataSaida) return { valido: true, mensagem: '' };
    
    const entrada = parseIsoDateLocal(dataEntrada);
    const saida = parseIsoDateLocal(dataSaida);
    
    if (!entrada || !saida) return { valido: false, mensagem: 'Datas inválidas!' };
    
    if (saida < entrada) {
        return { 
            valido: false, 
            mensagem: 'Data de saída não pode ser anterior à data de entrada!' 
        };
    }
    
    return { valido: true, mensagem: '' };
};

export const formatarCelular = (celular) => {
    if (!celular) return '';
    const apenasDigitos = celular.replace(/\D/g, '');
    if (apenasDigitos.length === 11) return `(${apenasDigitos.substring(0, 2)}) ${apenasDigitos.substring(2, 7)}-${apenasDigitos.substring(7, 11)}`;
    return celular;
};

export const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    const apenasDigitos = telefone.replace(/\D/g, '');
    if (apenasDigitos.length === 10) return `(${apenasDigitos.substring(0, 2)}) ${apenasDigitos.substring(2, 6)}-${apenasDigitos.substring(6, 10)}`;
    return telefone;
};

export const formatarCnpj = (cnpj) => {
    if (!cnpj) return '';
    const apenasDigitos = cnpj.replace(/\D/g, '');
    if (apenasDigitos.length === 14) {
        return `${apenasDigitos.substring(0, 2)}` +
            `.${apenasDigitos.substring(2, 5)}` +
            `.${apenasDigitos.substring(5, 8)}/` +
            `${apenasDigitos.substring(8, 12)}-` +
            `${apenasDigitos.substring(12, 14)}`;
        }
    return cnpj;
};