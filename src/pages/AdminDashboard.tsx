/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/db';
import { 
  Shield, Cpu, FileText, CheckCircle, 
  MessageCircle, RefreshCw, Send, ArrowLeft,
  TrendingUp, Users, DollarSign, Activity, Eye, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, SupportTicket, Message, Profile, User, Payment, ActivityLog } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, profile, logout, refreshData } = useApp();
  const isAgent = user?.role === 'support_agent';
  const [adminTab, setAdminTab] = useState<string>(user?.role === 'support_agent' ? 'tickets' : 'metrics');

  // Stats Counters
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    openTickets: 0,
    totalRevenue: 0,
    activeDevicesCount: 0,
    monthlySubRate: 0
  });

  // DB Registries
  const [allUsers, setAllUsers] = useState<{ user: User; profile: Profile; subscription?: any; activeDeviceCount: number }[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [allPayments, setAllPayments] = useState<{ payment: Payment; profile: Profile }[]>([]);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);

  // Triage Ticket Active Focus
  const [adminFocusTicket, setAdminFocusTicket] = useState<SupportTicket | null>(null);
  const [adminFocusedMessages, setAdminFocusedMessages] = useState<{ message: Message; senderName: string; senderAvatar?: string }[]>([]);
  const [adminReplyVal, setAdminReplyVal] = useState('');

  const loadAdminData = () => {
    setStats(dbService.getAdminStats());
    setAllUsers(dbService.getAdminAllProfiles());
    setAllTickets(dbService.getTickets()); 
    setAllDevices(dbService.getDevices());
    setAllPayments(dbService.getAdminAllPayments());
    setAuditLogs(dbService.getActivityLogs());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (adminFocusTicket) {
      setAdminFocusedMessages(dbService.getTicketMessages(adminFocusTicket.id));
    }
  }, [adminFocusTicket]);

  const handleAdminStatusChange = (ticketId: string, status: SupportTicket['status']) => {
    dbService.updateTicketStatus(ticketId, status);
    loadAdminData();
    if (adminFocusTicket && adminFocusTicket.id === ticketId) {
      setAdminFocusTicket({ ...adminFocusTicket, status });
    }
  };

  const handleAdminDeviceStatusChange = (deviceId: string, status: Device['status']) => {
    dbService.updateDeviceStatus(deviceId, status);
    loadAdminData();
  };

  const handleAdminReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminFocusTicket && adminReplyVal.trim()) {
      dbService.sendTicketMessage(adminFocusTicket.id, adminReplyVal);
      setAdminReplyVal('');
      setAdminFocusedMessages(dbService.getTicketMessages(adminFocusTicket.id));
      loadAdminData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'under_repair': return 'bg-amber-50 text-amber-600 border-amber-105';
      case 'diagnosing': return 'bg-blue-50 text-royal border-blue-105';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'unprotected': return 'bg-red-50 text-red-650 border-red-105';
      case 'open': return 'bg-sky-50 text-sky-600 border-sky-105';
      case 'waiting_on_user': return 'bg-purple-50 text-purple-650 border-purple-105';
      default: return 'bg-slate-50 text-slate-500 border-slate-150';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-left font-sans select-none flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-24 shadow-none">
        
        {/* Admin Header with clear styling */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6 mb-8 shadow-none">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold font-mono">
                {isAgent ? 'SUPPORT COLLABORATION DESK' : 'ROOT CONTROL DESK'}
              </span>
              <span className="bg-amber-50 text-amber-700 text-[9px] px-2 py-0.5 rounded-none font-bold uppercase border border-amber-200/80 flex items-center space-x-1 font-mono">
                <span className={`w-1.5 h-1.5 rounded-none ${isAgent ? 'bg-royal' : 'bg-amber-500'}`} />
                <span>{isAgent ? 'COLLABORATIVE AGENT' : 'ROOT ADMINISTRATIVE SECURE'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00183D] tracking-tight mt-1.5">
              {isAgent ? 'Agent Helpdesk Triage' : 'Superuser Command Center'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium font-sans">
              {isAgent ? 'Staff Support Agent' : 'Root User'}: {profile?.full_name} ({user?.email})
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadAdminData}
              className="py-2.5 px-4 text-xs font-bold bg-white text-navy border border-slate-200 rounded-none hover:bg-slate-50 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-none font-sans"
            >
              <RefreshCw className="w-4 h-4 text-royal" />
              <span>Refresh Command Registry</span>
            </button>
            <button
              onClick={logout}
              className="py-2.5 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-none transition-colors cursor-pointer shadow-none font-sans"
            >
              Logout privileges
            </button>
          </div>
        </div>

        {/* Support dialogue focus overlay for Admin (Reply interface) Card */}
        <AnimatePresence>
          {adminFocusTicket && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mb-8 border border-slate-200 rounded-none bg-white overflow-hidden shadow-none p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4 font-sans">
                <div className="flex items-center space-x-3 text-left font-sans">
                  <button onClick={() => setAdminFocusTicket(null)} className="p-2 rounded-none bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer border border-slate-200">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">TRIAGE CASE ASSIGNED (#{adminFocusTicket.id})</span>
                    <h3 className="text-sm font-bold text-navy line-clamp-1">{adminFocusTicket.title}</h3>
                  </div>
                </div>

                {/* ROOT PRIVILEGE STATUS CONTROL BADGES */}
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => handleAdminStatusChange(adminFocusTicket.id, 'in_progress')}
                    className="py-1 px-2.5 bg-yellow-50 text-[#f58c00] hover:bg-yellow-100 border border-yellow-200 rounded-none text-[9px] uppercase font-bold tracking-wider font-mono cursor-pointer"
                  >
                    Stg. In_Progress
                  </button>
                  <button 
                    onClick={() => handleAdminStatusChange(adminFocusTicket.id, 'waiting_on_user')}
                    className="py-1 px-2.5 bg-[#F3E8FF] text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-none text-[9px] uppercase font-bold tracking-wider font-mono cursor-pointer"
                  >
                    Stg. Waiting_User
                  </button>
                  <button 
                    onClick={() => handleAdminStatusChange(adminFocusTicket.id, 'resolved')}
                    className="py-1 px-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-none text-[9px] uppercase font-bold tracking-wider font-mono cursor-pointer"
                  >
                    Stg. Resolved
                  </button>
                </div>
              </div>

              {/* Chat room messages detail view */}
              <div className="h-56 overflow-y-auto space-y-3.5 p-3.5 border border-slate-100 rounded-none bg-slate-50/40 mb-4 text-xs font-sans">
                {adminFocusedMessages.map((msg, idx) => {
                  const isStaff = msg.message.sender_role === 'admin' || msg.message.sender_role === 'support_agent';
                  return (
                    <div key={idx} className={`flex items-start space-x-2.5 max-w-[85%] ${isStaff ? 'ml-auto text-right flex-row-reverse space-x-reverse' : 'mr-auto text-left'}`}>
                      <div className="w-6 h-6 rounded-none overflow-hidden border border-slate-200/50 flex-shrink-0">
                        <img 
                          src={isStaff ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' : 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(msg.senderName)} 
                          alt="Avatar" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className={`p-3 rounded-none ${isStaff ? 'bg-royal text-white' : 'bg-white border border-slate-150 text-slate-700'}`}>
                        <span className="text-[9px] font-bold block mb-1 opacity-75 uppercase tracking-wide">{msg.senderName} ({msg.message.sender_role === 'support_agent' ? 'Support Agent' : msg.message.sender_role})</span>
                        <p className="whitespace-pre-line leading-relaxed text-[11px]">{msg.message.content}</p>
                        <span className="text-[8px] block mt-1 opacity-50">{new Date(msg.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleAdminReplySubmit} className="flex gap-2 font-sans">
                <input
                  type="text"
                  required
                  placeholder="Type official support dispatch reply..."
                  value={adminReplyVal}
                  onChange={(e) => setAdminReplyVal(e.target.value)}
                  className="w-full text-xs border border-slate-200 bg-slate-50 rounded-none px-4 py-3 focus:outline-none focus:border-royal focus:bg-white transition-all text-slate-800 font-sans"
                />
                <button type="submit" className="px-5 bg-[#00183D] hover:bg-navy/95 text-white rounded-none transition-colors flex items-center justify-center cursor-pointer">
                  <Send className="w-4 h-4 font-bold" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMMAND TAB NAVIGATION (No shadows, thin outlines) */}
        <div className="bg-white border border-slate-200 rounded-none p-4.5 mb-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider select-none shadow-none font-sans">
          {[
            { id: 'metrics', label: 'Overview Metrics', icon: TrendingUp },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'devices', label: 'Notebook Diagnostics', icon: Cpu },
            { id: 'tickets', label: 'Triage Tickets', icon: FileText },
            ...(!isAgent ? [
              { id: 'payments', label: 'MoMo Receipts', icon: DollarSign },
              { id: 'logs', label: 'Activity Logs', icon: Activity }
            ] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`py-2 px-4.5 rounded-none flex items-center space-x-1.5 transition-all border cursor-pointer font-sans text-xs ${
                  isSelected 
                    ? 'bg-[#00183D] border-[#00183D] text-white' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE AREA (No shadows, thin outlines) */}
        
        {/* TAB 1: OVERVIEW METRICS */}
        {adminTab === 'metrics' && (
          <div className="space-y-6">
            
            {/* Visual SaaS bento metrics blocks */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAgent ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 text-left shadow-none`}>
              
              <div className="bg-white border border-slate-200 rounded-none p-5 flex items-center space-x-4 shadow-none hover:border-royal/10 transition-colors">
                <div className="w-10 h-10 rounded-none bg-slate-50 text-royal flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#00193D] block">{stats.totalUsers}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Aggregate Users</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-none p-5 flex items-center space-x-4 shadow-none hover:border-royal/10 transition-colors">
                <div className="w-10 h-10 rounded-none bg-slate-50 text-[#FFC500] flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#00193D] block">{stats.activePlans}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Shield Active Tiers</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-none p-5 flex items-center space-x-4 shadow-none hover:border-royal/10 transition-colors">
                <div className="w-10 h-10 rounded-none bg-slate-55 text-red-500 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-navy block">{stats.openTickets}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Active Triage Case Queue</span>
                </div>
              </div>

              {!isAgent && (
                <div className="bg-white border border-slate-200 rounded-none p-5 flex items-center space-x-4 shadow-none hover:border-royal/10 transition-colors">
                  <div className="w-10 h-10 rounded-none bg-slate-50 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-navy block">GHS {stats.totalRevenue}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Gross Income</span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Diagnostic checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left shadow-none font-sans">
              
              <div className="bg-white border border-slate-200 rounded-none p-5 space-y-4 shadow-none">
                <h3 className="text-xs font-bold text-[#00183D] uppercase tracking-wider font-sans">Triage Tickets checklist</h3>
                <div className="space-y-3.5 text-xs font-sans">
                  {allTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => setAdminFocusTicket(ticket)}
                      className="p-3 bg-slate-50/50 border border-slate-150 rounded-none flex justify-between items-center cursor-pointer hover:bg-slate-100/50 hover:border-royal/20 transition-all font-sans"
                    >
                      <div>
                        <span className="text-[9px] font-mono font-semibold text-slate-400 block pb-0.5">TKT #{ticket.id}</span>
                        <h4 className="font-bold text-[#00183D] text-xs leading-tight line-clamp-1">{ticket.title}</h4>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-none border flex-shrink-0 font-mono ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  {allTickets.length === 0 && (
                    <p className="text-slate-400 text-xs py-4 text-center font-mono">No open triage tickets.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-none p-5 space-y-4 shadow-none">
                <h3 className="text-xs font-bold text-[#00183D] uppercase tracking-wider font-sans">Device commands logs</h3>
                <div className="space-y-3 text-xs font-sans">
                  {allDevices.map(dev => (
                    <div key={dev.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-none flex justify-between items-center">
                      <div className="text-left flex items-center space-x-2.5">
                        <Cpu className="w-5 h-5 text-royal" />
                        <div>
                          <span className="font-bold text-[#00183D] text-xs block leading-tight">{dev.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5">SN: {dev.serial_number}</span>
                        </div>
                      </div>
                      <select
                        value={dev.status}
                        onChange={(e) => handleAdminDeviceStatusChange(dev.id, e.target.value as any)}
                        className="text-[9px] border bg-white border-slate-200 rounded-none font-bold px-2 py-1 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="diagnosing">Diagnosing</option>
                        <option value="under_repair">Under Repair</option>
                        <option value="resolved">Resolved</option>
                        <option value="unprotected">Unprotected</option>
                      </select>
                    </div>
                  ))}
                  {allDevices.length === 0 && (
                    <p className="text-slate-400 text-xs py-4 text-center font-mono">No logged active devices.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {adminTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-none p-5 text-left shadow-none font-sans">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4 font-sans">Systems User Logs</h3>
            <div className="overflow-x-auto text-xs font-sans">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                    <th className="p-3 font-medium">Student Name</th>
                    <th className="p-3 font-medium font-mono text-[10px]">Institution Mail</th>
                    <th className="p-3 font-medium">StudentID / Mobile</th>
                    <th className="p-3 font-medium">Subscription status</th>
                    <th className="p-3 text-right font-medium">Devices Linked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-navy">{item.profile.full_name}</td>
                      <td className="p-3 font-mono text-slate-500">{item.user.email}</td>
                      <td className="p-3">
                        <span className="block font-medium">{item.profile.student_id}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">{item.profile.phone}</span>
                      </td>
                      <td className="p-3">
                        {item.subscription ? (
                          <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] border border-emerald-150 px-2 py-0.5 rounded-none font-bold uppercase">
                            {item.subscription.plan_id.replace('-', ' ')}
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-650 font-mono text-[9px] border border-red-150 px-2 py-0.5 rounded-none font-bold uppercase">
                            NO PLAN ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-600 font-mono">{item.activeDeviceCount} unit(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NOTEBOOK DIAGNOSTICS */}
        {adminTab === 'devices' && (
          <div className="bg-white border border-slate-200 rounded-none p-5 text-left shadow-none">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4 font-sans">Device Command Catalog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {allDevices.map(dev => (
                <div key={dev.id} className="border border-slate-200 p-4 rounded-none flex flex-col justify-between hover:border-royal/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-navy text-[13px]">{dev.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Brand: {dev.brand} {dev.model} • OS: {dev.operating_system}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none border uppercase ${getStatusColor(dev.status)}`}>
                      {dev.status}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center bg-slate-50/80 p-2.5 rounded-none border border-slate-150/80">
                    <span className="font-mono text-[9px] text-slate-400">SN: {dev.serial_number}</span>
                    <select
                      value={dev.status}
                      onChange={(e) => handleAdminDeviceStatusChange(dev.id, e.target.value as any)}
                      className="text-[9px] border bg-white border-slate-200 rounded-none font-bold px-2 py-1 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="diagnosing">Diagnosing</option>
                      <option value="under_repair">Under Repair</option>
                      <option value="resolved">Resolved</option>
                      <option value="unprotected">Unprotected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Support ticket queues list */}
        {adminTab === 'tickets' && (
          <div className="bg-white border border-slate-200 rounded-none p-5 text-left shadow-none">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4 font-sans">Active Support Triage Queues</h3>
            <div className="space-y-3.5 text-xs font-sans">
              {allTickets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setAdminFocusTicket(t)}
                  className="p-4 bg-slate-50 border border-slate-150 rounded-none flex justify-between items-center cursor-pointer hover:bg-slate-100/30 hover:border-royal/20 transition-all"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-slate-400">#{t.id}</span>
                    <h4 className="font-bold text-navy text-xs leading-none">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium line-clamp-1">{t.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3.5 border-l border-slate-200 pl-4">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none uppercase border flex-shrink-0 ${getStatusColor(t.status)}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MOMO RECEIPTS */}
        {adminTab === 'payments' && (
          <div className="bg-white border border-slate-200 rounded-none p-5 text-left shadow-none">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4 font-sans">Telecom MoMo Transaction Log</h3>
            <div className="overflow-x-auto text-xs font-sans">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-150">
                    <th className="p-3">Reference ID</th>
                    <th className="p-3">User Student</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Amount Charged</th>
                    <th className="p-3 text-right">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPayments.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-royal">{item.payment.transaction_ref}</td>
                      <td className="p-3">
                        <span className="block font-bold text-navy">{item.profile.full_name}</span>
                        <span className="block text-[10px] text-slate-400 font-sans">{item.profile.university}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-600">{item.payment.payment_method}</td>
                      <td className="p-3 font-bold text-emerald-600">GHS {item.payment.amount}.00</td>
                      <td className="p-3 text-right text-[10px] text-slate-400 font-mono">{new Date(item.payment.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY SYSTEM LOGS */}
        {adminTab === 'logs' && (
          <div className="bg-white border border-slate-200 rounded-none p-5 text-left font-mono text-[10px] shadow-none">
            <h3 className="text-xs font-bold text-navy uppercase tracking-widest font-sans mb-4">System Access audits log</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-900 text-slate-300 rounded-none border border-white/5 flex flex-col sm:flex-row justify-between gap-1.5 font-mono">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="text-royal font-bold">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                    <span className="text-yellow-400 uppercase font-bold">{log.action}:</span>
                    <span>{log.details}</span>
                  </div>
                  <span className="text-slate-500 text-[9px]">IP: {log.ip_address}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
