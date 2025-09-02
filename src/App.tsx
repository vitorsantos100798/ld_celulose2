import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { NewRequestForm } from './components/Forms/NewRequestForm';
import { RequestsList } from './components/Requests/RequestsList';
import { useApp } from './context/AppContext';

function AppRoutes() {
  const { state } = useApp();
  const { currentUser, requests } = state;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const myRequests = requests.filter(req => req.requester.id === currentUser.id);
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/nova-requisicao" element={<NewRequestForm />} />
      <Route path="/minhas-requisicoes" element={
        <RequestsList title="Minhas Requisições" requests={myRequests} />
      } />
      <Route path="/requisicoes-pendentes" element={
        <RequestsList title="Requisições Pendentes" requests={pendingRequests} />
      } />
      <Route path="/para-aprovar" element={
        <RequestsList title="Para Aprovar" requests={pendingRequests} />
      } />
      <Route path="/aprovadas" element={
        <RequestsList title="Requisições Aprovadas" requests={approvedRequests} />
      } />
      <Route path="/rejeitadas" element={
        <RequestsList title="Requisições Rejeitadas" requests={rejectedRequests} />
      } />
      <Route path="/relatorios" element={
        <div className="card">
          <h1 className="text-2xl font-bold text-ld-gray-900">Relatórios</h1>
          <p className="text-ld-gray-600">Funcionalidade em desenvolvimento</p>
        </div>
      } />
      <Route path="/usuarios" element={
        <div className="card">
          <h1 className="text-2xl font-bold text-ld-gray-900">Usuários</h1>
          <p className="text-ld-gray-600">Funcionalidade em desenvolvimento</p>
        </div>
      } />
      <Route path="/configuracoes" element={
        <div className="card">
          <h1 className="text-2xl font-bold text-ld-gray-900">Configurações</h1>
          <p className="text-ld-gray-600">Funcionalidade em desenvolvimento</p>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
