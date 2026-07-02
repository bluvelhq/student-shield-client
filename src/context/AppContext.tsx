/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { User, Profile, Device, SupportTicket, Subscription, Notification } from '../types';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  activeView: string;
  viewState: any;
  navigate: (view: string, state?: any) => void;
  user: User | null;
  profile: Profile | null;
  devices: Device[];
  tickets: SupportTicket[];
  subscription: Subscription | null;
  notifications: Notification[];
  refreshData: () => void;
  login: (emailOrPhone: string, password?: string) => boolean | Promise<boolean>;
  register: (data: { email: string; fullName: string; university: string; studentId: string; phone: string; role?: 'student' | 'admin' }) => void | Promise<void>;
  logout: () => void;
  updateProfile: (fullName: string, phone: string, university: string, avatarUrl?: string) => boolean;
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewFromPath = (path: string): string => {
    const clean = path.split('?')[0].replace(/\/$/, ''); // strip trailing slash and queries
    switch (clean) {
      case '':
      case '/':
        return 'landing';
      case '/about':
        return 'about';
      case '/services':
        return 'services';
      case '/pricing':
        return 'pricing';
      case '/how-it-works':
        return 'how-it-works';
      case '/plans':
        return 'plans';
      case '/faq':
        return 'faq';
      case '/contact':
        return 'contact';
      case '/blog':
        return 'blog';
      case '/help-center':
        return 'help-center';
      case '/login':
        return 'login';
      case '/register':
        return 'register';
      case '/forgot-password':
        return 'forgot-password';
      case '/dashboard':
        return 'dashboard';
      case '/admin':
        return 'admin';
      case '/request-details':
        return 'request-details';
      default:
        return 'landing';
    }
  };

  const pathFromView = (view: string): string => {
    switch (view) {
      case 'landing':
        return '/';
      default:
        return `/${view}`;
    }
  };

  const [activeView, setActiveView] = useState<string>(() => viewFromPath(window.location.pathname));
  const [viewState, setViewState] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshData = () => {
    const session = dbService.getCurrentUser();
    if (session) {
      setUser(session.user);
      setProfile(session.profile);
      setDevices(dbService.getDevices());
      setTickets(dbService.getTickets());
      setSubscription(dbService.getSubscription());
      setNotifications(dbService.getNotifications());
    } else {
      setUser(null);
      setProfile(null);
      setDevices([]);
      setTickets([]);
      setSubscription(null);
      setNotifications([]);
    }
  };

  // Synchronize dynamic URL push/pop changes
  useEffect(() => {
    refreshData();
    const handleLocationChange = () => {
      const current = viewFromPath(window.location.pathname);
      setActiveView(current);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    // Smooth standard scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeView]);

  const navigate = (view: string, state: any = null) => {
    setActiveView(view);
    setViewState(state);
    
    const targetPath = pathFromView(view);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(state, '', targetPath + window.location.search);
    }
  };

  const login = async (emailOrPhone: string, password?: string): Promise<boolean> => {
    const res = dbService.login(emailOrPhone);
    if (res) {
      refreshData();
      if (res.user.role === 'admin' || res.user.role === 'support_agent') {
        navigate('admin');
      } else {
        navigate('dashboard');
      }
      return true;
    }
    return false;
  };

  const register = async (data: { email: string; fullName: string; university: string; studentId: string; phone: string; role?: 'student' | 'admin' }) => {
    const res = dbService.signUp(data);
    refreshData();
    if (res.user.role === 'admin' || res.user.role === 'support_agent') {
      navigate('admin');
    } else {
      navigate('dashboard');
    }
  };

  const logout = () => {
    dbService.logout();
    refreshData();
    navigate('landing');
  };

  const updateProfile = (fullName: string, phone: string, university: string, avatarUrl?: string): boolean => {
    const res = dbService.updateProfile(fullName, phone, university, avatarUrl);
    if (res) {
      refreshData();
      return true;
    }
    return false;
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider value={{
      activeView,
      viewState,
      navigate,
      user,
      profile,
      devices,
      tickets,
      subscription,
      notifications,
      refreshData,
      login,
      register,
      logout,
      updateProfile,
      showToast
    }}>
      {children}

      {/* Dynamic site-wide Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col space-y-3 max-w-sm pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
              className={`p-3.5 rounded-2xl shadow-xl flex items-start space-x-3 pointer-events-auto border bg-white/95 backdrop-blur max-w-xs ${
                t.type === 'success' ? 'border-emerald-100 bg-emerald-50/95 text-emerald-905' :
                t.type === 'error' ? 'border-rose-100 bg-rose-50/95 text-rose-905' :
                t.type === 'warning' ? 'border-amber-100 bg-amber-50/95 text-amber-905' :
                'border-blue-100 bg-blue-50/95 text-blue-905'
              }`}
            >
              {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
              
              <div className="flex-grow text-[10.5px] font-sans font-bold tracking-normal leading-normal pr-1 text-slate-800">
                {t.message}
              </div>
              
              <button 
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-slate-400 hover:text-slate-700 shrink-0 mt-0.5 cursor-pointer border-0 bg-transparent"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
