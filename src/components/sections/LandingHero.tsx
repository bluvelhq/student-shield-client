/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, Zap, HelpCircle, MapPin, CreditCard, Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundRippleEffect } from '../ui/background-ripple-effect';
// @ts-expect-error - png asset loaded via vite builder proxy
import heroImage from '../../assets/images/LADY WITH BACKROUND.png';

export const LandingHero: React.FC = () => {
  const { navigate, user } = useApp();
  const [scanActive, setScanActive] = useState(true);
  const [livePulse, setLivePulse] = useState(72);
  const [demoTab, setDemoTab] = useState<'overview' | 'diagnostics' | 'tickets'>('overview');

  // Interactive local simulation inside live laptop screen
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setLivePulse((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next < 60 ? 60 : next > 99 ? 99 : next;
      });
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleScrollToPlans = () => {
    const el = document.getElementById('coverage-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="relative bg-white text-[#00183D] pt-32 pb-0 overflow-hidden select-none">
      
      {/* Background Ripple Effect - only Home Hero and About Hero */}
      <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-auto z-0 overflow-hidden [--cell-border-color:rgba(37,99,235,0.15)] [--cell-fill-color:rgba(37,99,235,0.005)]">
        <BackgroundRippleEffect rows={12} cols={35} cellSize={60} />
      </div>

      {/* Decorative fine circuit lines removed to let the ripple grid shine nicely without clashing */}


      {/* Primary Container Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Clean typography and CTAs */}
          <div className="lg:col-span-6 space-y-10 text-left max-w-2xl lg:max-w-none mx-auto lg:mx-0">
            
            {/* Soft modern upper Pill badge */}
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="inline-flex items-center space-x-2 bg-royal/10 border border-royal/20 rounded-full px-4 py-2 text-[11px] text-royal font-heading font-semibold uppercase tracking-wide"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse" />
              <span>Now Active on Campus</span>
            </motion.div>

            {/* High impact Headline with improved typography */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-[#00183D] leading-[1.05] selection:bg-royal/35"
              >
                Your Laptop <br />
                Protected.<br />
                Your Studies <span className="text-royal">Secured.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed font-body font-light"
              >
                For as little as GH₵ 20 per semester, get unlimited software fixes, OS reinstalls, virus removal and more — right on campus. Zero consultation fees. Zero hidden charges.
              </motion.p>
            </div>

            {/* CTA Option buttons pairing */}
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.5 }}
               className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => navigate(user ? 'dashboard' : 'register')}
                className="px-8 py-4 text-base font-heading font-semibold rounded-full bg-royal hover:bg-royal/90 text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2.5 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <Shield className="w-5 h-5 text-white" />
                <span>Get Started</span>
              </button>
              
              <button
                onClick={handleScrollToPlans}
                className="px-8 py-4 text-base font-heading font-semibold rounded-full bg-transparent border-2 border-slate-300 text-slate-700 hover:border-royal hover:text-royal transition-all flex items-center space-x-2.5 cursor-pointer"
              >
                <span>View Demo</span>
              </button>
            </motion.div>

            {/* Stats row with improved spacing */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200/40"
            >
              <div>
                <span className="block text-3xl sm:text-4xl font-heading font-bold text-[#00183D]">GH₵20</span>
                <span className="block text-sm text-slate-500 font-body font-medium mt-2 leading-tight">Starting per semester</span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-heading font-bold text-[#00183D]">24hr</span>
                <span className="block text-sm text-slate-500 font-body font-medium mt-2 leading-tight">Max turnaround</span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-heading font-bold text-royal">Free</span>
                <span className="block text-sm text-slate-500 font-body font-medium mt-2 leading-tight">All consultations</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Hero Image */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
            <motion.img 
              src={heroImage} 
              alt="Student Shield Member" 
              referrerPolicy="no-referrer"
              className="w-full max-w-md h-auto object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

        </div>
      </div>

      {/* Full-width white support items bar directly below the main dark Hero row */}
      <div className="bg-white border-y border-slate-200/50 py-5 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-x-6 gap-y-3.5 text-slate-600 text-[10px] font-bold font-mono uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <span className="text-royal"><HelpCircle className="w-4 h-4" /></span>
              <span>No consultation fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-royal"><Zap className="w-4 h-4" /></span>
              <span>Same-day software fixes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-golden"><MapPin className="w-4 h-4" /></span>
              <span>We come to your hostel</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-golden"><CreditCard className="w-4 h-4" /></span>
              <span>MoMo & Telecel Cash</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-royal"><Clock className="w-4 h-4" /></span>
              <span>Unlimited support</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
