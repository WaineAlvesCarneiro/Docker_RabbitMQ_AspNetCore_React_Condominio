import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auths/Login';
import DefinirSenha from './pages/auths/DefinirSenha';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Imoveis from './pages/imoveis/Imoveis';
import Moradores from './pages/moradores/Moradores';
import Empresas from './pages/empresas/Empresas';
import Auths from './pages/auths/Auths';
import HomeRedirect from './components/layout/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={['Suporte', 'Sindico', 'Porteiro']} />}>
             <Route path="/definir-senha-permanente" element={<DefinirSenha />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['Suporte', 'Sindico', 'Porteiro']} />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomeRedirect />} />

              <Route element={<PrivateRoute allowedRoles={['Sindico', 'Porteiro']} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="imoveis" element={<Imoveis />} />
                <Route path="moradores" element={<Moradores />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['Suporte']} />}>
                <Route path="empresas" element={<Empresas />} />
                <Route path="auths" element={<Auths />} />
              </Route>
              
            </Route>
          </Route>
          
          <Route path="/unauthorized" element={<h1>Acesso Negado</h1>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;