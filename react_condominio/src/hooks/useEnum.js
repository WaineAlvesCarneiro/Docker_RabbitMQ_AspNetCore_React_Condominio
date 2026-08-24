import { useState, useEffect } from 'react';
import api from '../api/api';

export const useEnum = (endpoint) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnum = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/Enums/${endpoint}`);

                const formattedData = response.data.map(item => ({
                    value: item.value ?? item.Value,
                    label: item.label ?? item.Label
                }));
                
                setOptions(formattedData);
            } catch (err) {
                console.error(`Erro ao buscar enum no endpoint Enums/${endpoint}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnum();
    }, [endpoint]);

    return { options, loading };
};

export default useEnum;