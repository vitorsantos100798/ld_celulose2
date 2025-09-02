import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockDashboardStats } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Dashboard() {
  const { state } = useApp();
  const { requests, currentUser } = state;
  const stats = mockDashboardStats;

  const myRequests = requests.filter(req => req.requester.id === currentUser?.id);
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const urgentRequests = requests.filter(req => req.urgency === 'critical' || req.urgency === 'urgent');

  const urgencyColors = {
    normal: 'bg-ld-green-100 text-ld-green-800',
    urgent: 'bg-ld-gold text-ld-gray-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    draft: 'bg-ld-gray-100 text-ld-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    pending: 'bg-ld-gold text-ld-gray-800',
    approved: 'bg-ld-green-100 text-ld-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ld-gray-900">
            Dashboard
          </h1>
          <p className="text-ld-gray-600">
            Bem-vindo, {currentUser?.name}! Aqui está o resumo das suas atividades.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-ld-gray-500">
            Última atualização: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-ld-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-ld-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ld-gray-600">Total de Requisições</p>
              <p className="text-2xl font-bold text-ld-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-ld-green-500 mr-1" />
              <span className="text-ld-green-600">+12%</span>
              <span className="text-ld-gray-500 ml-1">vs. mês anterior</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-ld-gold rounded-lg">
              <Clock className="h-6 w-6 text-ld-gray-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ld-gray-600">Pendentes de Aprovação</p>
              <p className="text-2xl font-bold text-ld-gray-900">{stats.pendingApprovals}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 text-ld-gold mr-1" />
              <span className="text-ld-gray-600">Atenção necessária</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-ld-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-ld-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ld-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-ld-gray-900">{stats.approvedRequests}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-ld-green-600 font-medium">
                {Math.round((stats.approvedRequests / stats.totalRequests) * 100)}%
              </span>
              <span className="text-ld-gray-500 ml-1">taxa de aprovação</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-ld-gray-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-ld-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-ld-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-ld-gray-900">
                {formatCurrency(stats.totalValue).split(',')[0]}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-ld-gray-600">Média por requisição:</span>
              <span className="text-ld-gray-900 font-medium ml-1">
                {formatCurrency(stats.totalValue / stats.totalRequests).split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Mensal */}
        <div className="card">
          <h3 className="text-lg font-semibold text-ld-gray-900 mb-4">
            Tendência Mensal de Requisições
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value: number) => [value, 'Requisições']}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#2E7D32" 
                strokeWidth={3}
                dot={{ fill: '#2E7D32', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Valor por Mês */}
        <div className="card">
          <h3 className="text-lg font-semibold text-ld-gray-900 mb-4">
            Valor Total por Mês
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Valor']}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requisições Recentes */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ld-gray-900 mb-4">
          Minhas Requisições Recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ld-gray-200">
            <thead className="bg-ld-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Urgência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-ld-gray-200">
              {myRequests.slice(0, 5).map((request) => (
                <tr key={request.id} className="hover:bg-ld-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ld-green-600">
                    {request.requestNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900 capitalize">
                    {request.requestType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${urgencyColors[request.urgency]}`}>
                      {request.urgency === 'normal' ? 'Normal' : 
                       request.urgency === 'urgent' ? 'Urgente' : 'Crítica'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${statusColors[request.status]}`}>
                      {request.status === 'draft' ? 'Rascunho' :
                       request.status === 'submitted' ? 'Enviada' :
                       request.status === 'pending' ? 'Em Aprovação' :
                       request.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900">
                    {request.totalValue ? formatCurrency(request.totalValue) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-500">
                    {format(new Date(request.requestDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas e Notificações */}
      {urgentRequests.length > 0 && (
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Requisições Urgentes
              </h3>
              <p className="text-sm text-red-700">
                Você tem {urgentRequests.length} requisição(ões) marcada(s) como urgente ou crítica.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
