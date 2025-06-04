import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ClientMenuPage from './pages/ClientMenuPage';
import HomePage from './pages/HomePage';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cardapio" element={<ClientMenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;