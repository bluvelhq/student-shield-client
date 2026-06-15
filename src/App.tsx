/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { dbService } from './services/db';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingHero } from './components/sections/LandingHero';
import { LandingFeatures } from './components/sections/LandingFeatures';
import { LandingHowItWorks } from './components/sections/LandingHowItWorks';
import { PricingGrid } from './components/sections/PricingGrid';
import { LandingFAQ } from './components/sections/LandingFAQ';
import { LandingStats } from './components/sections/LandingStats';
import { LandingTestimonials } from './components/sections/LandingTestimonials';
import { 
  AboutPage, 
  ServicesPage, 
  ContactPage, 
  BlogPage, 
  HelpCenterPage 
} from './pages/PublicPages';
import { AuthPages } from './pages/AuthPages';
import { InsurePage } from './pages/InsurePage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Coins, CheckCircle, XCircle } from 'lucide-react';

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) {
    return <AuthPages type="login" />;
  }
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user || (user.role !== 'admin' && user.role !== 'support_agent')) {
    return <AuthPages type="admin-login" />;
  }
  return <>{children}</>;
}

function MainLayout() {
  const { activeView, navigate, refreshData } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [showMockCheckout, setShowMockCheckout] = useState(false);
  const [mockDetails, setMockDetails] = useState<any>(null);

  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
      navigate('admin');
    }

    const params = new URLSearchParams(window.location.search);
    const mockCheckout = params.get('mock_checkout');
    const paystackVerify = params.get('paystack_verify');

    if (mockCheckout) {
      setShowMockCheckout(true);
      setMockDetails({
        reference: params.get('reference'),
        amount: params.get('amount') || '20',
        subId: params.get('subId'),
        userId: params.get('userId'),
        planId: params.get('planId') || 'basic-plan'
      });
    } else if (paystackVerify) {
      // Genuine payment call back check
      const reference = params.get('reference') || params.get('trxref') || '';
      const subId = params.get('sub_id') || params.get('subId');
      const userId = params.get('user_id') || params.get('userId');
      const planId = params.get('plan_id') || params.get('planId');
      const amount = params.get('amount') || '20';

      if (subId && userId) {
        setVerifying(true);
        fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference,
            userId,
            subscriptionId: subId,
            planId,
            amount,
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              refreshData();
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('dashboard');
            } else {
              alert('Paystack secure verification rejected this transaction.');
            }
          })
          .catch(err => {
            console.error('Verify endpoint fetch failed', err);
          })
          .finally(() => {
            setVerifying(false);
          });
      }
    }
  }, []);

  const handleSimulatePayment = async (success: boolean) => {
    if (!mockDetails) return;
    setVerifying(true);
    setShowMockCheckout(false);

    if (success) {
      try {
        const resp = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: mockDetails.reference,
            userId: mockDetails.userId,
            subscriptionId: mockDetails.subId,
            planId: mockDetails.planId,
            amount: mockDetails.amount
          })
        });

        if (resp.ok) {
          const body = await resp.json();
          if (body.success) {
            // Update local client cache of database and notify
            dbService.createNotification(
              mockDetails.userId,
              'Shield Cover ACTIVE',
              `Payment verification checked green under test transaction reference: ${mockDetails.reference}`,
              'success'
            );
            refreshData();
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('dashboard');
            setVerifying(false);
            return;
          }
        }
      } catch (err) {
        console.error("Simulation error", err);
      }
    }

    // Cancel / Exit
    setVerifying(false);
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate('pricing');
  };

  const renderView = () => {
    switch (activeView) {
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <LandingHero />
            <LandingHowItWorks />
            <LandingFeatures />
            <PricingGrid />
            <LandingStats />
            <LandingTestimonials />
            <LandingFAQ />
          </motion.div>
        );
      
      case 'about':
        return (
          <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AboutPage />
          </motion.div>
        );

      case 'services':
        return (
          <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ServicesPage />
          </motion.div>
        );

      case 'pricing':
        return (
          <motion.div key="pricing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PricingGrid />
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ContactPage />
          </motion.div>
        );

      case 'blog':
        return (
          <motion.div key="blog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BlogPage />
          </motion.div>
        );

      case 'help-center':
        return (
          <motion.div key="help-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <HelpCenterPage />
          </motion.div>
        );

      case 'login':
        return (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuthPages type="login" />
          </motion.div>
        );

      case 'register':
        return (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InsurePage />
          </motion.div>
        );

      case 'forgot-password':
        return (
          <motion.div key="forgot-password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuthPages type="forgot-password" />
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DashboardGuard>
              <StudentDashboard />
            </DashboardGuard>
          </motion.div>
        );

      case 'admin':
        return (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          </motion.div>
        );

      default:
        return (
          <div className="py-20 text-center text-xs text-slate-500 font-mono select-none">
            Error: Workspace navigation routing breach.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800 antialiased font-sans select-none">
      <Navbar />
      
      {/* Immersive secure payment loading portal */}
      {verifying && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[99999] flex flex-col items-center justify-center text-white">
          <div className="p-8 bg-slate-800 border border-slate-700 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-royal/25 rounded-2xl flex items-center justify-center text-royal mx-auto animate-pulse">
              <Shield className="w-8 h-8 flex-shrink-0 animate-spin" />
            </div>
            <h3 className="text-sm font-bold tracking-tight">Verifying Cover Security</h3>
            <p className="text-[11px] text-slate-400">
              Querying Paystack secure transaction nodes. Securing device allocation tokens on Supabase schema...
            </p>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-royal w-2/3 animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* Simulated Paystack interactive sandbox gateway */}
      {showMockCheckout && mockDetails && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-sm w-full overflow-hidden text-left select-none">
            <div className="p-5.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-lg flex items-center justify-center text-white font-black text-sm">
                  P
                </div>
                <div>
                  <h3 className="text-xs font-bold text-navy block font-sans">paystack checkout</h3>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold block font-mono">Test Sandbox Gateway</span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-royal">GH₵{mockDetails.amount}.00</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage Class:</span>
                  <span className="font-bold text-navy">{mockDetails.planId === 'premium-plan' ? 'Premium Shield Cover' : 'Basic Cover Plan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Simulated Ref ID:</span>
                  <span className="font-bold text-navy font-mono">{mockDetails.reference}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-500 text-center">
                  Select transaction resolution below to verify backend action logging and dashboard activation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSimulatePayment(true)}
                  className="py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Authorize Success</span>
                </button>
                <button
                  onClick={() => handleSimulatePayment(false)}
                  className="py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
