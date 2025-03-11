import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Producers from './pages/Producers';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const App = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <AppContainer>
          <Navbar />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produtores" element={<Producers />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppContainer>
        <ToastContainer position="bottom-right" />
      </Router>
    </>
  );
};

export default App; 