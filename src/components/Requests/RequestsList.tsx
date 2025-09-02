import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RequestsListProps {
  title: string;
  requests: any[];
  showActions?: boolean;
}

export function RequestsList({ title, requests, showActions = true }: RequestsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { updateRequest } = useApp();

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', class: 'status-draft' },
      submitted: { label: 'Enviada', class: 'status-draft' },
      pending: { label: 'Em Aprovação', class: 'status-pending' },
      approved: { label: 'Aprovada', class: 'status-approved' },
      rejected: { label: 'Rejeitada', class: 'status-rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      normal: { label: 'Normal', class: 'bg-ld-green-100 text-ld-green-800' },
      urgent: { label: 'Urgente', class: 'bg-ld-gold text-ld-gray-800' },
      critical: { label: 'Crítica', class: 'bg-red-100 text-red-800' }
    };
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ld-gray-900">{title}</h1>
          <p className="text-ld-gray-600">
            {filteredRequests.length} requisição(ões) encontrada(s)
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ld-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número ou solicitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="submitted">Enviada</option>
              <option value="pending">Em Aprovação</option>
              <option value="approved">Aprovada</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Requisições */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ld-gray-200">
            <thead className="bg-ld-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                  Departamento
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
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-ld-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-ld-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-ld-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ld-green-600">
                    {request.requestNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900">
                    {request.requester.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900">
                    {request.department.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900 capitalize">
                    {request.requestType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUrgencyBadge(request.urgency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-900">
                    {request.totalValue ? formatCurrency(request.totalValue) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ld-gray-500">
                    {format(new Date(request.requestDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-ld-green-600 hover:text-ld-green-900 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-ld-gray-600 hover:text-ld-gray-900 p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-ld-gray-600 hover:text-ld-gray-900 p-1">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
