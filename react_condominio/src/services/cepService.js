export const buscarCep = async (cepRaw) => {
    const cep = cepRaw.replace(/\D/g, '');
    
    if (cep.length !== 8) return null;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) return { error: "CEP não encontrado" };

        return {
            uf: data.uf,
            cidade: data.localidade,
            endereco: data.logradouro,
            bairro: data.bairro
        };
    } catch (err) {
        return { error: "Erro ao conectar com o serviço de CEP" };
    }
};