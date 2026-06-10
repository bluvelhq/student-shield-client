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
  const [activeView, setActiveView] = useState<string>('landing');
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

  useEffect(() => {
    // Initial fetch
    refreshData();
    
    // Smooth standard scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeView]);

  const navigate = (view: string, state: any = null) => {
    setActiveView(view);
    setViewState(state);
  };

  const login = async (emailOrPhone: string, password?: string): Promise<boolean> => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, password })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          dbService.loginSession(data.user, data.profile);
          refreshData();
          if (data.user.role === 'admin' || data.user.role === 'support_agent') {
            navigate('admin');
          } else {
            navigate('dashboard');
          }
          return true;
        }
      }
    } catch (err) {
      console.warn("Express endpoint offline, doing local login fallback:", err);
    }

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
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          university: data.university,
          studentId: data.studentId,
          role: data.role || 'student',
          planId: 'basic-plan'
        })
      });
      if (resp.ok) {
        const body = await resp.json();
        if (body.success) {
          dbService.loginSession(body.user, body.profile);
          refreshData();
          if (body.user.role === 'admin' || body.user.role === 'support_agent') {
            navigate('admin');
          } else {
            navigate('dashboard');
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Express registration endpoint failed, fall back to offline storage:", err);
    }

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
