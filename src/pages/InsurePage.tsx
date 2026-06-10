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
  const [selectedPlan, setSelectedPlan] = useState<'basic-plan' | 'premium-plan'>(
    (viewState?.selectPlanId === 'premium-plan') ? 'premium-plan' : 'basic-plan'
  );

  // Sync state if viewState propagation changes selectPlanId
  React.useEffect(() => {
    if (viewState?.selectPlanId === 'premium-plan') {
      setSelectedPlan('premium-plan');
    } else if (viewState?.selectPlanId === 'basic-plan') {
      setSelectedPlan('basic-plan');
    }
  }, [viewState]);

  // Form Field States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [programme, setProgramme] = useState('');
  const [level, setLevel] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [laptopDetails, setLaptopDetails] = useState('');
  const [hostel, setHostel] = useState('');
  const [momoNumber, setMomoNumber] = useState('');

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
    if (!firstName || !lastName || !phone || !email || !laptopDetails || !momoNumber) {
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
    const finalPrice = selectedPlan === 'premium-plan' ? 30 : 10;

    try {
      // 1. Submit Account Auto Creation route
      const regResp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          university: 'University of Ghana (Legon)',
          studentId: studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
          password: 'LegonShield233!',
          planId: selectedPlan
        })
      });

      if (!regResp.ok) {
        const errBody = await regResp.json();
        throw new Error(errBody.error || 'Failed to auto-provision account profiles.');
      }

      const regData = await regResp.json();
      if (!regData.success) {
        throw new Error('Onboarding backend authentication rejected.');
      }

      const registeredUserId = regData.user.id;
      const pendingSubId = regData.subscription.id;

      // Sync local client session in localStorage so that navigation loads authenticated stats
      dbService.loginSession(regData.user, regData.profile);

      // Parse laptopDetails into separate Brand and Model safely
      let deviceBrand = 'Laptop';
      let deviceModel = laptopDetails;
      if (laptopDetails.includes(' ')) {
        const parts = laptopDetails.trim().split(' ');
        deviceBrand = parts[0];
        deviceModel = parts.slice(1).join(' ');
      } else if (laptopDetails.includes(',')) {
        const parts = laptopDetails.split(',');
        deviceBrand = parts[0];
        deviceModel = parts.slice(1).join(' ').trim();
      }

      // 2. Submit Device registration detail
      await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: registeredUserId,
          brand: deviceBrand,
          model: deviceModel,
          serialNumber: `SN-${Math.floor(10000 + Math.random() * 90000)}`,
          purchaseYear: new Date().getFullYear(),
          imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80'
        })
      });

      // Synchronize in local offline db structures too
      dbService.registerDevice({
        name: `${deviceBrand} ${deviceModel}`,
        type: 'laptop',
        brand: deviceBrand,
        model: deviceModel,
        serialNumber: `SN-${Math.floor(10000 + Math.random() * 90000)}`,
        operatingSystem: 'Windows 11 Setup (Automatic)',
      });

      // 3. Initiate checkout process on the endpoint
      setSuccessMsg('Onboarding successful! Connecting securely with Paystack checkout hub...');
      
      const payResp = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          amount: finalPrice,
          planId: selectedPlan,
          userId: registeredUserId,
          subscriptionId: pendingSubId
        })
      });

      if (!payResp.ok) {
        throw new Error('Verification pipeline failed to prepare transaction.');
      }

      const payData = await payResp.json();
      if (payData.success && payData.authorization_url) {
        setTimeout(() => {
          window.location.href = payData.authorization_url;
        }, 800);
      } else {
        throw new Error('Securing transaction parameters failed.');
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'System onboarding transaction aborted.');
      setLoading(false);
    }
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Basic Plan option */}
            <div 
              onClick={() => setSelectedPlan('basic-plan')}
              className={`p-6 bg-white border cursor-pointer transition-all flex flex-col justify-between text-left rounded-none ${
                selectedPlan === 'basic-plan' 
                  ? 'border-[#FFC500] ring-1 ring-[#FFC500] bg-white shadow-none' 
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block font-sans">Basic Plan</span>
                <div className="flex items-baseline space-x-1 mt-2 mb-1.5">
                  <span className="text-2xl font-extrabold text-[#00183D] font-sans">GH₵10</span>
                  <span className="text-slate-400 text-[10px] font-semibold font-sans">/ semester</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium select-none font-sans">
                Unlimited software support all semester.
              </p>
            </div>

            {/* Premium Plan option */}
            <div 
              onClick={() => setSelectedPlan('premium-plan')}
              className={`p-6 bg-white border cursor-pointer transition-all flex flex-col justify-between text-left relative overflow-hidden rounded-none ${
                selectedPlan === 'premium-plan' 
                  ? 'border-[#FFC500] ring-1 ring-[#FFC500] bg-white shadow-none' 
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
            >
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-slate-900 block font-sans">Premium Plan ⭐️</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2 mb-1.5">
                  <span className="text-2xl font-extrabold text-[#00183D] font-sans">GH₵30</span>
                  <span className="text-slate-400 text-[10px] font-semibold font-sans">/ semester</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium select-none font-sans">
                Software + hardware. Free labour always.
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

            {/* Row 2: Student ID & Course */}
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
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">Programme / Course</label>
                <input
                  type="text"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  placeholder="BSc Computer Science"
                  className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
                />
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
                <label className="text-[10.5px] font-bold text-slate-700 block select-none font-sans">Phone Number *</label>
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

            {/* Row 4: Email Address */}
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

            {/* Row 5: Laptop Brand & Model */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-slate-700 block select-none">Laptop Brand & Model *</label>
              <input
                type="text"
                required
                value={laptopDetails}
                onChange={(e) => setLaptopDetails(e.target.value)}
                placeholder="e.g. HP 250 G8, Lenovo IdeaPad 3"
                className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-none text-slate-800 bg-white focus:outline-none focus:border-royal transition-colors font-sans font-medium"
              />
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
              Already insulated? Access Dashboard here.
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
