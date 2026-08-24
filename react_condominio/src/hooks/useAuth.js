import { useState, createContext, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) return formatUserSession(decodedToken, storedToken);
      }
      return null;
    } catch (error) {
      return null;
    }
  });

  function formatUserSession(decoded, token) {
    const rawRole = decoded.role || 
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role/claims/role"];

    return {
      ...decoded,
      token: token,
      username: decoded.unique_name || decoded.sub,
      role: rawRole ? rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase() : null,
      primeiroAcesso: decoded.primeiroAcesso === 'true' || decoded.primeiroAcesso === true
    };
  }

  useEffect(() => {
    if (user && user.token) {
      sessionStorage.setItem('token', user.token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const { token } = response; 
      const decodedToken = jwtDecode(token);

      const userSession = formatUserSession(decodedToken, token);
      setUser(userSession);

      return userSession;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('token');
  };

  const updatePasswordStatus = () => {
    if (user) setUser(prev => ({ ...prev, primeiroAcesso: false }));
  };

  const value = { user, login, logout, updatePasswordStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};