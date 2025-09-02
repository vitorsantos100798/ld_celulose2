import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, RFPRequest, Notification } from '../types';
import { mockUsers, mockRequests } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  requests: RFPRequest[];
  notifications: Notification[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_REQUEST'; payload: RFPRequest }
  | { type: 'UPDATE_REQUEST'; payload: RFPRequest }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  currentUser: mockUsers[0], // Usuário padrão para demonstração
  requests: mockRequests,
  notifications: [],
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_REQUEST':
      return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id ? action.payload : req
        )
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createRequest: (request: Omit<RFPRequest, 'id' | 'requestNumber' | 'requestDate' | 'requester'>) => void;
  updateRequest: (request: RFPRequest) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const createRequest = (requestData: Omit<RFPRequest, 'id' | 'requestNumber' | 'requestDate' | 'requester'>) => {
    const newRequest: RFPRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestNumber: `RFP-${new Date().getFullYear()}-${String(state.requests.length + 1).padStart(3, '0')}`,
      requestDate: new Date().toISOString().split('T')[0],
      requester: state.currentUser!,
      status: 'draft'
    };
    
    dispatch({ type: 'ADD_REQUEST', payload: newRequest });
    
    // Adicionar notificação
    addNotification({
      type: 'success',
      title: 'Requisição Criada',
      message: `Requisição ${newRequest.requestNumber} foi criada com sucesso.`,
      read: false,
      requestId: newRequest.id
    });
  };

  const updateRequest = (request: RFPRequest) => {
    dispatch({ type: 'UPDATE_REQUEST', payload: request });
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    createRequest,
    updateRequest,
    addNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
