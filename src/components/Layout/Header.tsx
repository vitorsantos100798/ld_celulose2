import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { state, logout } = useApp();
  const { currentUser, notifications } = state;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-ld border-b border-ld-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-ld-gray-600 hover:text-ld-green-500 hover:bg-ld-gray-100"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="w-10 h-10 bg-ld-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LD</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-ld-green-700">LD Celulose</h1>
                <p className="text-sm text-ld-gray-600">Sistema RFP</p>
              </div>
            </div>
          </div>

          {/* Informações do Usuário e Notificações */}
          <div className="flex items-center space-x-4">
            {/* Data e Hora */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-ld-gray-800">
                {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
              </p>
              <p className="text-xs text-ld-gray-600">
                {format(new Date(), 'HH:mm')}
              </p>
            </div>

            {/* Notificações */}
            <div className="relative">
              <button className="p-2 rounded-full text-ld-gray-600 hover:text-ld-green-500 hover:bg-ld-gray-100 relative">
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* Usuário */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-ld-gray-800">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-ld-gray-600">
                  {currentUser?.department}
                </p>
              </div>
              
              <div className="w-8 h-8 bg-ld-green-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-ld-green-600" />
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-full text-ld-gray-600 hover:text-red-500 hover:bg-red-50"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
