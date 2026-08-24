import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await login(username, password);      
      if (session.primeiroAcesso) navigate('/definir-senha-permanente');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Usuário:</label>
          <Input
            type="text"
            placeholder="Usuário"
            ref={usernameRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button
          type="submit"
          loading={loading}
          loadingText="Entrando..."
          variant="success"
          size="medium"
          customClass={styles.fullWidthButton}
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}

export default Login;