import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './Login.module.css';

function DefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const senhaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (senhaRef.current) senhaRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não conferem!");
      return;
    }

    if (novaSenha.length < 5) {
      toast.error("A senha deve ter pelo menos 5 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await authService.definirSenhaPermanente(novaSenha);      
      toast.success("Senha definida com sucesso! Por favor, faça login novamente.");      
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao definir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Primeiro Acesso</h2>
        <p>Você precisa definir uma senha definitiva para continuar.</p>
        
        <div>
          <label>Nova Senha:</label>
          <Input
            type="password"
            placeholder="Digite sua nova senha"
            ref={senhaRef}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirmar Senha:</label>
          <Input
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          variant="success"
          customClass={styles.fullWidthButton}
        >
          Salvar Senha
        </Button>
      </form>
    </div>
  );
}

export default DefinirSenha;