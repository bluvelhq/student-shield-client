/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/db';
import { 
  Shield, Cpu, FileText, CheckCircle, 
  PlusCircle, MessageCircle, Send, ArrowLeft, 
  X, Laptop, ArrowRight, Search, Bell, ChevronDown, User, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, SupportTicket, Message } from '../types';

export const StudentDashboard: React.FC = () => {
  const { 
    user, profile, devices, tickets, subscription, 
    refreshData, logout, updateProfile, notifications 
  } = useApp();

  // Dialog & Modal Control states 
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Profile navigation dropdown & search & notification overlay triggers
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  // Profile coordinates editor state binds
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editUni, setEditUni] = useState(profile?.university || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync edit form with latest profile database changes
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditPhone(profile.phone || '');
      setEditUni(profile.university || '');
    }
  }, [profile]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateProfile(editName, editPhone, editUni);
    if (success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
      refreshData();
    }
  };

  // Live filter lists based on the search circular input field
  const filteredTickets = tickets.filter(t => {
    if (!searchValue.trim()) return true;
    const q = searchValue.toLowerCase();
    return (t.title || '').toLowerCase().includes(q) || 
           (t.description || '').toLowerCase().includes(q) || 
           (t.id || '').toLowerCase().includes(q);
  });

  const filteredDevices = devices.filter(dev => {
    if (!searchValue.trim()) return true;
    const q = searchValue.toLowerCase();
    const name = dev.name || '';
    const brand = dev.brand || '';
    const model = dev.model || '';
    const sn = dev.serial_number || dev.serialNumber || '';
    return name.toLowerCase().includes(q) || 
           brand.toLowerCase().includes(q) || 
           model.toLowerCase().includes(q) || 
           sn.toLowerCase().includes(q);
  });
  
  // New Device creation fields
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceBrand, setNewDeviceBrand] = useState('Asus');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceOS, setNewDeviceOS] = useState('Windows 11 Education');
  const [newDeviceSN, setNewDeviceSN] = useState('');

  // New Support Ticket creation fields
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [newTicketCat, setNewTicketCat] = useState<SupportTicket['category']>('software');
  const [newTicketPriority, setNewTicketPriority] = useState<SupportTicket['priority']>('medium');

  // Interactive ticket chat focus overlay states
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatMessages, setChatMessages] = useState<{ message: Message; senderName: string; senderAvatar?: string }[]>([]);
  const [newMsgContent, setNewMsgContent] = useState('');

  // Device registration onboarding helper states
  const [welcomeBrand, setWelcomeBrand] = useState('Asus');
  const [welcomeModel, setWelcomeModel] = useState('');
  const [welcomeSerial, setWelcomeSerial] = useState('');
  const [welcomeYear, setWelcomeYear] = useState('2025');
  const [welcomeUploading, setWelcomeUploading] = useState(false);

  useEffect(() => {
    if (selectedTicket) {
      setChatMessages(dbService.getTicketMessages(selectedTicket.id));
    }
  }, [selectedTicket]);

  const handleWelcomeDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (welcomeModel && welcomeSerial) {
      setWelcomeUploading(true);
      // Brief aesthetic processing simulation
      setTimeout(() => {
        dbService.registerDevice({
          name: `${welcomeBrand} ${welcomeModel}`,
          type: 'laptop',
          brand: welcomeBrand,
          model: welcomeModel,
          serialNumber: welcomeSerial,
          operatingSystem: 'Windows 11 Education',
          image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80'
        });
        setWelcomeUploading(false);
        refreshData();
      }, 1000);
    }
  };

  const handleDeviceRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeviceName && newDeviceModel && newDeviceSN) {
      dbService.registerDevice({
        name: newDeviceName,
        type: 'laptop',
        brand: newDeviceBrand,
        model: newDeviceModel,
        serialNumber: newDeviceSN,
        operatingSystem: newDeviceOS,
        image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80'
      });
      setNewDeviceName('');
      setNewDeviceModel('');
      setNewDeviceSN('');
      setShowDeviceModal(false);
      refreshData();
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicketTitle && newTicketDesc) {
      dbService.createTicket({
        deviceId: devices[0]?.id,
        title: newTicketTitle,
        description: newTicketDesc,
        category: newTicketCat,
        priority: newTicketPriority
      });
      setNewTicketTitle('');
      setNewTicketDesc('');
      setShowTicketModal(false);
      refreshData();
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket && newMsgContent.trim()) {
      dbService.sendTicketMessage(selectedTicket.id, newMsgContent);
      setNewMsgContent('');
      setChatMessages(dbService.getTicketMessages(selectedTicket.id));
      refreshData();
    }
  };

  // Compute a unique premium/basic subscription hash/serial key deterministically per user
  const isPremium = subscription?.plan_id === 'premium-plan';
  const prefix = isPremium ? 'PRE' : 'BAS';
  const rawId = (profile?.student_id || 'BNLJPG').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const finalId = rawId.length >= 6 ? rawId.slice(-6) : (rawId + 'BNLJPG').slice(0, 6);
  const subscriberKey = `SS-2026-${prefix}-${finalId}`;

  // QR Code Image endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(subscriberKey)}`;

  // Status badging styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-150';
      case 'in_progress':
      case 'under_repair':
        return 'text-amber-700 bg-amber-50 border border-amber-150';
      default:
        return 'text-royal bg-blue-50 border border-blue-150';
    }
  };

  // Onboarding Laptop detail layout if they have a active membership but no device linked yet
  if (subscription && devices.length === 0) {
    return (
      <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center pt-24 pb-12 px-4 select-none text-left">
        <div className="max-w-xl w-full bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 space-y-6 shadow-none">
          
          <div className="text-center space-y-3 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 bg-royal/10 text-royal rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7 flex-shrink-0 animate-pulse text-royal" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#00183D] font-sans">Initialize Your Protection Plan</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                To activate coverage, please register your protected laptop details. Each StudentShield subscription is linked to exactly one device to secure diagnostic booth compliance.
              </p>
            </div>
          </div>

          <form onSubmit={handleWelcomeDeviceSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Laptop Brand</label>
                <select
                  value={welcomeBrand}
                  onChange={(e) => setWelcomeBrand(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                >
                  <option>Asus</option>
                  <option>Apple</option>
                  <option>HP</option>
                  <option>Lenovo</option>
                  <option>Dell</option>
                  <option>Acer</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Device Model</label>
                <input
                  type="text"
                  required
                  value={welcomeModel}
                  onChange={(e) => setWelcomeModel(e.target.value)}
                  placeholder="E.g. MacBook Air, ZenBook 14"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Serial Tag Code</label>
                <input
                  type="text"
                  required
                  value={welcomeSerial}
                  onChange={(e) => setWelcomeSerial(e.target.value)}
                  placeholder="E.g. SN-89283-Z"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Purchase Year</label>
                <input
                  type="number"
                  required
                  value={welcomeYear}
                  onChange={(e) => setWelcomeYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={welcomeUploading}
              className="w-full py-3 bg-[#3B82F6] hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wide cursor-pointer disabled:opacity-50 transition-all font-sans text-xs mt-2"
            >
              {welcomeUploading ? 'Securing Hardware Allocation...' : 'Activate Full Protection Coverage'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-left font-sans select-none flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-24">
        
        {/* Dynamic Header Section Match with Waving Hand and Clean Coverage Pill */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6 mb-8 font-sans">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold font-mono">My Account Portal</span>
              {subscription ? (
                <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-200 flex items-center space-x-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Coverage Active</span>
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border border-rose-200 flex items-center space-x-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Coverage Inactive</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00183D] tracking-tight mt-1.5">
              Welcome back, {profile?.full_name || 'fdfdfdf'} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              StudentShield • {isPremium ? 'Premium Shield Cover' : 'Basic Cover Plan'} • Semester 2, 2025
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3.5 relative">
            
            {/* Round Circle Profile with details inspired strictly by image preview */}
            <div className="flex items-center space-x-3 relative">
              
              {/* Search Toggle button inside pill */}
              <div className="flex items-center relative">
                <AnimatePresence>
                  {searchOpen && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 155, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="text"
                      placeholder="Search tickets, notebooks..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="mr-2 text-[10px] px-3 py-1.5 border border-slate-200 bg-white rounded-none text-slate-800 focus:outline-none focus:border-royal transition-all font-sans"
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                  className="w-8 h-8 md:w-9 md:h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-colors border border-slate-200/50"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Actionable Notification Alert Bell Button */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                  className="w-8 h-8 md:w-9 md:h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-colors border border-slate-200/50 relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications && notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
                  )}
                </button>
                
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 p-4 rounded-none shadow-xl z-50 text-xs font-sans space-y-2.5"
                    >
                      <div className="font-bold text-navy uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                        Triage alerts Log
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto font-sans">
                        {notifications && notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div key={notif.id} className="border-b border-slate-50 pb-2 last:border-0 text-left">
                              <p className="font-semibold text-slate-800 text-[10px]">{notif.title}</p>
                              <p className="text-slate-500 text-[9px] mt-0.5">{notif.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 text-center py-2">
                            All systems operating within specifications.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar and name in a clean pill wrapper matching instructions */}
              <div className="relative">
                <div 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center bg-slate-100/80 p-1.5 pr-3.5 rounded-full border border-slate-200 hover:bg-slate-200/40 transition-all select-none cursor-pointer font-sans"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                    <img 
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                      alt="Student Avatar"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-bold text-navy ml-2 font-sans tracking-tight">
                    {profile?.full_name || 'fdfdfdf'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-navy ml-1.5 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white border border-slate-200/80 p-5 rounded-none shadow-sm z-[95] text-xs font-sans space-y-4"
                    >
                      {/* Step 1: Profile card & Dynamic Profile Editor */}
                      <div className="space-y-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-1.5">
                          <User className="w-3.5 h-3.5 text-royal" />
                          <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">
                            Student Profile
                          </span>
                        </div>

                        <form onSubmit={handleUpdateProfileSubmit} className="space-y-2.5 font-sans">
                          <div className="text-left">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Mail address</label>
                            <div className="text-[10px] text-slate-500 bg-slate-50/50 border border-slate-200/50 px-2.5 py-1.5 select-all font-sans truncate">
                              {user?.email || 'student@university.edu'}
                            </div>
                          </div>

                          <div className="text-left">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Complete Name</label>
                            <input
                              type="text"
                              required
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-xs bg-slate-50/20 border border-slate-200/60 px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal/30 focus:border-royal/50 transition-all rounded-none text-slate-800 font-sans"
                            />
                          </div>

                          <div className="text-left">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Contact Phone</label>
                            <input
                              type="text"
                              required
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full text-xs bg-slate-50/20 border border-slate-200/60 px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal/30 focus:border-royal/50 transition-all rounded-none text-slate-800 font-sans"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2 bg-[#00183D] hover:bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-none cursor-pointer transition-colors font-sans"
                          >
                            {profileSaved ? 'Changes Saved! ✓' : 'Save changes'}
                          </button>
                        </form>
                      </div>

                      {/* Step 2: LogOut with red high contrast button according to design principles */}
                      <div className="text-left">
                        <button
                          onClick={() => logout()}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-[10px] tracking-widest rounded-none shadow-none cursor-pointer transition-colors flex items-center justify-center font-sans"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* 4-Column Summary Cards Metric Board Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left mb-8 font-sans">
          
          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
            <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">PLAN</span>
            <span className="text-2xl font-black text-navy mt-1 tracking-tight block">
              {isPremium ? 'Premium' : 'Basic'}
            </span>
            <span className="text-xs text-slate-400 block mt-1.5">
              GH₵ {isPremium ? '50' : '20'} / semester
            </span>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
            <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">TICKETS FILED</span>
            <span className="text-2xl font-black text-navy mt-1 tracking-tight block">
              {tickets.length > 0 ? tickets.length : '4'}
            </span>
            <span className="text-xs text-slate-400 block mt-1.5">
              This semester
            </span>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
            <span className="text-[10px] uppercase font-bold text-royal tracking-wide block font-sans">AMOUNT SAVED</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 tracking-tight block">
              GH₵ {isPremium ? '340' : '120'}
            </span>
            <span className="text-xs text-slate-400 block mt-1.5">
              vs. market rates
            </span>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
            <span className="text-[10px] uppercase font-bold text-royal tracking-wide block font-sans">COVERAGE ENDS</span>
            <span className="text-2xl font-black text-navy mt-1 tracking-tight block">
              Dec 2025
            </span>
            <span className="text-xs text-slate-400 block mt-1.5">
              End of exams
            </span>
          </div>

        </div>

        {/* Support Chat Overlay View if a ticket is clicked (High Fidelity Interactive Experience) */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mb-8 border border-slate-200 bg-white rounded-2xl p-5 sm:p-6 text-xs text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center space-x-3 text-left">
                  <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-royal font-mono tracking-wide">ACTIVE CASE: #{selectedTicket.id}</span>
                    <h3 className="text-sm font-bold text-navy line-clamp-1">{selectedTicket.title}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${getStatusBadgeClass(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <button onClick={() => setSelectedTicket(null)} className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat room message feed container */}
              <div className="h-56 overflow-y-auto space-y-3.5 p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl mb-4 font-sans text-xs">
                {chatMessages.map((msg, idx) => {
                  const isStaff = msg.message.sender_role === 'admin';
                  return (
                    <div key={idx} className={`flex items-start space-x-2.5 max-w-[85%] ${isStaff ? 'ml-auto text-right flex-row-reverse space-x-reverse' : 'mr-auto text-left'}`}>
                      <div className="w-6 h-6 rounded-full overflow-hidden border flex-shrink-0">
                        <img 
                          src={isStaff ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' : 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profile?.full_name || 'fdfdfdf')} 
                          alt="Avatar" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className={`p-3 rounded-2xl ${isStaff ? 'bg-royal text-white' : 'bg-white border border-slate-150 text-slate-700'}`}>
                        <span className="text-[9px] font-bold block mb-1 opacity-75 uppercase tracking-wide">{msg.senderName} ({msg.message.sender_role})</span>
                        <p className="whitespace-pre-line leading-relaxed text-[11px]">{msg.message.content}</p>
                        <span className="text-[8px] block mt-1 opacity-50">{new Date(msg.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendChatMessage} className="flex gap-2 font-sans">
                <input
                  type="text"
                  required
                  placeholder="Enter message here to speak with campus support booth..."
                  value={newMsgContent}
                  onChange={(e) => setNewMsgContent(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-royal focus:bg-white transition-all text-slate-800"
                />
                <button type="submit" className="px-5 bg-royal hover:bg-royal/90 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split Grid Column layout matching fdfdfdf's photo exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Left Column (Your Coverage details with dark navy active card & dynamic QR) */}
          <div className="lg:col-span-5 text-left space-y-4">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider">Your Coverage</h2>
            
            <div className="bg-[#00183D] p-6.5 rounded-3xl text-white select-none relative overflow-hidden flex flex-col justify-between h-40">
              <div className="absolute top-0 right-0 w-36 h-36 bg-royal/10 filter blur-2xl rounded-full pointer-events-none" />
              <div>
                <span className="bg-[#FFC500]/15 border border-[#FFC500]/30 text-[#FFC500] text-[9px] font-extrabold font-mono rounded px-2 py-0.5 tracking-wider uppercase inline-block">
                  ACTIVE PLAN
                </span>
                <h3 className="text-lg font-black tracking-tight mt-2.5">
                  {isPremium ? 'Premium Shield' : 'Basic Cover'}
                </h3>
              </div>
              <span className="text-xs text-slate-350 font-medium block">
                Valid until: December 2025
              </span>
            </div>

            {/* Coverage Specifications Specs list matched with Green/Yellow badging */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500 font-medium font-sans">Software Fixes:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">✓ Unlimited</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500 font-medium font-sans">OS Installation:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">✓ Unlimited</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500 font-medium font-sans">Hardware Labour:</span>
                {isPremium ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">✓ Free</span>
                ) : (
                  <span className="text-slate-500 font-bold bg-slate-50 px-2 py-0.5 border border-slate-150 rounded">~ Not Covered</span>
                )}
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500 font-medium font-sans">Parts Cost:</span>
                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 border border-amber-100 rounded">~ You pay</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500 font-medium font-sans">Priority Response:</span>
                {isPremium ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">✓ Same day</span>
                ) : (
                  <span className="text-slate-500 font-bold bg-slate-50 px-2 py-0.5 border border-slate-150 rounded">~ 24-48 Hours</span>
                )}
              </div>

              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-500 font-medium font-sans">Consultation Fee:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">✓ Always FREE</span>
              </div>
            </div>

            {/* QR Verification Widget block */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 select-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-sans">Verification Token</span>
              
              <div className="p-2 border border-slate-100 rounded-2xl bg-slate-50/50">
                <img 
                  src={qrCodeUrl} 
                  alt="StudentShield secure subscriber QR" 
                  className="w-40 h-40 object-contain rounded-xl mix-blend-multiply" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center space-y-1">
                <span className="block text-[11px] font-mono font-bold tracking-widest text-navy uppercase">
                  {subscriberKey}
                </span>
                <p className="text-[10px] text-slate-400 font-sans max-w-xs leading-normal">
                  Show this unique QR code at any campus repair booth to verify active protection.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Repair history case list & ticket submits) */}
          <div className="lg:col-span-7 text-left space-y-4 w-full">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider">Repair History</h2>
            
            <div className="space-y-3.5">
              {/* Combine seeded history items from screenshot to match perfectly, plus any database items */}
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="p-4.5 bg-slate-50/50 hover:bg-slate-50 hover:border-royal/30 border border-slate-200/60 rounded-2xl flex justify-between items-center transition-all cursor-pointer font-sans"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy text-xs leading-snug tracking-tight">{t.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${getStatusBadgeClass(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-350" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Seeded layouts directly from the high-fidelity screenshot */}
                  <div className="p-4.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy text-xs leading-snug tracking-tight">Windows 11 Activation Error</h4>
                      <span className="text-[10px] text-slate-400 font-medium block">Nov 12, 2025</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase text-emerald-700 bg-emerald-50 border border-emerald-150">
                      Resolved
                    </span>
                  </div>

                  <div className="p-4.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy text-xs leading-snug tracking-tight">Keyboard key not responding</h4>
                      <span className="text-[10px] text-slate-400 font-medium block">Oct 28, 2025</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase text-emerald-700 bg-emerald-50 border border-emerald-150">
                      Resolved
                    </span>
                  </div>

                  <div className="p-4.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy text-xs leading-snug tracking-tight font-sans">Malware removal &amp; cleanup</h4>
                      <span className="text-[10px] text-slate-400 font-medium block font-sans">Oct 5, 2025</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase text-emerald-700 bg-emerald-50 border border-emerald-150">
                      Resolved
                    </span>
                  </div>

                  <div className="p-4.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy text-xs leading-snug tracking-tight">MS Office installation &amp; setup</h4>
                      <span className="text-[10px] text-slate-400 font-medium block">Sep 14, 2025</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase text-emerald-700 bg-emerald-50 border border-emerald-150">
                      Resolved
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Custom styled Solid CTA button with thin outlines and branding color */}
            <button
              onClick={() => setShowTicketModal(true)}
              className="mt-4 bg-[#00183D] hover:bg-navy/95 text-white rounded-2xl tracking-wide font-bold py-3.5 px-6 block w-full text-center hover:scale-[1.01] active:scale-95 transition-all select-none cursor-pointer text-xs uppercase"
            >
              + Submit New Ticket
            </button>
          </div>

        </div>

      </div>

      {/* MODAL 1: REGISTER EXTRA NOTEBOOK COMPONENT */}
      <AnimatePresence>
        {showDeviceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 text-left"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-md select-none relative"
            >
              <button 
                onClick={() => setShowDeviceModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[9px] uppercase font-bold text-royal font-mono">My Notebooks</span>
                <h3 className="text-sm font-black text-navy mt-1">Active Hardware Inventory</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Your coverage plan covers diagnostics on these items.</p>
              </div>

              {/* List of registered inventory devices */}
              <div className="space-y-2.5 mb-5 max-h-40 overflow-y-auto">
                {filteredDevices.map((dev) => (
                  <div key={dev.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                    <div className="text-left flex items-center space-x-2.5">
                      <Cpu className="w-5 h-5 text-royal" />
                      <div>
                        <span className="font-bold text-navy block">{dev.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-medium block">SN: {dev.serial_number}</span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded">
                      {dev.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form to submit extra registration hardware */}
              <form onSubmit={handleDeviceRegisterSubmit} className="space-y-3.5 text-xs font-sans">
                <div className="font-bold border-t border-slate-100 pt-3 relative text-[10px] uppercase text-slate-400 block tracking-wider font-mono">
                  Register Another Laptop
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Device Nickname</label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="E.g. Kofi MacBook Pro"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:outline-[#3B82F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Hardware Brand</label>
                    <select
                      value={newDeviceBrand}
                      onChange={(e) => setNewDeviceBrand(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2.5 focus:outline-[#3B82F6]"
                    >
                      <option>Asus</option>
                      <option>Apple</option>
                      <option>HP</option>
                      <option>Dell</option>
                      <option>Lenovo</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Model Code</label>
                    <input
                      type="text"
                      required
                      value={newDeviceModel}
                      onChange={(e) => setNewDeviceModel(e.target.value)}
                      placeholder="E.g. UM3402"
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:outline-[#3B82F6]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Hardware Serial Code</label>
                  <input
                    type="text"
                    required
                    value={newDeviceSN}
                    onChange={(e) => setNewDeviceSN(e.target.value)}
                    placeholder="E.g. SN-ASUS-82937"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:outline-[#3B82F6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00183D] hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: SUBMIT NEW SUPPORT TICKET DIALOG (Thin outlines, no shadows, custom colors & buttons) */}
      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 text-left font-sans"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-lg select-none relative"
            >
              <button 
                onClick={() => setShowTicketModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-5">
                <span className="text-[9px] uppercase font-bold text-royal font-mono">Support Services</span>
                <h3 className="text-sm font-black text-navy mt-1 uppercase">Submit Diagnostic Ticket</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">All registered issues are triaged immediately by Kofi / Ato Kwamena on campus.</p>
              </div>

              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Brief issue title</label>
                  <input
                    type="text"
                    required
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="E.g. Blue Screen crash when opening Visual Studio"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:outline-[#3B82F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Issue Category</label>
                    <select
                      value={newTicketCat}
                      onChange={(e) => setNewTicketCat(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2.5 focus:outline-[#3B82F6]"
                    >
                      <option value="software">Software Triage</option>
                      <option value="virus">Virus clean & optim</option>
                      <option value="diagnostic">Diagnostic Evaluation</option>
                      <option value="hardware">Hardware Repair</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Priority Urgency</label>
                    <select
                      value={newTicketPriority}
                      onChange={(e) => setNewTicketPriority(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 bg-white rounded-xl px-3 py-2.5 focus:outline-[#3B82F6]"
                    >
                      <option value="low">Low priority backlog</option>
                      <option value="medium">Medium tracking</option>
                      <option value="high">High queue SLA</option>
                      <option value="urgent">Urgent standby</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Full diagnostic summary notes</label>
                  <textarea
                    rows={4}
                    required
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    placeholder="Describe what error appears on your laptop, what program is running, or what keys do not respond..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:outline-[#3B82F6] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#00183D] hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Queue diagnostic ticket
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
