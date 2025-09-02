import { User, Department, RFPRequest, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@ldcelulose.com.br',
    department: 'Produção',
    role: 'solicitante',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@ldcelulose.com.br',
    department: 'Compras',
    role: 'aprovador',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@ldcelulose.com.br',
    department: 'Manutenção',
    role: 'solicitante',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@ldcelulose.com.br',
    department: 'Qualidade',
    role: 'aprovador',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Produção',
    code: 'PROD',
    costCenter: 'CC001'
  },
  {
    id: '2',
    name: 'Manutenção',
    code: 'MAN',
    costCenter: 'CC002'
  },
  {
    id: '3',
    name: 'Qualidade',
    code: 'QUAL',
    costCenter: 'CC003'
  },
  {
    id: '4',
    name: 'Logística',
    code: 'LOG',
    costCenter: 'CC004'
  },
  {
    id: '5',
    name: 'Administrativo',
    code: 'ADM',
    costCenter: 'CC005'
  }
];

export const mockRequests: RFPRequest[] = [
  {
    id: '1',
    requestNumber: 'RFP-2024-001',
    requestDate: '2024-01-15',
    requester: mockUsers[0],
    department: mockDepartments[0],
    urgency: 'normal',
    requestType: 'material',
    items: [
      {
        id: '1',
        description: 'Papel filtro para laboratório',
        quantity: 100,
        unit: 'un',
        estimatedValue: 250.00,
        specifications: 'Papel filtro qualitativo, porosidade média'
      }
    ],
    justification: 'Reposição de estoque para análises de qualidade',
    expectedDate: '2024-02-01',
    deliveryLocation: 'Laboratório de Qualidade',
    status: 'approved',
    approver: mockUsers[1],
    totalValue: 250.00,
    approvalDate: '2024-01-18',
    approverComments: 'Aprovado conforme especificações técnicas'
  },
  {
    id: '2',
    requestNumber: 'RFP-2024-002',
    requestDate: '2024-01-20',
    requester: mockUsers[2],
    department: mockDepartments[1],
    urgency: 'urgent',
    requestType: 'equipment',
    items: [
      {
        id: '2',
        description: 'Bomba centrífuga industrial',
        quantity: 1,
        unit: 'un',
        estimatedValue: 15000.00,
        specifications: 'Bomba centrífuga 10HP, vazão 100m³/h'
      }
    ],
    justification: 'Substituição de equipamento em manutenção crítica',
    expectedDate: '2024-02-15',
    deliveryLocation: 'Setor de Bombas - Área Industrial',
    status: 'pending',
    totalValue: 15000.00
  },
  {
    id: '3',
    requestNumber: 'RFP-2024-003',
    requestDate: '2024-01-25',
    requester: mockUsers[3],
    department: mockDepartments[2],
    urgency: 'normal',
    requestType: 'service',
    items: [
      {
        id: '3',
        description: 'Calibração de equipamentos de medição',
        quantity: 1,
        unit: 'serviço',
        estimatedValue: 800.00,
        specifications: 'Calibração de 15 equipamentos de laboratório'
      }
    ],
    justification: 'Manutenção preventiva dos equipamentos de medição',
    expectedDate: '2024-03-01',
    deliveryLocation: 'Laboratório de Qualidade',
    status: 'submitted',
    totalValue: 800.00
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRequests: 156,
  pendingApprovals: 12,
  approvedRequests: 134,
  rejectedRequests: 10,
  totalValue: 1250000.00,
  monthlyTrend: [
    { month: 'Jan', requests: 45, value: 180000 },
    { month: 'Fev', requests: 52, value: 210000 },
    { month: 'Mar', requests: 48, value: 195000 },
    { month: 'Abr', requests: 55, value: 225000 },
    { month: 'Mai', requests: 51, value: 205000 },
    { month: 'Jun', requests: 49, value: 200000 }
  ]
};
