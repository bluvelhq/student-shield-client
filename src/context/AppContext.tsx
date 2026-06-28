/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { User, Profile, Device, SupportTicket, Subscription, Notification } from '../types';

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
  updateProfile: (fullName: string, phone: string, university: string) => boolean;
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

  const updateProfile = (fullName: string, phone: string, university: string): boolean => {
    const res = dbService.updateProfile(fullName, phone, university);
    if (res) {
      refreshData();
      return true;
    }
    return false;
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
      updateProfile
    }}>
      {children}
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
