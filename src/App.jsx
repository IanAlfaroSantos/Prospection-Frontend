import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Campaigns from './pages/Campaigns';
import Responses from './pages/Responses';
import Leads from './pages/Leads';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import './styles/tokens.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position='top-right' />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/*' element={<ProtectedRoute><div className='app-shell'><Sidebar /><main className='app-main'><div className='page-scroll'><Routes><Route path='/dashboard' element={<Dashboard />} /><Route path='/search' element={<Search />} /><Route path='/campaigns' element={<Campaigns />} /><Route path='/responses' element={<Responses />} /><Route path='/leads' element={<Leads />} /><Route path='/profile' element={<Profile />} /><Route path='*' element={<Navigate to='/dashboard' />} /></Routes></div></main></div></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
