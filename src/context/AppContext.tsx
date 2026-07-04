/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile, Device, SupportTicket, Subscription, Notification, Payment } from '../types';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import { subscriberService } from '../services/subscriberService';
import { adminService } from '../services/adminService';
import { notificationService } from '../services/notificationService';
import { paymentService } from '../services/paymentService';

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
  payments: Payment[];
  refreshData: () => Promise<void>;
  readNotification: (id: string) => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  login: (serviceId: string, role: 'SUBSCRIBER' | 'ADMIN') => Promise<boolean>;
  register: (data: {
    email: string;
    fullName: string;
    universityId: string;
    studentId: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    residence: string;
    level: number;
    planId: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    fullName: string,
    phone: string,
    residence: string,
    level: number,
    gender: 'MALE' | 'FEMALE'
  ) => Promise<boolean>;
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
  const [payments, setPayments] = useState<Payment[]>([]);

  const refreshData = async () => {
    const token = localStorage.getItem('ss_token');
    const role = localStorage.getItem('ss_role'); // 'SUBSCRIBER' or 'ADMIN'
    
    if (token && role) {
      try {
        if (role === 'SUBSCRIBER') {
          const res = await subscriberService.getProfile();
          const sub = res.data;
          
          setUser({
            id: sub.id,
            email: sub.email,
            role: 'student',
            created_at: sub.joinedAt
          });
          
          setProfile({
            id: `prof-${sub.id}`,
            user_id: sub.id,
            full_name: `${sub.firstName} ${sub.lastName}`,
            university: sub.institution?.name || 'Unknown University',
            residence: sub.residence || '',
            student_id: sub.studentId || 'N/A',
            phone: sub.phone,
            gender: sub.gender,
            avatar_url: sub.profilePicture || undefined,
            created_at: sub.joinedAt
          });

          // Fetch devices
          const userDevices = sub.devices || [];
          setDevices(userDevices.map((d: any) => ({
            id: d.id,
            user_id: d.subscriberId,
            name: d.name || `${d.brand} ${d.model}`,
            type: d.type.toLowerCase(),
            brand: d.brand || '',
            model: d.model || '',
            serial_number: d.serialCode || '',
            operating_system: d.os || '',
            image_url: d.media && d.media[0] ? d.media[0] : undefined,
            status: d.serviceRequests && d.serviceRequests.length > 0 
              ? (d.serviceRequests[0].status === 'RESOLVED' ? 'resolved' : 'under_repair') 
              : 'active',
            created_at: d.createdAt
          })));

          // Fetch service requests (support tickets)
          const requests = sub.serviceRequests || [];
          setTickets(requests.map((r: any) => ({
            id: r.id,
            user_id: r.subscriberId,
            device_id: r.deviceId,
            title: r.title,
            description: r.description,
            category: r.type,
            priority: r.urgency === 'CRITICAL' ? 'urgent' : r.urgency.toLowerCase(),
            status: r.status.toLowerCase(),
            created_at: r.createdAt,
            updated_at: r.updatedAt,
            website_details: r.businessName ? {
              business_name: r.businessName,
              subdomain: r.desiredSubdomain,
              description: r.websiteConceptDescription,
              pages_count: r.websitePageCount,
              hosting_required: r.preferHosting
            } : undefined,
            receipt_pdf: r.receipt,
            tracking_qr: r.qrCode
          })));

          // Subscription details
          if (sub.plan) {
            setSubscription({
              id: `sub-${sub.id}`,
              user_id: sub.id,
              plan_id: sub.planId,
              status: sub.subscriptionStatus.toLowerCase() as any,
              start_date: sub.joinedAt,
              end_date: new Date(new Date(sub.joinedAt).getTime() + 120 * 24 * 60 * 60 * 1000).toISOString(),
              created_at: sub.joinedAt
            });
          } else {
            setSubscription(null);
          }

          // Fetch Payments
          try {
            const payRes = await paymentService.getPaymentHistory();
            setPayments(payRes.data || []);
          } catch (_) {
            setPayments([]);
          }

          // Fetch Notifications
          try {
            const notifRes = await notificationService.getNotifications();
            setNotifications((notifRes.data || []).map((n: any) => ({
              id: n.id,
              user_id: n.subscriberId || n.adminId,
              title: n.title,
              content: n.body || '',
              type: n.body && n.body.toLowerCase().includes('error') ? 'error' : 'success',
              is_read: n.isRead,
              created_at: n.createdAt
            })));
          } catch (_) {
            setNotifications([]);
          }

        } else if (role === 'ADMIN') {
          const res = await adminService.getProfile();
          const admin = res.data;

          setUser({
            id: admin.id,
            email: admin.email,
            role: 'admin',
            created_at: admin.createdAt
          });

          setProfile({
            id: `prof-admin-${admin.id}`,
            user_id: admin.id,
            full_name: `${admin.firstName} ${admin.lastName}`,
            university: 'StudentShield Hub HQ',
            student_id: admin.serviceId,
            phone: '',
            avatar_url: admin.profilePicture || undefined,
            created_at: admin.createdAt
          });

          setDevices([]);
          setTickets([]);
          setSubscription(null);
          setPayments([]); // Admin payments fetched locally in AdminDashboard if available

          // Fetch Admin Notifications
          try {
            const notifRes = await notificationService.getNotifications();
            setNotifications((notifRes.data || []).map((n: any) => ({
              id: n.id,
              user_id: n.subscriberId || n.adminId,
              title: n.title,
              content: n.body || '',
              type: 'info',
              is_read: n.isRead,
              created_at: n.createdAt
            })));
          } catch (_) {
            setNotifications([]);
          }
        }
      } catch (err) {
        console.error('Error refreshing session details from server:', err);
        localStorage.removeItem('ss_token');
        localStorage.removeItem('ss_role');
        setUser(null);
        setProfile(null);
        setDevices([]);
        setTickets([]);
        setSubscription(null);
        setNotifications([]);
        setPayments([]);
      }
    } else {
      setUser(null);
      setProfile(null);
      setDevices([]);
      setTickets([]);
      setSubscription(null);
      setNotifications([]);
      setPayments([]);
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

  const login = async (serviceId: string, role: 'SUBSCRIBER' | 'ADMIN'): Promise<boolean> => {
    try {
      const res = await authService.login(serviceId, role);
      if (res && res.token) {
        localStorage.setItem('ss_token', res.token);
        localStorage.setItem('ss_role', role);
        await refreshData();
        if (role === 'ADMIN') {
          navigate('admin');
        } else {
          navigate('dashboard');
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const register = async (data: {
    email: string;
    fullName: string;
    universityId: string;
    studentId: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    residence: string;
    level: number;
    planId: string;
  }) => {
    const [firstName = '', ...lastNameParts] = data.fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ') || 'Student';
    
    const payload = {
      email: data.email,
      firstName,
      lastName,
      studentId: data.studentId,
      level: data.level,
      phone: data.phone,
      residence: data.residence,
      gender: data.gender
    };

    const res = await authService.subscribe(payload, data.planId, data.universityId);
    const authUrl = res?.data?.data?.authorization_url || res?.data?.authorization_url;
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      throw new Error('Failed to initiate subscription payment checkout');
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('ss_token');
    const role = localStorage.getItem('ss_role') as 'SUBSCRIBER' | 'ADMIN';
    const currentUserId = user?.id;
    
    if (token && role && currentUserId) {
      try {
        await authService.logout(currentUserId, role);
      } catch (_) {}
    }
    
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_role');
    await refreshData();
    navigate('landing');
  };

  const readNotification = async (id: string) => {
    try {
      await notificationService.readNotification(id);
      await refreshData();
    } catch (e) {
      console.error('Failed to read notification', e);
    }
  };

  const clearNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      await refreshData();
    } catch (e) {
      console.error('Failed to clear notification', e);
    }
  };

  const updateProfile = async (
    fullName: string,
    phone: string,
    residence: string,
    avatarFile?: File | null
  ): Promise<boolean> => {
    try {
      const [firstName = '', ...lastNameParts] = fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || 'Student';
      
      await subscriberService.updateProfile({
        firstName,
        lastName,
        phone,
        residence
      }, avatarFile || undefined);
      await refreshData();
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      return false;
    }
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
      payments,
      refreshData,
      readNotification,
      clearNotification,
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
