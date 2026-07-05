/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/ui/AppLogo';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { 
  Shield, Cpu, FileText, CheckCircle, 
  MessageCircle, RefreshCw, Send, ArrowLeft,
  TrendingUp, Users, DollarSign, Activity, Eye, X,
  AlertTriangle, PlayCircle, ShieldAlert, Award, Plus, Loader2,
  Layers, Settings, Laptop, ArrowRight, LogOut, Menu, School
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, SupportTicket, Message, Profile, User, Payment, Plan, Institution } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, profile, logout, refreshData, showToast } = useApp();
  const isAgent = user?.role === 'support_agent';

  // Left sidebar navigation
  const [activeTab, setActiveTab] = useState<'metrics' | 'membership' | 'tickets' | 'plan_creation' | 'cohort_operations' | 'institutions'>(
    () => (localStorage.getItem('adminActiveTab') as any) || 'metrics'
  );
  
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DB registries
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    openTickets: 0,
    totalRevenue: 0,
    activeDevicesCount: 0,
    monthlySubRate: 0
  });
  const [allUsers, setAllUsers] = useState<{ user: User; profile: Profile; subscription?: any; activeDeviceCount: number }[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [allPayments, setAllPayments] = useState<{ payment: Payment; profile: Profile }[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  // Triage Active Focus
  const [adminFocusTicket, setAdminFocusTicket] = useState<SupportTicket | null>(null);
  const [adminFocusedMessages, setAdminFocusedMessages] = useState<{ message: Message; senderName: string; senderAvatar?: string }[]>([]);
  const [adminReplyVal, setAdminReplyVal] = useState('');

  // Membership Drawer
  const [selectedMember, setSelectedMember] = useState<{ user: User; profile: Profile; subscription?: any; activeDeviceCount: number } | null>(null);
  const [selectedMemberDevices, setSelectedMemberDevices] = useState<Device[]>([]);
  const [selectedMemberTickets, setSelectedMemberTickets] = useState<SupportTicket[]>([]);

  // Cohort Deactivation Action
  const [targetUniCohort, setTargetUniCohort] = useState('University of Ghana (Legon)');
  const [cohortMsg, setCohortMsg] = useState('');

  // Plan creation forms
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanFee, setNewPlanFee] = useState(30);
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanBenefits, setNewPlanBenefits] = useState('');
  const [newPlanDevices, setNewPlanDevices] = useState(1);
  const [newPlanError, setNewPlanError] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [isPlanSubmitting, setIsPlanSubmitting] = useState(false);

  // Support ticket filter criteria
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<string>('all');
  const [ticketPlanFilter, setTicketPlanFilter] = useState<string>('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [isStatusUpdating, setIsStatusUpdating] = useState<string | null>(null);

  // Institutions Tab states
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [instName, setInstName] = useState('');
  const [instShort, setInstShort] = useState('');
  const [instLocation, setInstLocation] = useState('');
  const [editingInstId, setEditingInstId] = useState<string | null>(null);
  const [isInstSubmitting, setIsInstSubmitting] = useState(false);
  const [cohortSubmittingType, setCohortSubmittingType] = useState<'suspend' | 'expire' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [usersRes, ticketsRes, devicesRes, instsRes, plansRes] = await Promise.all([
        adminService.getSubscribers(),
        adminService.getRequests(),
        adminService.getDevices(),
        adminService.getInstitutions(),
        authService.getPlans()
      ]);

      const subscribers = usersRes.data || [];
      const requestsList = ticketsRes.data || [];
      const devicesList = devicesRes.data || [];
      const instsList = instsRes.data || [];
      const plansList = plansRes || [];

      setPlans(plansList);

      setAllUsers(subscribers.map((s: any) => ({
        user: {
          id: s.id,
          email: s.email,
          role: 'student',
          created_at: s.joinedAt
        },
        profile: {
          id: `prof-${s.id}`,
          user_id: s.id,
          full_name: `${s.firstName} ${s.lastName}`,
          university: s.institution?.name || 'Unknown University',
          student_id: s.studentId || 'N/A',
          phone: s.phone,
          gender: s.gender,
          created_at: s.joinedAt
        },
        subscription: s.plan ? {
          id: `sub-${s.id}`,
          user_id: s.id,
          plan_id: s.planId,
          status: s.subscriptionStatus?.toLowerCase() || 'active',
          start_date: s.joinedAt,
          end_date: s.updatedAt,
          created_at: s.joinedAt,
          plan: s.plan
        } : undefined,
        activeDeviceCount: s.devices?.length || 0
      })));

      setAllTickets(requestsList.map((req: any) => ({
        id: req.id,
        user_id: req.subscriberId,
        device_id: req.deviceId,
        title: req.title,
        description: req.description,
        category: req.type as any,
        priority: req.urgency === 'CRITICAL' ? 'urgent' : req.urgency.toLowerCase() as any,
        status: req.status.toLowerCase() as any,
        created_at: req.createdAt,
        updated_at: req.updatedAt,
        receipt_pdf: req.receipt,
        tracking_qr: req.qrCode
      })));

      setAllDevices(devicesList.map((d: any) => ({
        id: d.id,
        user_id: d.subscriberId,
        name: d.name || `${d.brand} ${d.model}`,
        type: d.type.toLowerCase(),
        brand: d.brand || '',
        model: d.model || '',
        serial_number: d.serialCode || '',
        operating_system: d.os || '',
        status: 'active',
        created_at: d.createdAt
      })));

      setInstitutions(instsList.map((i: any) => ({
        id: i.id,
        name: i.name,
        short_name: i.shortName,
        location: i.location,
        status: i.status.toLowerCase() as any
      })));

      const totalUsers = subscribers.length;
      const activePlans = 3;
      const openTickets = requestsList.filter((t: any) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
      const activeDevicesCount = devicesList.length;

      let totalRevenue = 0;
      try {
        const revRes = await adminService.getRevenue();
        totalRevenue = revRes.data || 0;
      } catch (e) {
        console.warn('Failed to fetch revenue:', e);
      }

      setStats({
        totalUsers,
        activePlans,
        openTickets,
        totalRevenue,
        activeDevicesCount,
        monthlySubRate: totalRevenue / (totalUsers || 1)
      });

      setAllPayments([]);

    } catch (err: any) {
      console.error('API error loading admin data:', err);
      showToast('Failed to load admin data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (adminFocusTicket) {
      setAdminFocusedMessages([]);
    }
  }, [adminFocusTicket]);

  useEffect(() => {
    if (selectedMember) {
      const devs = allDevices.filter(d => d.user_id === selectedMember.user.id);
      const tix = allTickets.filter(t => t.user_id === selectedMember.user.id);
      setSelectedMemberDevices(devs);
      setSelectedMemberTickets(tix);
    }
  }, [selectedMember, allDevices, allTickets]);

  const handleAdminStatusChange = async (ticketId: string, status: SupportTicket['status']) => {
    setIsStatusUpdating(status);
    try {
      const backendStatusMap: Record<string, string> = {
        open: 'OPEN',
        in_progress: 'IN_PROGRESS',
        waiting_on_user: 'PENDING',
        resolved: 'RESOLVED',
        closed: 'CLOSED',
        delivered: 'DELIVERED'
      };
      const backendStatus = (backendStatusMap[status] || 'OPEN') as any;
      await adminService.updateRequestStatus(ticketId, backendStatus);
      await loadAdminData();
      if (adminFocusTicket && adminFocusTicket.id === ticketId) {
        setAdminFocusTicket({ ...adminFocusTicket, status });
      }
    } catch (err) {
      console.error('API update status failed:', err);
      showToast('Status update failed', 'error');
    } finally {
      setIsStatusUpdating(null);
    }
  };

  const handleAdminReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminFocusTicket && adminReplyVal.trim()) {
      showToast('Messaging coming soon', 'info');
      setAdminReplyVal('');
    }
  };

  const toggleSubStatus = async (subId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      // Suspend single subscriber is fallback only (no direct endpoint)
      console.warn(`Suspending a single subscriber (subId=${subId}) is not yet supported via API.`);
      showToast(`Subscriber status update not supported via API yet.`, 'warning');
    } catch (err) {
      console.error('Toggle subscription failed:', err);
      showToast('Toggle subscription failed', 'error');
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus?: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
    try {
      await adminService.updatePlan(planId, { isActive: nextStatus === 'active' });
      await loadAdminData();
      showToast(`Plan status updated to ${nextStatus.toUpperCase()}`, 'success');
    } catch (err) {
      console.error('Toggle plan status failed:', err);
      showToast('Toggle plan status failed', 'error');
    }
  };

  const executeCohortDeactivate = async () => {
    setCohortSubmittingType('suspend');
    try {
      const matched = institutions.find(i => i.name === targetUniCohort || i.id === targetUniCohort);
      if (matched) {
        await adminService.bulkSuspendSubscription(matched.id);
        await loadAdminData();
        setCohortMsg(`Success: Suspended active subscribers in ${matched.name}.`);
      } else {
        throw new Error('Hub not found');
      }
    } catch (err: any) {
      console.error('API cohort deactivate failed:', err);
      showToast(err.message || 'Cohort deactivation failed', 'error');
    } finally {
      setCohortSubmittingType(null);
    }
    setTimeout(() => setCohortMsg(''), 5000);
  };

  const executeCohortExpire = async () => {
    setCohortSubmittingType('expire');
    try {
      const matched = institutions.find(i => i.name === targetUniCohort || i.id === targetUniCohort);
      if (matched) {
        await adminService.bulkExpireSubscription(matched.id);
        await loadAdminData();
        setCohortMsg(`Success: Expired active subscribers in ${matched.name}.`);
      } else {
        throw new Error('Hub not found');
      }
    } catch (err: any) {
      console.error('API cohort expire failed:', err);
      showToast(err.message || 'Cohort expiration failed', 'error');
    } finally {
      setCohortSubmittingType(null);
    }
    setTimeout(() => setCohortMsg(''), 5000);
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setNewPlanName('');
    setNewPlanFee(30);
    setNewPlanDesc('');
    setNewPlanBenefits('');
    setNewPlanDevices(1);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setNewPlanName(plan.type || plan.name || 'BASIC');
    setNewPlanFee(plan.fee || plan.price || 30);
    setNewPlanDesc(plan.summary || plan.description || '');
    setNewPlanBenefits((plan.benefits || plan.features || []).join('\n'));
    setNewPlanDevices(plan.max_devices || (plan as any).maxDevices || 1);
  };

  const handlePlanCreationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPlanError('');

    if (!newPlanName || !newPlanDesc) {
      setNewPlanError('Please enter all required plan configurations.');
      return;
    }

    const benefitList = newPlanBenefits
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    setIsPlanSubmitting(true);
    try {
      // If adding a new plan, ensure type matches enum format
      const backendType = newPlanName.toUpperCase().replace(/\s|-/g, '_') as any;
      if (editingPlanId) {
        await adminService.updatePlan(editingPlanId, {
          fee: newPlanFee,
          maxDevices: newPlanDevices,
          summary: newPlanDesc,
          benefits: benefitList
        });
        setEditingPlanId(null);
        showToast(`Plan [${newPlanName}] updated successfully.`, 'success');
      } else {
        await adminService.addPlan({
          type: backendType,
          fee: newPlanFee,
          maxDevices: newPlanDevices,
          summary: newPlanDesc,
          benefits: benefitList
        });
        showToast(`Plan [${newPlanName}] created successfully.`, 'success');
      }
      
      setNewPlanName('');
      setNewPlanFee(30);
      setNewPlanDesc('');
      setNewPlanBenefits('');
      setNewPlanDevices(1);
      await loadAdminData();
    } catch (err: any) {
      console.error('API update plan failed:', err);
      showToast(err?.response?.data?.message || 'Plan creation/update failed', 'error');
    } finally {
      setIsPlanSubmitting(false);
    }
  };

  const handleSaveInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim() || !instShort.trim() || !instLocation.trim()) return;

    setIsInstSubmitting(true);
    try {
      if (editingInstId) {
        await adminService.updateInstitution(editingInstId, {
          name: instName,
          shortName: instShort,
          location: instLocation,
          status: 'ACTIVE'
        });
        setEditingInstId(null);
        showToast('Institution updated successfully.', 'success');
      } else {
        await adminService.addInstitution({
          name: instName,
          shortName: instShort,
          location: instLocation,
          status: 'ACTIVE'
        });
        showToast('Institution added successfully.', 'success');
      }
      setInstName('');
      setInstShort('');
      setInstLocation('');
      await loadAdminData();
    } catch (err) {
      console.error('API save institution failed:', err);
      showToast('Save institution failed', 'error');
    } finally {
      setIsInstSubmitting(false);
    }
  };

  const handleEditClick = (inst: Institution) => {
    setEditingInstId(inst.id);
    setInstName(inst.name);
    setInstShort(inst.short_name);
    setInstLocation(inst.location);
  };

  const handleDeleteInstitution = async (id: string) => {
    if (confirm('Are you sure you want to delete this institution?')) {
      try {
        await adminService.removeInstitution(id);
        await loadAdminData();
      } catch (err) {
        console.error('API delete institution failed:', err);
        showToast('Delete institution failed', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'inactive': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'suspended': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'expired': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'deleted': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-150';
      case 'delivered': return 'bg-teal-50 text-teal-700 border border-teal-150';
      case 'open': return 'bg-blue-50 text-royal border border-blue-150';
      case 'in_progress': return 'bg-amber-50 text-amber-600 border border-amber-105';
      default: return 'bg-slate-50 text-slate-500 border border-slate-150';
    }
  };

  const getSubscribedPlan = (userId: string) => {
    const member = allUsers.find(u => u.user.id === userId);
    return member?.subscription ? (member.subscription.plan?.type || member.subscription.planId) : 'No Active Cover';
  };

  const getPlanByUserId = (userId: string) => {
    const member = allUsers.find(u => u.user.id === userId);
    return member?.subscription ? (member.subscription.plan?.type || member.subscription.planId) : 'basic-plan';
  };

  const filteredTickets = allTickets.filter(ticket => {
    if (ticketPriorityFilter !== 'all' && ticket.priority !== ticketPriorityFilter) return false;
    if (ticketStatusFilter !== 'all' && ticket.status !== ticketStatusFilter) return false;
    if (ticketPlanFilter !== 'all') {
      const plan = getPlanByUserId(ticket.user_id);
      if (plan !== ticketPlanFilter) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans select-none text-left antialiased">
      
      {/* 1. Left Sidebar Navigation Panel - Desktop */}
      <aside className="hidden md:flex w-64 bg-navy text-white flex flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen z-30">
        <div className="p-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
            <AppLogo size="sm" textColor="text-white" />
          </div>

          <nav className="mt-8 space-y-2.5">
            <button 
              onClick={() => { setActiveTab('metrics'); setAdminFocusTicket(null); setSelectedMember(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'metrics' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <Cpu className="w-4 h-4" />
              <span>Metrics</span>
            </button>

            <button 
              onClick={() => { setActiveTab('membership'); setAdminFocusTicket(null); setSelectedMember(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'membership' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>Members</span>
              <span className="ml-auto bg-slate-850 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{allUsers.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('tickets'); setAdminFocusTicket(null); setSelectedMember(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'tickets' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
              <span className="ml-auto bg-slate-850 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{allTickets.filter(t=>t.status !== 'resolved').length} open</span>
            </button>

            {!isAgent && (
              <>
                <button 
                  onClick={() => { setActiveTab('plan_creation'); setAdminFocusTicket(null); setSelectedMember(null); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'plan_creation' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Plans</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('cohort_operations'); setAdminFocusTicket(null); setSelectedMember(null); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'cohort_operations' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Cohorts</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('institutions'); setAdminFocusTicket(null); setSelectedMember(null); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'institutions' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <School className="w-4 h-4" />
                  <span>Hubs</span>
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-850">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || 'Admin'}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="truncate text-left">
              <span className="text-[11px] font-bold block truncate text-slate-200">{profile?.full_name}</span>
              <span className="text-[9px] text-blue-400 block font-semibold truncate capitalize">{user?.role} Privileges</span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full py-2 bg-rose-900/10 hover:bg-rose-900/20 text-rose-450 border border-rose-500/10 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[40] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Navigation Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-navy text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 z-[45] md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <AppLogo size="sm" textColor="text-white" />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-8 space-y-2.5">
            <button 
              onClick={() => { setActiveTab('metrics'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'metrics' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <Cpu className="w-4 h-4" />
              <span>Metrics</span>
            </button>

            <button 
              onClick={() => { setActiveTab('membership'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'membership' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>Members</span>
              <span className="ml-auto bg-slate-850 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{allUsers.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('tickets'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'tickets' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
              <span className="ml-auto bg-slate-850 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{allTickets.filter(t=>t.status !== 'resolved').length} open</span>
            </button>

            {!isAgent && (
              <>
                <button 
                  onClick={() => { setActiveTab('plan_creation'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'plan_creation' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Plans</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('cohort_operations'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'cohort_operations' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Cohorts</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('institutions'); setAdminFocusTicket(null); setSelectedMember(null); setMobileMenuOpen(false); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'institutions' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-blue-800/40 hover:text-white'}`}
                >
                  <School className="w-4 h-4" />
                  <span>Hubs</span>
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-850">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || 'Admin'}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="truncate text-left">
              <span className="text-[11px] font-bold block truncate text-slate-200">{profile?.full_name}</span>
              <span className="text-[9px] text-blue-400 block font-semibold truncate capitalize">{user?.role} Privileges</span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full py-2 bg-rose-900/10 hover:bg-rose-900/20 text-rose-450 border border-rose-500/10 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Administration workspace frame */}
      <main className="flex-grow flex flex-col justify-between overflow-y-auto h-screen w-full relative">
        <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-655 border border-slate-200 rounded-lg md:hidden cursor-pointer mr-2.5"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">ADMIN PRIVILEGES</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-navy font-bold uppercase tracking-wider capitalize">{activeTab.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={loadAdminData}
              disabled={isRefreshing}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-655 border border-slate-200/50 rounded-full flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 text-royal ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <span className="bg-slate-100 text-slate-800 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase border">
              System Live
            </span>
          </div>
        </header>

        {/* Dashboard contents */}
        <div className="p-4 sm:p-8 flex-grow">

          {/* TAB 1: METRICS OVERVIEW */}
          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-navy tracking-tight">Superuser metrics portal</h2>
                <p className="text-xs text-slate-400 font-semibold font-sans mt-0.5">Aggregated offline data summaries.</p>
              </div>

              {/* Bento analytics stats blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Subscribers Card */}
                <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:border-royal/30 hover:shadow-md hover:shadow-royal/5 transition-all duration-300 select-none group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-royal/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-350" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">ACTIVE SUBSCRIBERS</span>
                    <Users className="w-4 h-4 text-royal opacity-60" />
                  </div>
                  <div className="mt-4 relative z-10">
                    <span className="text-3xl font-bold text-navy tracking-tight block">{stats.activePlans} active</span>
                    <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">{stats.totalUsers} total registered accounts</span>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 select-none group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-350" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wide block">REVENUE STREAM</span>
                    <DollarSign className="w-4 h-4 text-emerald-600 opacity-60" />
                  </div>
                  <div className="mt-4 relative z-10">
                    <span className="text-3xl font-bold text-emerald-650 tracking-tight block">GH₵ {stats.totalRevenue}.00</span>
                    <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">Simulated Paystack checks</span>
                  </div>
                </div>

                {/* Devices Card */}
                <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 select-none group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-350" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">DEVICES ALLOCATED</span>
                    <Laptop className="w-4 h-4 text-royal opacity-60" />
                  </div>
                  <div className="mt-4 relative z-10">
                    <span className="text-3xl font-bold text-navy tracking-tight block">{stats.activeDevicesCount} total</span>
                    <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">Windows OS configuration sets</span>
                  </div>
                </div>

                {/* Active Triage Card */}
                <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:border-royal/30 hover:shadow-md hover:shadow-royal/5 transition-all duration-300 select-none group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-royal/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-350" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">ACTIVE TRIAGE QUEUES</span>
                    <Activity className="w-4 h-4 text-royal opacity-60" />
                  </div>
                  <div className="mt-4 relative z-10">
                    <span className="text-3xl font-bold text-royal tracking-tight block">{stats.openTickets} open</span>
                    <span className="text-[10px] text-slate-455 block mt-1.5 font-semibold">Awaiting Booth technicians dispatch</span>
                  </div>
                </div>

              </div>

              {/* Plans distribution overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xs font-bold text-[#00183D] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-royal" />
                    <span>Subscribers by University</span>
                  </h3>
                  <div className="space-y-3 text-xs font-sans">
                    {institutions.slice(0, 5).map(inst => {
                      const count = allUsers.filter(u => u.profile?.university === inst.name).length;
                      return (
                        <div key={inst.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-colors">
                          <span className="font-semibold text-slate-800">{inst.name}</span>
                          <span className="font-bold text-navy bg-white border border-slate-200 px-2 py-0.5 rounded-lg">{count} students</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xs font-bold text-[#00183D] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-royal" />
                    <span>Protection Plan distribution</span>
                  </h3>
                  <div className="space-y-3 text-xs font-sans">
                    {plans.map(plan => {
                      const count = allUsers.filter(u => u.subscription?.plan_id === plan.id).length;
                      return (
                        <div key={plan.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-colors">
                          <span className="font-semibold text-slate-800 uppercase tracking-wide">{plan.type || plan.name}</span>
                          <span className="font-bold text-navy bg-white border border-slate-200 px-2 py-0.5 rounded-lg">{count} active</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEMBERSHIP MANAGEMENT */}
          {activeTab === 'membership' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Subscriber Base Log</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage user subscriptions and verify student device enrollment.</p>
                </div>
                <span className="text-[10px] font-mono bg-royal/5 border border-royal/10 text-royal px-2.5 py-1 rounded-full font-bold">
                  {allUsers.length} total members
                </span>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-450 font-bold border-b border-slate-100">
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider">Subscriber Name</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider">Institution Hub</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider">Subscribed Plan</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider">Plan Cover Status</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider">Devices Count</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.map((m, idx) => {
                      const status = m.subscription?.status || 'unprotected';
                      const plan = m.subscription?.plan?.type || m.subscription?.plan?.name || m.subscription?.plan_id || 'unprotected';
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors duration-200">
                          <td className="p-4">
                            <span className="font-semibold text-[#00183D] text-[12.5px] block">{m.profile?.full_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {m.profile?.student_id}</span>
                          </td>
                          <td className="p-4 text-slate-655 font-medium">{m.profile?.university}</td>
                          <td className="p-4 uppercase font-bold text-slate-700 tracking-tight text-[11px] font-mono">{plan.replace('-', ' ')}</td>
                          <td className="p-4">
                            <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-600">{m.activeDeviceCount} device(s)</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedMember(m)}
                              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-royal font-bold text-[9px] uppercase cursor-pointer inline-flex items-center space-x-1 hover:border-royal/30 transition-all duration-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                            {m.subscription && (
                              <button
                                onClick={() => toggleSubStatus(m.subscription.id, status)}
                                className={`p-1.5 rounded-lg font-bold text-[9px] uppercase cursor-pointer border transition-all duration-200 ${
                                  status === 'active' 
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100 hover:border-emerald-300'
                                }`}
                              >
                                {status === 'active' ? 'Suspend' : status === 'suspended' ? 'Unsuspend' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SUPPORT TICKETS WORKSPACE */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              
              {/* Filter controls */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-3.5">
                  <span className="font-bold text-navy uppercase tracking-wider text-[10px]">Filter triage queue:</span>
                  
                  {/* Filter by Plan Tier */}
                  <select
                    value={ticketPlanFilter}
                    onChange={(e) => setTicketPlanFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Plan Tiers</option>
                    <option value="basic-plan">Basic Cover</option>
                    <option value="premium-plan">Premium Shield</option>
                    <option value="bonanza-plan">Bonanza Plan</option>
                  </select>

                  {/* Filter by Priority */}
                  <select
                    value={ticketPriorityFilter}
                    onChange={(e) => setTicketPriorityFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                    <option value="urgent">Urgent</option>
                  </select>

                  {/* Filter by status */}
                  <select
                    value={ticketStatusFilter}
                    onChange={(e) => setTicketStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open triage</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved Case</option>
                  </select>
                </div>

                <span className="font-mono text-slate-400 font-semibold">{filteredTickets.length} cases found</span>
              </div>

              {/* Split layout: Tickets list & Chat panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Tickets list */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">Active triage cases</h4>

                  <div className="space-y-2.5">
                    {filteredTickets.map(ticket => {
                      const isFocused = adminFocusTicket?.id === ticket.id;
                      const plan = getPlanByUserId(ticket.user_id);
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => setAdminFocusTicket(ticket)}
                          className={`p-3.5 border rounded-xl cursor-pointer text-left transition-all ${
                            isFocused 
                              ? 'border-royal bg-royal/5 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] text-slate-400">#{ticket.id}</span>
                            <span className="bg-royal/5 border border-royal/10 text-royal text-[8.5px] px-1.5 py-0.1 font-bold rounded uppercase">
                              {plan.replace('-', ' ')}
                            </span>
                          </div>
                          <h5 className="font-bold text-navy text-xs tracking-tight block truncate">{ticket.title}</h5>
                          <span className={`text-[8px] font-bold px-1.5 py-0.1 rounded uppercase tracking-wide inline-block mt-1 ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}

                    {filteredTickets.length === 0 && (
                      <p className="text-center py-6 text-slate-400">No triage cases found matching filter guidelines.</p>
                    )}
                  </div>
                </div>                {/* Ticket Details & Chat Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden min-h-[450px] flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                  {adminFocusTicket ? (
                    (() => {
                      const ticketUser = allUsers.find(u => u.user.id === adminFocusTicket.user_id);
                      const subscriberPhone = ticketUser?.profile?.phone || 'No phone registered';
                      const subscriberName = ticketUser?.profile?.full_name || 'Subscriber';
                      return (
                        <div className="flex flex-col h-full justify-between flex-grow">
                          
                          {/* Triage detail drawer headers */}
                          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-start gap-4">
                            <div className="space-y-0.5 text-left">
                              <span className="text-[9px] text-slate-400 font-mono block">Active Triage Case: #{adminFocusTicket.id}</span>
                              <h4 className="text-sm font-semibold text-[#00183D]">{adminFocusTicket.title}</h4>
                            </div>

                            {/* Status updating actions */}
                            <div className="flex flex-wrap gap-2">
                              {['open', 'in_progress', 'resolved', 'delivered'].map(stat => (
                                <button
                                  key={stat}
                                  onClick={() => handleAdminStatusChange(adminFocusTicket.id, stat as any)}
                                  disabled={isStatusUpdating === stat}
                                  className={`py-1 px-2.5 text-[9px] font-bold uppercase rounded-lg border transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                                    adminFocusTicket.status === stat 
                                      ? 'bg-navy text-white border-navy' 
                                      : 'bg-white hover:bg-slate-100 text-slate-655 border-slate-200'
                                  }`}
                                >
                                  {isStatusUpdating === stat ? (
                                    <span className="flex items-center space-x-1"><Loader2 className="w-3 h-3 animate-spin" /><span>updating</span></span>
                                  ) : (
                                    stat.replace('_', ' ')
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Request Information Details Dashboard */}
                          <div className="flex-grow p-6 space-y-6 text-xs text-left bg-slate-50/20">
                            
                            <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl space-y-4">
                              <h5 className="font-semibold text-[#00183D] text-[12px] border-b border-slate-100 pb-2 flex items-center space-x-2">
                                <Users className="w-4 h-4 text-royal" />
                                <span>Subscriber Contact Details</span>
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Filed By</span>
                                  <span className="font-bold text-navy text-[12.5px] block mt-0.5">{subscriberName}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Phone Number</span>
                                  <a href={`tel:${subscriberPhone}`} className="font-bold text-royal text-[12.5px] block mt-0.5 font-mono hover:underline">
                                    {subscriberPhone}
                                  </a>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Email Address</span>
                                  <span className="font-bold text-navy block mt-0.5 font-mono">{ticketUser?.user?.email || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">University Hub</span>
                                  <span className="font-bold text-navy block mt-0.5">{ticketUser?.profile?.university || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Student ID</span>
                                  <span className="font-bold text-navy block mt-0.5 font-mono">{ticketUser?.profile?.student_id || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Priority Level</span>
                                  <span className="font-bold text-navy block mt-0.5 uppercase font-mono">{adminFocusTicket.priority}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9.5px]">Current Status</span>
                                  <span className={`text-[9.5px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase border inline-block mt-0.5 ${getStatusColor(adminFocusTicket.status)}`}>
                                    {adminFocusTicket.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Device Details Block */}
                            {(() => {
                              const device = allDevices.find(d => d.id === adminFocusTicket.device_id);
                              return device ? (
                                <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl space-y-4">
                                  <h5 className="font-semibold text-[#00183D] text-[12px] border-b border-slate-100 pb-2 flex items-center space-x-2">
                                    <Laptop className="w-4 h-4 text-royal" />
                                    <span>Associated Device Details</span>
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-slate-400 block text-[9.5px]">Device Name</span>
                                      <span className="font-bold text-navy block mt-0.5">{device.name}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9.5px]">Brand & Model</span>
                                      <span className="font-bold text-navy block mt-0.5">{device.brand} {device.model}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9.5px]">Serial Number</span>
                                      <span className="font-bold text-navy block mt-0.5 font-mono">{device.serial_number || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9.5px]">Operating System</span>
                                      <span className="font-bold text-navy block mt-0.5">{device.operating_system || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl text-slate-400 italic">
                                  No registered device details associated with this request.
                                </div>
                              );
                            })()}

                            <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl space-y-3">
                              <h5 className="font-semibold text-[#00183D] text-[12px] border-b border-slate-100 pb-2 flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-royal" />
                                <span>Issue Description</span>
                              </h5>
                              <p className="text-slate-655 font-medium leading-relaxed whitespace-pre-line">{adminFocusTicket.description}</p>
                            </div>

                            {/* website_details layout display commented out */}
                            {/* {adminFocusTicket.website_details && (
                              <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl space-y-3">
                                <h5 className="font-semibold text-[#00183D] text-[12px] border-b border-slate-100 pb-2 flex items-center space-x-2">
                                  <Laptop className="w-4 h-4 text-royal" />
                                  <span>Website Setup Specifications</span>
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 font-medium">
                                  <p><span className="text-slate-450 font-bold block text-[9.5px]">Business Name:</span> {adminFocusTicket.website_details.business_name}</p>
                                  <p><span className="text-slate-450 font-bold block text-[9.5px]">Requested Subdomain:</span> {adminFocusTicket.website_details.subdomain}</p>
                                  <p><span className="text-slate-450 font-bold block text-[9.5px]">Pages Count:</span> {adminFocusTicket.website_details.pages_count} pages</p>
                                  <p><span className="text-slate-450 font-bold block text-[9.5px]">Hosting Support:</span> {adminFocusTicket.website_details.hosting_required ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                            )} */}

                            <div className="p-4 bg-royal/5 border border-royal/10 text-royal rounded-2xl font-medium leading-relaxed text-[11px] flex items-start space-x-2">
                              <span className="text-base mt-0.5">📞</span>
                              <p>
                                <strong>Technician Coordination:</strong> Call the subscriber directly at <a href={`tel:${subscriberPhone}`} className="font-mono font-bold underline hover:text-royal/80">{subscriberPhone}</a> to arrange device drop-off at your campus support hub or coordinate repair details. Update the status above to reflect changes.
                              </p>
                            </div>
                          </div>

                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-20 text-slate-450 font-mono flex flex-col items-center justify-center space-y-3.5 my-auto">
                      <MessageCircle className="w-8 h-8 opacity-40 text-slate-400" />
                      <p>Select triage case to open subscriber dispatch notes.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
          {/* TAB 4: PLAN CREATION & MANAGEMENT */}
          {activeTab === 'plan_creation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form: Plan Design Builder */}
              <div className="lg:col-span-5 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 text-left">
                <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 bg-royal/10 text-royal rounded-xl flex items-center justify-center mx-auto border border-royal/20">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00183D] uppercase tracking-tight">
                    {editingPlanId ? 'Update Protection Plan' : 'Plan Design Builder'}
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    {editingPlanId ? 'Modify existing cover specifications and pricing.' : 'Create dynamic protection structures that write to memory records.'}
                  </p>
                </div>

                {newPlanError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[10.5px] rounded-xl flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{newPlanError}</span>
                  </div>
                )}

                <form onSubmit={handlePlanCreationSubmit} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Plan Type *</label>
                      <select
                        required
                        disabled={!!editingPlanId}
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none disabled:opacity-50"
                      >
                        <option value="">Select Plan Type</option>
                        <option value="BASIC">Basic</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="BONANZA">Bonanza</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Semester Fee (GH₵) *</label>
                      <input
                        type="number"
                        required
                        value={newPlanFee}
                        onChange={(e) => setNewPlanFee(Number(e.target.value))}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Device limit Allocation *</label>
                      <input
                        type="number"
                        required
                        value={newPlanDevices}
                        onChange={(e) => setNewPlanDevices(Number(e.target.value))}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Cover Summary description *</label>
                    <input
                      type="text"
                      required
                      value={newPlanDesc}
                      onChange={(e) => setNewPlanDesc(e.target.value)}
                      placeholder="Describe plan protections summary in a short phrase..."
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Plan Benefits (One per line) *</label>
                    <textarea
                      rows={4}
                      required
                      value={newPlanBenefits}
                      onChange={(e) => setNewPlanBenefits(e.target.value)}
                      placeholder="Free system updates&#10;Free diagnosis&#10;Labor free coordination"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white resize-none font-mono"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isPlanSubmitting}
                      className="flex-grow py-3.5 bg-royal hover:bg-royal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-royal/10 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 text-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPlanSubmitting ? '⏳ Processing...' : (editingPlanId ? '⚡ Update Plan Specs' : '⚡ Assemble Cover Option')}
                    </button>
                    {editingPlanId && (
                      <button
                        type="button"
                        onClick={handleCancelEditPlan}
                        className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 text-center border-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right List: Existing Protection Plans */}
              <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 text-left hover:shadow-md transition-shadow duration-300">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wider">Active Semester Plans</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Existing coverage tiers available for student subscription.</p>
                </div>

                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 hover:border-royal/30 transition-all duration-200 relative group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-[#00183D] block">{plan.type || plan.name}</span>
                            <span className={`text-[8px] uppercase font-bold font-mono px-2 py-0.5 rounded-full ${
                              plan.status === 'inactive' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {plan.status || 'active'}
                            </span>
                          </div>
                          <span className="text-[9.5px] uppercase font-mono font-semibold px-2.5 py-0.5 bg-royal/5 border border-royal/10 text-royal rounded-full">
                            GH₵ {plan.fee || plan.price}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-550 leading-relaxed font-medium">{plan.summary || plan.description}</p>
                        <div className="space-y-1.5 pt-2 border-t border-slate-100/50">
                          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-405 font-mono block">Plan features:</span>
                          <ul className="space-y-1 text-[10.5px] text-slate-600 font-medium">
                            {(plan.benefits || plan.features || []).map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-royal rounded-full shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-100/50 mt-4">
                        <span className="text-[10px] text-slate-405 font-mono">Max Devices: <strong>{(plan as any).maxDevices || plan.max_devices || 1}</strong></span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePlanStatus(plan.id, plan.status)}
                            className={`py-1.5 px-3 rounded-xl text-[10.5px] font-bold border transition-colors cursor-pointer ${
                              plan.status === 'inactive' 
                                ? 'bg-emerald-55 text-emerald-700 border-emerald-200 hover:bg-emerald-100 border-0' 
                                : 'bg-rose-55 text-rose-700 border-rose-200 hover:bg-rose-100 border-0'
                            }`}
                          >
                            {plan.status === 'inactive' ? 'Activate Plan' : 'Suspend Plan'}
                          </button>
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="py-1.5 px-3.5 bg-white border border-slate-205 rounded-xl text-[10.5px] font-bold text-royal hover:bg-royal hover:text-white hover:border-royal transition-all duration-200 cursor-pointer shadow-sm shadow-royal/5"
                          >
                            Edit Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: COHORT OPERATIONS */}
          {activeTab === 'cohort_operations' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 text-left hover:shadow-md transition-shadow duration-300">
              <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Institution Cohort Operations</h3>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto font-medium">Deactivate and suspend students from a selected university cohort as the semester ends.</p>
              </div>

              {cohortMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold leading-relaxed flex items-center space-x-2">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{cohortMsg}</span>
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2 font-medium">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">Administrative Precautionary Alert</span>
                </div>
                <p className="leading-relaxed">This bulk operation changes the plan status of every subscriber registered under the selected school cohort to "suspended" in a single click. This action simulates the end of semesters and prompts users to renew coverages.</p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Select University cohort</label>
                  <select
                    value={targetUniCohort}
                    onChange={(e) => setTargetUniCohort(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none"
                  >
                    <option value="" disabled>Select a University Cohort</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.name}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={executeCohortDeactivate}
                    disabled={cohortSubmittingType !== null}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer text-center shadow-md shadow-rose-650/10 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {cohortSubmittingType === 'suspend' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></> : '⚡ Bulk Suspend Cohort'}
                  </button>
                  <button
                    onClick={executeCohortExpire}
                    disabled={cohortSubmittingType !== null}
                    className="w-full py-3.5 bg-navy hover:bg-navy/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer text-center shadow-md shadow-navy/10 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {cohortSubmittingType === 'expire' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></> : '⚠️ Bulk Expire Cohort'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INSTITUTIONS MANAGEMENT */}
          {activeTab === 'institutions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
              
              {/* Institution Form Builder */}
              <div className="lg:col-span-5 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6">
                <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 bg-royal/10 text-royal rounded-xl flex items-center justify-center mx-auto border border-royal/20">
                    <School className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00183D] uppercase tracking-tight">
                    {editingInstId ? 'Update Institution' : 'Add Institution'}
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Configure institutional parameters and active campus coverage locations.
                  </p>
                </div>

                <form onSubmit={handleSaveInstitution} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Full Institution Name *</label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      placeholder="e.g. University of Ghana (Legon)"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Short Abbreviation *</label>
                      <input
                        type="text"
                        required
                        value={instShort}
                        onChange={(e) => setInstShort(e.target.value)}
                        placeholder="e.g. UG"
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Campus Location *</label>
                      <input
                        type="text"
                        required
                        value={instLocation}
                        onChange={(e) => setInstLocation(e.target.value)}
                        placeholder="e.g. Accra"
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    {editingInstId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingInstId(null);
                          setInstName('');
                          setInstShort('');
                          setInstLocation('');
                        }}
                        className="w-1/3 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isInstSubmitting}
                      className="flex-grow py-3 bg-royal hover:bg-royal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-royal/10 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isInstSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></>
                      ) : (
                        editingInstId ? '💾 Save Updates' : '➕ Register Institution'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Institutions Directory List Table */}
              <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider font-mono">
                    Institutions Directory
                  </h4>
                  <span className="font-mono text-slate-400 font-semibold">{institutions.length} Registered</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[11px] font-sans">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9.5px]">
                        <th className="py-2.5 px-3 text-left">Abbr</th>
                        <th className="py-2.5 px-3 text-left">Name</th>
                        <th className="py-2.5 px-3 text-left">Location</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {institutions.map(inst => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-royal">{inst.short_name}</td>
                          <td className="py-3 px-3 text-navy font-bold">{inst.name}</td>
                          <td className="py-3 px-3 text-slate-550 font-medium">{inst.location}</td>
                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(inst)}
                              className="px-2.5 py-1 text-[9px] font-bold text-royal bg-royal/5 border border-royal/10 rounded-lg hover:bg-royal hover:text-white transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteInstitution(inst.id)}
                              className="px-2.5 py-1 text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                      {institutions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-slate-400 font-mono">
                            No registered campus hubs on the platform.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        <footer className="py-6 border-t border-slate-200 bg-white text-center text-[10px] text-slate-400 font-semibold font-sans tracking-wide">
          StudentShield Headquarters Admin • Confidential Privileged Workspace.
        </footer>
      </main>

      {/* MODAL / DRAWER DETAIL VIEW: SUBSCRIBER INSPECT DRAWER */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-end p-0 text-xs"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white border-l border-slate-250 w-full max-w-md h-screen shadow-2xl flex flex-col justify-between"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">SUBSCRIBER CARD DETAILS</span>
                  <span className="text-sm font-semibold text-navy block truncate">{selectedMember.profile?.full_name}</span>
                </div>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-grow p-6 overflow-y-auto space-y-6 text-left">
                
                {/* School Profile Specs */}
                <div className="space-y-3.5 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl">
                  <h4 className="text-[9.5px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Academic parameters</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Student ID</span>
                      <span className="font-bold text-navy font-mono block mt-0.5">{selectedMember.profile?.student_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Mobile contact</span>
                      <span className="font-bold text-navy block mt-0.5">{selectedMember.profile?.phone || 'Not available'}</span>
                    </div>
                  </div>

                  <div className="text-[10.5px]">
                    <span className="text-slate-400 block text-[9.5px]">University Hub</span>
                    <span className="font-bold text-navy block mt-0.5">{selectedMember.profile?.university}</span>
                  </div>

                  <div className="text-[10.5px]">
                    <span className="text-slate-400 block text-[9.5px]">Cover Plan</span>
                    <span className="font-bold text-royal uppercase block mt-0.5 tracking-tight font-mono">
                      {(selectedMember.subscription?.plan?.type || selectedMember.subscription?.plan?.name || selectedMember.subscription?.plan_id || 'None').replace('_', ' ').replace('-', ' ')} 
                      <span className="lowercase font-normal text-slate-400 font-sans ml-1">({selectedMember.subscription?.status})</span>
                    </span>
                  </div>

                  {selectedMember.subscription && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleSubStatus(selectedMember.subscription.id, selectedMember.subscription.status)}
                        className={`w-full py-2.5 rounded-xl font-bold text-[10px] uppercase cursor-pointer border transition-all duration-200 text-center ${
                          selectedMember.subscription.status === 'active' 
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                        }`}
                      >
                        {selectedMember.subscription.status === 'active' ? '⚠️ Suspend Plan' : selectedMember.subscription.status === 'suspended' ? '⚡ Unsuspend Plan' : '⚡ Activate Plan'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Devices lists */}
                <div className="space-y-3">
                  <h4 className="text-[9.5px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Registered Devices list</h4>
                  
                  <div className="space-y-2">
                    {selectedMemberDevices.map(dev => (
                      <div key={dev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center shrink-0">
                          <Laptop className="w-4.5 h-4.5 text-slate-655" />
                        </div>
                        <div className="truncate flex-grow text-left">
                          <span className="font-bold text-navy text-[11px] block truncate">{dev.name}</span>
                          <span className="text-[9.5px] text-slate-400 block font-mono">ID: {dev.id} | OS: {dev.operating_system}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Serial: {dev.serialNumber}</span>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {dev.status}
                        </span>
                      </div>
                    ))}
                    {selectedMemberDevices.length === 0 && (
                      <p className="text-slate-400 text-center font-mono py-2">No registered academic devices.</p>
                    )}
                  </div>
                </div>

                {/* Tickets list */}
                <div className="space-y-3">
                  <h4 className="text-[9.5px] uppercase font-semibold tracking-wider text-slate-400 font-mono font-mono">Service diagnostic requests</h4>
                  
                  <div className="space-y-2">
                    {selectedMemberTickets.map(tix => (
                      <div 
                        key={tix.id}
                        onClick={() => {
                          setAdminFocusTicket(tix);
                          setActiveTab('tickets');
                          setSelectedMember(null);
                        }}
                        className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-royal/30 rounded-xl flex justify-between items-center cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-mono text-[9px] text-slate-400">REQ #{tix.id}</span>
                          <h5 className="font-bold text-navy text-[11px] block mt-0.5 truncate max-w-[180px]">{tix.title}</h5>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(tix.status)}`}>
                          {tix.status}
                        </span>
                      </div>
                    ))}
                    {selectedMemberTickets.length === 0 && (
                      <p className="text-slate-400 text-center font-mono py-2">No requests filed.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer footer close button */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full py-2.5 bg-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer text-center"
                >
                  Close Inspect View
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
