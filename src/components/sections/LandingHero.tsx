/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, Cpu, ChevronRight, CheckCircle2, Zap, 
  Laptop, Activity, Sliders, Play, Phone, HelpCircle, 
  Settings, Layers, Clock, Check, MapPin, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundRippleEffect } from '../ui/background-ripple-effect';
// @ts-expect-error - png asset loaded via vite builder proxy
import ladyImage from '../../assets/images/studentshield_lady_1779840235585.png';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Clean typography and CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left max-w-2xl lg:max-w-none mx-auto lg:mx-0">
            
            {/* Soft modern upper Pill badge */}
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="inline-flex items-center space-x-2 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-none px-3 py-1.5 text-[10px] text-royal font-extrabold uppercase tracking-widest font-mono"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse" />
              <span>NOW ACTIVE ON CAMPUS</span>
            </motion.div>

            {/* High impact Headline exactly matching layout logic */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#00183D] leading-[1.1] selection:bg-royal/35"
              >
                Your Laptop <br />
                Protected.<br />
                Your Studies <span className="text-royal">Secured.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xs sm:text-sm text-slate-555 max-w-lg leading-relaxed font-semibold"
              >
                For as little as GH₵ 10 per semester, get unlimited software fixes, OS reinstalls, virus removal and more — right on campus. Zero consultation fees. Zero hidden charges.
              </motion.p>
            </div>

            {/* CTA Option buttons pairing */}
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.5 }}
               className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate(user ? 'dashboard' : 'register')}
                className="px-7 py-3.5 text-[11px] font-extrabold rounded-none bg-royal hover:bg-royal/90 text-white tracking-widest uppercase transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center space-x-2 cursor-pointer shadow-none"
              >
                <Shield className="w-4 h-4 text-white" />
                <span>Insure My Laptop</span>
              </button>
              
              <button
                onClick={handleScrollToPlans}
                className="px-6 py-3.5 text-[11px] font-extrabold rounded-none bg-transparent border border-slate-200 text-slate-700 hover:border-royal/40 hover:text-royal tracking-widest uppercase transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>View Plans</span>
              </button>
            </motion.div>

            {/* Stats row from image */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60"
            >
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#00183D] font-sans">GH₵10</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1 leading-tight font-mono">Starting per semester</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#00183D] font-sans">24hr</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1 leading-tight font-mono">Max turnaround</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#00183D] font-sans">Free</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1 leading-tight font-mono">All consultations</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Angled layout laptop with floating items */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end py-12 lg:py-0">
            
            {/* Visual halo glow behind laptop removed */}

            {/* IMAGE CONTAINER WITH FLOATING DESIGN BUBBLES */}
            <div className="relative z-10 w-full max-w-[500px] h-auto select-none flex justify-center items-center">
              
              <motion.img 
                src={ladyImage} 
                alt="Student Shield Member" 
                referrerPolicy="no-referrer"
                className="w-full max-w-[420px] sm:max-w-[450px] h-auto object-contain relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* 5 FLOATING DESIGN BUBBLES - ROUNDED CORNERS, FLOATING AROUND THE LADY */}

              {/* Bubble 1: Top Right User Avatar Box */}
              <div className="absolute -top-6 -right-2 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-3xl p-2.5 flex items-center space-x-2 animate-bounce z-20" style={{ animationDuration: '4s' }}>
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" className="w-8 h-8 rounded-full border border-royal object-cover flex-shrink-0" alt="Student" referrerPolicy="no-referrer" />
                <div className="text-left">
                  <span className="block text-[9.5px] font-bold text-slate-900 leading-none font-sans">Hamida J.</span>
                  <span className="block text-[7.5px] text-slate-400 font-extrabold font-mono tracking-wider mt-0.5">LEGON Gold Member</span>
                </div>
              </div>

              {/* Bubble 2: Middle Right green validation/claim badge */}
              <div className="absolute top-1/4 -right-8 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-full p-2 flex items-center justify-center text-emerald-500 animate-pulse z-20">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Bubble 3: Bottom Right claims speed clock SLA */}
              <div className="absolute -bottom-4 -right-2 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-3xl p-2.5 flex items-center space-x-2.5 animate-bounce z-20" style={{ animationDuration: '5s' }}>
                <div className="w-6 h-6 rounded-full bg-blue-50 text-royal border border-blue-100 flex items-center justify-center font-bold">
                  ⏱
                </div>
                <div className="text-left">
                  <span className="block text-[8.5px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Turnaround SLA</span>
                  <span className="block text-[10px] font-extrabold text-royal leading-none mt-0.5">Under 2 Hours Max</span>
                </div>
              </div>

              {/* Bubble 4: Left Centered Activity gear bubble */}
              <div className="absolute top-1/3 -left-6 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-full p-2.5 flex items-center justify-center text-royal animate-bounce z-20" style={{ animationDuration: '4.5s' }}>
                <div className="w-8 h-8 rounded-full bg-royal/5 flex items-center justify-center border border-royal/10">
                  <Sliders className="w-4 h-4 text-royal" />
                </div>
              </div>

              {/* Bubble 5: Bottom Left Shield optimized badge */}
              <div className="absolute -bottom-2 -left-4 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-full p-2 flex items-center space-x-2 text-left animate-pulse z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-feed flex-shrink-0" />
                <span className="text-[8.5px] font-extrabold text-slate-600 uppercase font-mono tracking-wider">Laptop Shield ACTIVE</span>
              </div>

            </div>

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
              <span className="text-[#FFC500]"><MapPin className="w-4 h-4" /></span>
              <span>We come to your hostel</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#FFC500]"><CreditCard className="w-4 h-4" /></span>
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
