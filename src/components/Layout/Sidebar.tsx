import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Settings,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state } = useApp();
  const { currentUser } = state;

  const isApprover = currentUser?.role === 'aprovador' || currentUser?.role === 'admin';

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      current: true
    },
    {
      name: 'Nova Requisição',
      href: '/nova-requisicao',
      icon: Plus,
      current: false
    },
    {
      name: 'Minhas Requisições',
      href: '/minhas-requisicoes',
      icon: FileText,
      current: false
    },
    {
      name: 'Requisições Pendentes',
      href: '/requisicoes-pendentes',
      icon: Clock,
      current: false
    },
    ...(isApprover ? [
      {
        name: 'Para Aprovar',
        href: '/para-aprovar',
        icon: CheckCircle,
        current: false
      },
      {
        name: 'Aprovadas',
        href: '/aprovadas',
        icon: CheckCircle,
        current: false
      },
      {
        name: 'Rejeitadas',
        href: '/rejeitas',
        icon: XCircle,
        current: false
      }
    ] : []),
    {
      name: 'Relatórios',
      href: '/relatorios',
      icon: BarChart3,
      current: false
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      current: false
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      current: false
    }
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-ld transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo da empresa */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-ld-gray-100">
            <div className="w-12 h-12 bg-ld-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LD</span>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-ld-green-700">LD Celulose</h2>
              <p className="text-xs text-ld-gray-600">Sistema RFP</p>
            </div>
          </div>

          {/* Frase institucional */}
          <div className="px-4 py-2 bg-ld-green-50 border-b border-ld-green-100">
            <p className="text-xs text-ld-green-700 text-center italic">
              "Gestão inteligente e sustentável de compras para nossa operação"
            </p>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-ld-green-100 text-ld-green-700' 
                    : 'text-ld-gray-600 hover:bg-ld-gray-100 hover:text-ld-gray-900'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Informações do usuário */}
          <div className="p-3 border-t border-ld-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-ld-green-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-ld-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-ld-gray-800">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-ld-gray-600 capitalize">
                  {currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
