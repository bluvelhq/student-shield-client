/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Send, CheckCircle } from 'lucide-react';
import { AppLogo } from '../ui/AppLogo';

export const Footer: React.FC = () => {
  const { navigate } = useApp();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleLinkClick = (view: string, targetId?: string) => {
    if (view === 'landing' && targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('landing');
        setTimeout(() => {
          const target = document.getElementById(targetId);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(view);
    }
  };

  return (
    <footer className="bg-[#00183D] text-white pt-16 pb-8 border-t border-white/10 selection:bg-royal selection:text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
          
          {/* Brand Info */}
          <div className="space-y-4 font-sans">
            <AppLogo size="sm" textColor="text-white" />
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Affordable laptop insurance and tech support built for university students across Ghana.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-6 font-sans">
              COMPANY
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400 font-sans">
              <li>
                <button 
                  onClick={() => handleLinkClick('landing', 'home')} 
                  className="hover:text-royal transition-colors text-left block"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('about')} 
                  className="hover:text-royal transition-colors text-left block"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('plans')} 
                  className="hover:text-royal transition-colors text-left block"
                >
                  Plans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('faq')} 
                  className="hover:text-royal transition-colors text-left block"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-6 font-sans">
              CONTACT
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400 font-sans">
              <li>
                <a 
                  href="mailto:info@bluvelhq.com" 
                  className="hover:text-royal transition-colors text-left block"
                >
                  info@bluvelhq.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/233593705543" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-royal transition-colors text-left block"
                >
                  WhatsApp Support (0593705543)
                </a>
              </li>
              <li>
                <div className="text-left text-slate-400 block">
                  <span className="font-bold text-white block">Working Days:</span>
                  <span>Monday - Saturday</span>
                </div>
              </li>
              <li>
                <div className="text-left text-slate-400 block">
                  <span className="font-bold text-white block">Working Hours:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase font-sans">
              Subscribe to Stay Updated
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Subscribe to get virus warnings, software discounts, and diagnostic bulletins.
            </p>

            <form onSubmit={handleSubscribe} className="flex space-x-2 font-sans">
              <input
                type="email"
                placeholder="school@email.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs bg-[#001335] border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-royal transition-colors"
              />
              <button 
                type="submit" 
                className="bg-royal hover:bg-royal/90 text-white rounded-none px-3 py-2 flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-royal flex items-center space-x-1 font-sans">
                <CheckCircle className="w-3 h-3 flex-shrink-0" />
                <span>Successfully subscribed! Check your school box.</span>
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-sans">
          <p>© 2026 StudentShield. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button onClick={() => navigate('pricing')} className="hover:text-royal transition-colors">Semester License Rules</button>
            <span>•</span>
            <button onClick={() => navigate('about')} className="hover:text-royal transition-colors">Privacy Principles</button>
            <span>•</span>
            <button onClick={() => navigate('service-agreement')} className="hover:text-royal transition-colors">Service Agreement</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
