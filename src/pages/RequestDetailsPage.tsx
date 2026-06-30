import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { useApp } from '../context/AppContext';
import { 
  Shield, Cpu, FileText, Laptop, 
  ArrowLeft, Clock, AlertTriangle, MessageSquare, User, Activity 
} from 'lucide-react';
import { motion } from 'motion/react';
import { SupportTicket, Device, Profile, Message } from '../types';

export const RequestDetailsPage: React.FC = () => {
  const { navigate } = useApp();
  const [reqId, setReqId] = useState<string | null>(null);
  const [data, setData] = useState<{
    ticket: SupportTicket;
    profile: Profile;
    device?: Device;
    messages: { message: Message; senderName: string; senderAvatar?: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setReqId(id);

    if (id) {
      const details = dbService.getPublicRequestDetails(id);
      if (details) {
        setData(details);
      }
    }
    setLoading(false);
  }, []);

  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'open': return 1;
      case 'in_progress': return 2;
      case 'resolved': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'delivered': return 'bg-teal-50 text-teal-700 border border-teal-250';
      case 'open': return 'bg-blue-50 text-blue-700 border border-blue-250';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border border-amber-250';
      default: return 'bg-slate-50 text-slate-700 border border-slate-250';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Activity className="w-10 h-10 text-royal animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500 font-sans">Locating secure device log...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-navy uppercase tracking-wide">Tracking Log Not Found</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              We couldn't retrieve any active StudentShield request details for code <strong className="text-slate-700 font-mono">{reqId || 'N/A'}</strong>. The code may be incorrect or expired.
            </p>
          </div>
          <button
            onClick={() => navigate('landing')}
            className="w-full py-3 bg-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Console</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const { ticket, profile, device, messages } = data;
  const currentStep = getStatusStep(ticket.status);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 selection:bg-royal selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
        
        {/* Breadcrumb Navigation Header */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('landing')}
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-navy text-xs font-bold uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-royal" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">PUBLIC ACCESS POINT</span>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="font-mono text-xs text-slate-400">Request ID: #{ticket.id}</span>
              <span className={`text-[9.5px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className="bg-royal/5 border border-royal/10 text-royal text-[9px] px-2 py-0.5 font-bold rounded-full uppercase">
                {ticket.category.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-navy tracking-tight">{ticket.title}</h1>
            <p className="text-xs text-slate-450 font-semibold">
              Logged on {new Date(ticket.created_at).toLocaleString()} • Priority: <span className="uppercase text-slate-500 font-bold font-mono">{ticket.priority}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shrink-0 text-left">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-[9px] text-slate-405 font-mono block uppercase font-bold">Estimated Resolution</span>
              <span className="font-bold text-navy text-[11px] block mt-0.5">
                {ticket.status === 'delivered' || ticket.status === 'resolved' 
                  ? 'Case Completed' 
                  : ticket.priority === 'urgent' || ticket.priority === 'high' 
                    ? 'Within 12-24 Hours' 
                    : 'Within 2-3 Business Days'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Timeline tracker */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3 text-left">Repair Journey Log</h3>
          
          <div className="mt-8 relative">
            {/* Background progress track line */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 rounded-full z-0 md:block hidden" />
            <div 
              className="absolute top-4 left-4 h-1 bg-royal rounded-full z-0 transition-all duration-500 md:block hidden" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {[
                { step: 1, title: 'Request Submitted', desc: 'Case generated inside memory.' },
                { step: 2, title: 'In Diagnostics', desc: 'Technicians analyzing device.' },
                { step: 3, title: 'Resolved Case', desc: 'Repair successfully executed.' },
                { step: 4, title: 'Delivered Back', desc: 'Device returned to subscriber.' }
              ].map((item) => {
                const isActive = item.step <= currentStep;
                const isCurrent = item.step === currentStep;
                return (
                  <div key={item.step} className="flex flex-row md:flex-col items-center md:items-start text-left gap-4 md:gap-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-mono text-xs font-bold shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-royal text-white border-royal shadow-md shadow-royal/10' 
                        : 'bg-white text-slate-400 border-slate-200'
                    } ${isCurrent ? 'ring-4 ring-royal/20 animate-pulse' : ''}`}>
                      {item.step < currentStep ? '✓' : item.step}
                    </div>
                    <div className="md:mt-3 text-left">
                      <span className={`text-[11px] font-bold block ${isActive ? 'text-navy' : 'text-slate-400'}`}>
                        {item.title}
                      </span>
                      <span className="text-[9.5px] text-slate-450 block mt-0.5 leading-relaxed">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Grid layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cards info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Subscriber Info Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left font-sans">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                <User className="w-4 h-4 text-royal animate-pulse" />
                <span>Subscriber Metadata</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">Full Name</span>
                  <span className="font-bold text-navy text-[11.5px] block mt-0.5">{profile.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">Student ID</span>
                  <span className="font-bold text-navy text-[11.5px] block mt-0.5 font-mono">{profile.student_id}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">Academic Institution</span>
                  <span className="font-bold text-navy text-[11.5px] block mt-0.5">{profile.university}</span>
                </div>
              </div>
            </div>

            {/* Device Info Card */}
            {device ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left font-sans">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-royal" />
                  <span>Device Specifications</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Device Name</span>
                    <span className="font-bold text-navy text-[11.5px] block mt-0.5">{device.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Brand & Model</span>
                    <span className="font-bold text-navy text-[11.5px] block mt-0.5">{device.brand} {device.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Installed OS</span>
                    <span className="font-bold text-navy text-[11.5px] block mt-0.5">{device.operating_system}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Serial Number</span>
                    <span className="font-bold text-navy text-[11.5px] block mt-0.5 font-mono truncate">{device.serial_number}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-400 italic text-xs text-left">
                No specific device registry was bound to this ticket request.
              </div>
            )}

          </div>

          {/* Right Column: Chat messages log */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Ticket Description Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left font-sans">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-royal" />
                <span>Issue Description Summary</span>
              </h3>
              <p className="text-xs text-slate-655 font-medium leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-200 p-4 rounded-2xl">{ticket.description}</p>
            </div>

            {/* Support Agent Logs Messages */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left font-sans">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-royal" />
                <span>Live Technician Support Timeline</span>
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 text-xs">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isStaff = msg.message.sender_role === 'admin' || msg.message.sender_role === 'support_agent';
                    return (
                      <div key={idx} className={`flex items-start space-x-2.5 max-w-[88%] ${isStaff ? 'mr-auto text-left' : 'ml-auto text-right flex-row-reverse space-x-reverse'}`}>
                        <div className="w-6 h-6 rounded-full overflow-hidden border flex-shrink-0 bg-slate-200">
                          <img 
                            src={isStaff ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' : `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`} 
                            alt="Avatar" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className={`p-3 rounded-2xl leading-relaxed ${isStaff ? 'bg-royal text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                          <div className="flex justify-between items-center space-x-4 mb-1">
                            <span className="text-[8.5px] font-bold uppercase opacity-80">{msg.senderName}</span>
                            <span className="text-[7.5px] opacity-60 font-mono">{new Date(msg.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="whitespace-pre-line leading-relaxed text-[11px]">{msg.message.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-center py-6">No updates logged. Waiting for active technician dispatch...</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
