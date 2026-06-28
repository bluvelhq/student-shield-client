/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/db';
import { 
  Shield, 
  Mail, 
  User, 
  Phone, 
  CheckCircle, 
  GraduationCap, 
  Unlock, 
  Info, 
  Laptop, 
  Lock, 
  Coins,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InsurePage: React.FC = () => {
  const { navigate, refreshData, viewState } = useApp();
  
  // Plan State selection defaulting to basic-plan or passed parameter
  const [selectedPlan, setSelectedPlan] = useState<'basic-plan' | 'premium-plan' | 'bonanza-plan'>(
    (viewState?.selectPlanId === 'premium-plan') ? 'premium-plan' : 
    (viewState?.selectPlanId === 'bonanza-plan') ? 'bonanza-plan' : 'basic-plan'
  );

  // Sync state if viewState propagation changes selectPlanId
  React.useEffect(() => {
    if (viewState?.selectPlanId === 'premium-plan') {
      setSelectedPlan('premium-plan');
    } else if (viewState?.selectPlanId === 'bonanza-plan') {
      setSelectedPlan('bonanza-plan');
    } else if (viewState?.selectPlanId === 'basic-plan') {
      setSelectedPlan('basic-plan');
    }
  }, [viewState]);

  // Form Field States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('');
  const [gender, setGender] = useState('');
  const [level, setLevel] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hostel, setHostel] = useState('');
  const [momoNumber, setMomoNumber] = useState('');

  const [institutions, setInstitutions] = useState<string[]>([]);
  React.useEffect(() => {
    const list = dbService.getInstitutions().map(i => i.name);
    setInstitutions(list);
    if (list.length > 0) {
      setUniversity(list[0]);
    }
  }, []);

  // Auxiliary States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Standard Client Validation
    if (!firstName || !lastName || !phone || !email || !momoNumber || !gender || !university) {
      setErrorMsg('Please complete all required fields marked with an asterisk (*).');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('A valid student academic email is required.');
      setLoading(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const finalPrice = selectedPlan === 'bonanza-plan' ? 120 : (selectedPlan === 'premium-plan' ? 50 : 20);

    const offlineUserSession = dbService.signUp({
      email,
      fullName,
      university,
      studentId: studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
      phone,
      gender,
      role: 'student'
    });

    const pendingSubId = `sub-${Math.random().toString(36).substring(2, 9)}`;
    const ref = `REF-SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const checkoutMockUrl = `${window.location.origin}?mock_checkout=1&reference=${ref}&amount=${finalPrice}&subId=${pendingSubId}&userId=${offlineUserSession.user.id}&planId=${selectedPlan}`;
    
    setSuccessMsg('Onboarding successful! Connecting securely with Paystack checkout hub...');
    setTimeout(() => {
      window.location.href = checkoutMockUrl;
    }, 800);
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen font-sans select-none text-left relative overflow-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal/3 filter blur-3xl rounded-none pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-golden/3 filter blur-3xl rounded-none pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        
        {/* Title Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00183D] font-sans">
            Insure Your Laptop Today
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
            Fill in your details and choose a plan. Coverage activates as soon as payment is confirmed.
          </p>
        </div>

        {/* Plan Selection Section */}
        <div className="space-y-4">
          <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-royal font-mono leading-none">
            SELECT YOUR PLAN
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Basic Plan option */}
            <div 
              onClick={() => setSelectedPlan('basic-plan')}
              className={`p-5 bg-white border cursor-pointer transition-all flex flex-col justify-between text-left rounded-xl ${
                selectedPlan === 'basic-plan' 
                  ? 'border-royal ring-1 ring-royal bg-white shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block font-sans">Basic Plan</span>
                <div className="flex items-baseline space-x-1 mt-2 mb-1.5">
                  <span className="text-xl font-extrabold text-[#00183D] font-sans">GH₵20</span>
                  <span className="text-slate-450 text-[9px] font-semibold font-sans">/ sem</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium select-none font-sans leading-normal">
                Unlimited software install & fault diagnosis support.
              </p>
            </div>

            {/* Premium Plan option */}
            <div 
              onClick={() => setSelectedPlan('premium-plan')}
              className={`p-5 bg-white border cursor-pointer transition-all flex flex-col justify-between text-left rounded-xl relative overflow-hidden ${
                selectedPlan === 'premium-plan' 
                  ? 'border-royal ring-1 ring-royal bg-white shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block font-sans">Premium Shield ⭐️</span>
                <div className="flex items-baseline space-x-1 mt-2 mb-1.5">
                  <span className="text-xl font-extrabold text-[#00183D] font-sans">GH₵50</span>
                  <span className="text-slate-450 text-[9px] font-semibold font-sans">/ sem</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium select-none font-sans leading-normal">
                Free repair labor + free personal portfolio website setup.
              </p>
            </div>

            {/* Bonanza Plan option */}
            <div 
              onClick={() => setSelectedPlan('bonanza-plan')}
              className={`p-5 bg-white border cursor-pointer transition-all flex flex-col justify-between text-left rounded-xl relative overflow-hidden ${
                selectedPlan === 'bonanza-plan' 
                  ? 'border-amber-500 ring-1 ring-amber-500 bg-[#FFFDF6] shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-amber-900 block font-sans">Bonanza Plan 🚀</span>
                <div className="flex items-baseline space-x-1 mt-2 mb-1.5">
                  <span className="text-xl font-extrabold text-amber-950 font-sans">GH₵120</span>
                  <span className="text-amber-700 text-[9px] font-semibold font-sans">/ sem</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-800 mt-1 font-medium select-none font-sans leading-normal">
                3 devices + Business Web Setup + Hosting + Consultations.
              </p>
            </div>

          </div>
        </div>

        {/* Master Student Info Card */}
        <div className="bg-white border border-slate-200 rounded-none p-6 sm:p-10 space-y-6 shadow-none">
          
          <div className="pb-1 border-b border-slate-100">
            <h3 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-slate-400 font-mono leading-none">
              STUDENT INFORMATION
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ama"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Korantema"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
              </div>
            </div>

            {/* Row 2: Student ID & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="20334456"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans font-medium">Gender *</label>
                <div className="relative">
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal appearance-none cursor-pointer font-sans font-medium"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 3: Level & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">Level</label>
                <div className="relative">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal appearance-none cursor-pointer font-sans font-medium"
                  >
                    <option value="">Select level</option>
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                    <option value="PG">Post-Graduate</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans font-medium">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="024 XXX XXXX"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
              </div>
            </div>

            {/* Row 4: Email Address & Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ama@ug.edu.gh"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans font-medium">Institution *</label>
                <div className="relative">
                  <select
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal appearance-none cursor-pointer font-sans font-medium"
                  >
                    {institutions.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>



            {/* Row 6: Hostel / Residence */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-slate-700 block select-none">Hostel / Residence</label>
              <input
                type="text"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                placeholder="e.g. Commonwealth Hall, Room 214"
                className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
              />
            </div>

            {/* PAYMENT BAR */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-[#2563EB] font-mono leading-none">
                PAYMENT
              </h3>

              {/* Yellow Alert Box strictly rectangular */}
              <div className="p-4 bg-[#FEFBF0] border border-[#FDE047] rounded-none flex items-start space-x-3 text-slate-700 text-xs text-left shadow-none">
                <div className="mt-0.5 bg-[#FFFbeb] text-[#D97706] p-1.5 rounded-none border border-[#FDE047]/50">
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="leading-relaxed text-[11px] text-[#713F12] font-sans font-medium">
                  Payment via MTN MoMo or Telecel Cash. You&apos;ll receive payment instructions on WhatsApp after submitting. Coverage activates on payment confirmation.
                </p>
              </div>

              {/* MoMo Number Input */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">MoMo Number *</label>
                <input
                  type="text"
                  required
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="024 XXX XXXX (number you will pay from)"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
              </div>
            </div>

            {/* Alert Portals */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 border border-red-200 text-red-700 text-[11px] p-3.5 rounded-none flex items-start space-x-2 font-sans shadow-none"
                >
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-3.5 rounded-none flex items-start space-x-2 font-sans shadow-none"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rectangular Royal Blue brand button with no shadow */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 text-xs sm:text-sm font-extrabold text-white bg-royal hover:bg-royal/90 rounded-none transition-all tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 pointer-events-auto cursor-pointer shadow-none"
            >
              <Shield className="w-4.5 h-4.5 flex-shrink-0 text-white" />
              <span>
                {loading ? 'Initializing Safe Payment Hub...' : 'Submit & Get Insured'}
              </span>
            </button>
            
            <p className="text-[10px] text-slate-400 font-semibold text-center font-sans tracking-wide">
              By submitting, you agree to our terms of service. Coverage activates upon payment confirmation.
            </p>

          </form>

          {/* Quick links */}
          <div className="border-t border-slate-100 pt-4 flex justify-center text-xs text-slate-400 font-semibold font-sans">
            <button 
              onClick={() => navigate('login')} 
              className="hover:text-royal transition-colors font-bold cursor-pointer"
            >
              Already insured? Access Dashboard here.
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
