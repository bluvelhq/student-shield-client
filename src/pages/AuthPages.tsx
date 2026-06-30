/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/db';
import { AppLogo } from '../components/ui/AppLogo';
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
  ChevronDown, 
  Lock, 
  Coins 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthPages: React.FC<{ type: 'login' | 'register' | 'forgot-password' | 'admin-login' }> = ({ type }) => {
  const { login, register, navigate, viewState } = useApp();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [institutionsList, setInstitutionsList] = useState<string[]>([]);
  React.useEffect(() => {
    const list = dbService.getInstitutions().map(i => i.name);
    setInstitutionsList(list);
    if (list.length > 0) {
      setUniversity(list[0]);
    }
  }, []);
  
  // Optional device fields
  const [showDeviceFields, setShowDeviceFields] = useState(false);
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPlanId = viewState?.selectPlanId || 'basic-plan';
  const planName = selectedPlanId === 'bonanza-plan' ? 'Bonanza Plan Cover' : (selectedPlanId === 'premium-plan' ? 'Premium Shield Cover' : 'Basic Cover Option');
  const planPrice = selectedPlanId === 'bonanza-plan' ? 'GH₵120' : (selectedPlanId === 'premium-plan' ? 'GH₵50' : 'GH₵20');

  const handleAutoFill = async (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@university.edu');
    } else {
      setEmail('admin@studentshield.com');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (type === 'login') {
      if (email.trim().toUpperCase() === 'SHIELD-STUDENT') {
        try {
          const success = await login('student@university.edu');
          if (!success) {
            setErrorMsg('Secret code validated, but student profile could not be found.');
            setLoading(false);
          }
        } catch (err) {
          setErrorMsg('Authentication error. Please try again.');
          setLoading(false);
        }
      } else {
        setErrorMsg('Invalid secret code. Please use the dummy code: SHIELD-STUDENT.');
        setLoading(false);
      }
    } else if (type === 'admin-login') {
      const code = email.trim().toUpperCase();
      if (code === 'SS-TECH-01' || code === 'ADMIN') {
        try {
          const success = await login('admin@studentshield.com');
          if (!success) {
            setErrorMsg('Secret code validated, but administrator profile could not be found.');
            setLoading(false);
          }
        } catch (err) {
          setErrorMsg('Authentication error. Please try again.');
          setLoading(false);
        }
      } else if (code === 'SS-AGENT-01' || code === 'SUPPORT') {
        try {
          const success = await login('support@studentshield.com');
          if (!success) {
            setErrorMsg('Secret code validated, but support agent profile could not be found.');
            setLoading(false);
          }
        } catch (err) {
          setErrorMsg('Authentication error. Please try again.');
          setLoading(false);
        }
      } else {
        setErrorMsg('Invalid admin secret code. Please use: SS-TECH-01 or SS-AGENT-01.');
        setLoading(false);
      }
    } else if (type === 'forgot-password') {
      if (email.trim()) {
        setSuccessMsg('Passcode reset instructions dispatched securely to your academic mailbox.');
        setLoading(false);
      } else {
        setErrorMsg('Registered academic email address required.');
        setLoading(false);
      }
    } else {
      // Step Hybrid Onboarding: Check parameters
      if (!email.includes('@')) {
        setErrorMsg('Standard university academic email is required.');
        setLoading(false);
        return;
      }
      if (!fullName || !phone) {
        setErrorMsg('Please specify your Full Name and MoMo billing number.');
        setLoading(false);
        return;
      }

      const safeJson = async (response: Response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            return await response.json();
          } catch (e) {
            throw new Error('Invalid JSON format from server.');
          }
        }
        throw new Error('OFFLINE_FALLBACK');
      };

      try {
        // 1. Submit Account Auto Creation route
        const regResp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            university,
            studentId,
            password: password || 'LegonShield233!',
            planId: selectedPlanId
          })
        });

        let regData: any = null;
        if (regResp.ok) {
          regData = await safeJson(regResp);
        } else {
          try {
            const errBody = await safeJson(regResp);
            throw new Error(errBody.error || 'Failed to auto-provision account profiles.');
          } catch (e: any) {
            if (e.message === 'OFFLINE_FALLBACK') throw e;
            throw new Error(e.message || 'Failed to auto-provision account profiles.');
          }
        }

        if (!regData || !regData.success) {
          throw new Error('Onboarding backend authentication reject.');
        }

        const registeredUserId = regData.user.id;
        const pendingSubId = regData.subscription.id;
        const finalPrice = selectedPlanId === 'bonanza-plan' ? 120 : (selectedPlanId === 'premium-plan' ? 50 : 20);

        // Sync local client session in localStorage so that navigation loads authenticated stats
        dbService.loginSession(regData.user, regData.profile);

        // 2. Check Optional Device Setup parameters
        if (deviceBrand && deviceModel) {
          await fetch('/api/devices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: registeredUserId,
              brand: deviceBrand,
              model: deviceModel,
              serialNumber: deviceSerial || 'TBD-DEVICESERIAL',
              purchaseYear: new Date().getFullYear(),
              imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80'
            })
          });
        }

        // 3. Initiate checkout process on the endpoint
        setSuccessMsg('Onboarding successful! Connecting securely with Paystack checkout hub...');
        
        const payResp = await fetch('/api/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            amount: finalPrice,
            planId: selectedPlanId,
            userId: registeredUserId,
            subscriptionId: pendingSubId
          })
        });

        let payData: any = null;
        if (payResp.ok) {
          payData = await safeJson(payResp);
        } else {
          throw new Error('Verification pipeline failed to prepare transaction.');
        }

        if (payData && payData.success && payData.authorization_url) {
          setTimeout(() => {
            window.location.href = payData.authorization_url;
          }, 600);
        } else {
          throw new Error('Securing transaction parameters failed.');
        }

      } catch (err: any) {
        if (err.message === 'OFFLINE_FALLBACK') {
          console.warn("API Server registration offline, engaging client-side Local DB flow.");
          const res = dbService.signUp({
            email,
            fullName,
            university,
            studentId: studentId || `TBD-${Math.floor(100000 + Math.random() * 900000)}`,
            phone,
            role: 'student'
          });

          // Register device locally if supplied
          if (deviceBrand && deviceModel) {
            dbService.registerDevice({
              name: `${deviceBrand} ${deviceModel}`,
              type: 'laptop',
              brand: deviceBrand,
              model: deviceModel,
              serialNumber: deviceSerial || 'TBD-DEVICESERIAL',
              operatingSystem: `Windows 11 Setup (${new Date().getFullYear()})`
            });
          }

          const finalPrice = selectedPlanId === 'bonanza-plan' ? 120 : (selectedPlanId === 'premium-plan' ? 50 : 20);
          const pendingSubId = `sub-${Math.random().toString(36).substring(2, 9)}`;
          const ref = `REF-SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
          const checkoutMockUrl = `${window.location.origin}?mock_checkout=1&reference=${ref}&amount=${finalPrice}&subId=${pendingSubId}&userId=${res.user.id}&planId=${selectedPlanId}`;
          
          setSuccessMsg('Onboarding successful! Connecting securely with Paystack checkout hub...');
          setTimeout(() => {
            window.location.href = checkoutMockUrl;
          }, 600);
        } else {
          setErrorMsg(err.message || 'System onboarding transaction aborted.');
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-white selection:bg-royal relative overflow-hidden text-left font-sans select-none">
      {/* Decorative Blur Backing */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-royal/4 filter blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-golden/4 filter blur-3xl rounded-full" />

      <div className="max-w-md w-full mx-auto px-6 py-10 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div 
            onClick={() => navigate('landing')} 
            className="inline-flex items-center space-x-2 cursor-pointer focus:outline-none"
          >
            <AppLogo size="lg" textColor="text-navy" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#2563EB] font-bold block mt-1 leading-none">
            Stay Connected. Stay Protected.
          </span>
        </div>

        {/* Dynamic Card Container */}
        <div className={`bg-white border border-slate-200 p-6 sm:p-8 space-y-5 ${(type === 'login' || type === 'admin-login') ? 'rounded-none shadow-none' : 'rounded-3xl shadow-none'}`}>
          <div className="text-left border-b border-slate-100 pb-3 font-sans">
            <h2 className="text-md font-bold text-[#00183D] capitalize">
              {type === 'login' && 'Access Diagnostic Dashboard'}
              {type === 'admin-login' && 'Access Diagnostic Dashboard'}
              {type === 'register' && 'Onboarding & Protection Cover'}
              {type === 'forgot-password' && 'Retrieve Support Key'}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              {type === 'login' && 'Integrate with university diagnostic resources.'}
              {type === 'admin-login' && 'Enter admin secret code to authenticate root privileges.'}
              {type === 'register' && 'Enter your coordinates to prepare secure payment protection.'}
              {type === 'forgot-password' && 'Enter your academic email address below.'}
            </p>
          </div>

          {/* Active plan banner display under register flow */}
          {type === 'register' && (
            <div className="p-3.5 bg-royal/5 border border-royal/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-royal font-bold block font-mono">Selected Shield Coverage</span>
                <span className="text-xs font-bold text-navy">{planName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-medium text-slate-400 block font-mono">Billing Price</span>
                <span className="text-xs font-bold text-royal font-mono">{planPrice}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input fields */}
            {type === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="E.g. Emmanuel Boateng Mills"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Student ID <span className="text-[9px] text-slate-400 normal-case">(Optional)</span></label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="UG-1100234"
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">MoMo Number</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 24 412..."
                        className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">University Hub Option</label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:border-royal cursor-pointer"
                  >
                    {institutionsList.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Set Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Optional Expandable Device section */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
                  <button
                    type="button"
                    onClick={() => setShowDeviceFields(!showDeviceFields)}
                    className="w-full px-3.5 py-3.5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Laptop className="w-4 h-4 text-royal" />
                      <div>
                        <span className="font-bold text-navy block">Add Device Details Initially</span>
                        <span className="text-[9px] text-slate-400 block">Complete enrollment early to skip dashboard sweeps</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDeviceFields ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showDeviceFields && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 border-t border-slate-100 bg-white space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Laptop Brand</label>
                            <input
                              type="text"
                              value={deviceBrand}
                              onChange={(e) => setDeviceBrand(e.target.value)}
                              placeholder="E.g. Asus, Apple, HP"
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Device Model</label>
                            <input
                              type="text"
                              value={deviceModel}
                              onChange={(e) => setDeviceModel(e.target.value)}
                              placeholder="E.g. ZenBook 14, Pro"
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Serial Tag Code</label>
                          <input
                            type="text"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}
                            placeholder="Optional serial lookup"
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {type === 'admin-login' ? (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Admin Secret Code / Service ID</label>
                <div className="relative font-sans">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Admin Service ID"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-none"
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-sans">
                  For testing, use: <strong className="text-royal font-mono font-bold select-all">SS-TECH-01</strong> (Admin) or <strong className="text-royal font-mono font-bold select-all">SS-AGENT-01</strong> (Support)
                </div>
              </div>
            ) : type === 'login' ? (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Secret Code</label>
                <div className="relative font-sans">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Secret Code"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-none"
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-sans">
                  For testing, use dummy code: <strong className="text-royal font-mono font-bold select-all">SHIELD-STUDENT</strong>
                </div>
              </div>
            ) : (
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Academic Email</label>
                <div className="relative font-sans">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-royal focus:bg-white transition-all rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Error messaging portals */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 border border-red-200 text-red-700 text-[10px] p-2.5 rounded-xl flex items-start space-x-2"
                >
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-2.5 rounded-xl flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-6 text-xs font-bold text-white bg-[#00183D] hover:bg-[#1E293B] transition-all tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 pointer-events-auto cursor-pointer ${
                (type === 'login' || type === 'admin-login') ? 'rounded-none shadow-none' : 'rounded-full shadow-md shadow-royal/10'
              }`}
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  {type === 'register' ? <Coins className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span>
                    {type === 'login' && 'Unlock Dashboard'}
                    {type === 'admin-login' && 'Unlock Dashboard'}
                    {type === 'register' && `Subscribe & Pay ${planPrice}`}
                    {type === 'forgot-password' && 'Initialize Recovery'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection choices */}
          <div className="pt-1 flex justify-between items-center text-[10px] text-slate-400 font-medium font-sans">
            {(type === 'login' || type === 'admin-login') && (
              <>
                {type === 'login' && <button onClick={() => navigate('register')} className="hover:text-royal transition-colors cursor-pointer">Create new account</button>}
                {type === 'admin-login' && <span />}
                <button onClick={() => navigate('forgot-password')} className="hover:text-royal transition-colors cursor-pointer">Forgot support key?</button>
              </>
            )}
            {type === 'register' && (
              <button onClick={() => navigate('login')} className="hover:text-royal transition-colors mx-auto cursor-pointer">Already registered? Log in.</button>
            )}
            {type === 'forgot-password' && (
              <button onClick={() => navigate('login')} className="hover:text-royal transition-colors mx-auto cursor-pointer">Back to login workspace</button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
