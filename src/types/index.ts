export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'solicitante' | 'aprovador' | 'admin';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  costCenter: string;
}

export interface RequestItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedValue?: number;
  specifications?: string;
  suggestedSupplier?: string;
}

export interface RFPRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  requester: User;
  department: Department;
  urgency: 'normal' | 'urgent' | 'critical';
  requestType: 'material' | 'service' | 'equipment';
  items: RequestItem[];
  justification: string;
  expectedDate: string;
  deliveryLocation: string;
  observations?: string;
  attachments?: string[];
  projectCode?: string;
  approver?: User;
  totalValue?: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected';
  approverComments?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingApprovals: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalValue: number;
  monthlyTrend: Array<{
    month: string;
    requests: number;
    value: number;
  }>;
}
