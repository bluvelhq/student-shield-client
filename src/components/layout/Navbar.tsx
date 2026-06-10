/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, Menu, X, PanelsTopLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLogo } from '../ui/AppLogo';

export const Navbar: React.FC = () => {
  const { activeView, navigate, user, profile, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Active section tracker for the landing/home page sections
  const [activeSection, setActiveSection] = useState<'home' | 'how-it-works' | 'coverage-plans' | 'faq' | null>('home');

  useEffect(() => {
    const handleScrollTransition = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past top offset for sticky glass appearance
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener('scroll', handleScrollTransition, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollTransition);
    };
  }, []);

  // Track active section element visible offset on scroll (for landing view)
  useEffect(() => {
    if (activeView !== 'landing') {
      setActiveSection(null);
      return;
    }

    const handleScrollSection = () => {
      const scrollPosition = window.scrollY + 200; // offset trigger trigger

      const sections = [
        { id: 'home', value: 'home' },
        { id: 'how-it-works', value: 'how-it-works' },
        { id: 'coverage-plans', value: 'coverage-plans' },
        { id: 'faq', value: 'faq' }
      ] as const;

      let found = false;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.value);
            found = true;
            break;
          }
        }
      }

      if (!found && window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScrollSection, { passive: true });
    handleScrollSection(); // run immediately on render
    
    return () => window.removeEventListener('scroll', handleScrollSection);
  }, [activeView]);

  const navLinks = [
    { label: 'Home', view: 'landing', targetId: 'home' },
    { label: 'About', view: 'about' },
    { label: 'How It Works', view: 'landing', targetId: 'how-it-works' },
    { label: 'Plans', view: 'landing', targetId: 'coverage-plans' },
    { label: 'FAQ', view: 'landing', targetId: 'faq' },
    { label: 'Contact', view: 'contact' },
    { label: 'My Coverage', view: 'dashboard' },
  ];

  const handleLinkClick = (view: string, targetId?: string) => {
    if (view === 'landing') {
      navigate('landing');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (view === 'dashboard' && !user) {
        navigate('login');
      } else {
        navigate(view);
      }
    }
    setMobileMenuOpen(false);
  };

  // Determine navbar styles based on active scroll state and route view
  const isMainPage = ['landing', 'about', 'contact'].includes(activeView);
  const isDarkBg = isScrolled || (!isMainPage);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-sans select-none pointer-events-none flex flex-col items-center w-full">
      <motion.div
        animate={{
          width: (isScrolled || !isMainPage) ? "85%" : "100%",
          y: 0, // Keep navbar flush at the very top of the window as requested (stay at the top)
          borderRadius: (isScrolled || !isMainPage) ? "0px 0px 20px 20px" : "0px", // Aesthetic bottom-only rounded corners when scrolled/pill shape
          backgroundColor: (isScrolled || !isMainPage) ? "rgba(0, 24, 61, 0.95)" : "transparent",
          boxShadow: (isScrolled || !isMainPage) ? "0 10px 30px -5px rgba(0, 0, 0, 0.4)" : "none",
          borderColor: (isScrolled || !isMainPage) ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0)",
          backdropFilter: (isScrolled || !isMainPage) ? "blur(12px)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 35,
        }}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        className="w-full max-w-7xl px-6 pointer-events-auto h-16 flex items-center justify-between transition-all duration-300 relative"
      >
        
        {/* Brand Logo with Geometric 'S' emblem */}
        <div 
          onClick={() => handleLinkClick('landing')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none group focus:outline-none"
          id="nav-logo"
        >
          <AppLogo textColor={isDarkBg ? 'text-white' : 'text-navy'} />
        </div>

        {/* Desktop Navigation (Minimalist Navigation Links with Aceternity-inspired background pill hover) */}
        <div 
          onMouseLeave={() => setHoveredIndex(null)}
          className="hidden md:flex space-x-1 items-center font-bold text-xs tracking-wide relative"
        >
          {navLinks.map((link, idx) => {
            const active = activeView === link.view && (
              link.view !== 'landing' || 
              (link.targetId ? activeSection === link.targetId : activeSection === 'home')
            );
            return (
              <button
                key={link.label}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => handleLinkClick(link.view, link.targetId)}
                className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer relative ${
                  active 
                    ? 'text-royal font-extrabold shadow-sm bg-white/5' 
                    : isDarkBg 
                      ? 'text-white/85 hover:text-white' 
                      : 'text-navy hover:text-royal'
                }`}
              >
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navHover"
                    className={`absolute inset-0 h-full w-full rounded-full -z-10 ${
                      isDarkBg ? 'bg-white/10' : 'bg-[#e2e8f0]'
                    }`}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3.5">
              {(user.role === 'admin' || user.role === 'support_agent') && (
                <button
                  onClick={() => handleLinkClick('admin')}
                  className="flex items-center space-x-2 text-xs font-bold px-4.5 py-2 rounded-none transition-all bg-royal text-white hover:bg-royal/90 cursor-pointer"
                >
                  <PanelsTopLeft className="w-3.5 h-3.5" />
                  <span>{user.role === 'admin' ? 'Admin Portal' : 'Support Desk'}</span>
                </button>
              )}

              <div className={`flex items-center space-x-2 px-2 py-1 rounded-none border transition-all duration-350 ${isDarkBg ? 'bg-white/5 border-white/10' : 'bg-slate-100/80 border-slate-200'}`}>
                <div className="h-6 w-6 rounded-none overflow-hidden border border-royal/30">
                  <img 
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button 
                  onClick={logout}
                  title="Sign Out"
                  className={`p-1 px-2 text-[10px] font-bold transition-colors duration-350 cursor-pointer ${isDarkBg ? 'text-slate-300 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
                >
                  Exit
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleLinkClick('register')}
                className="py-2.5 px-6 text-xs font-bold rounded-none bg-royal text-white transition-all hover:scale-[1.02] cursor-pointer"
              >
                Get Shielded
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-none transition-colors ${isDarkBg ? 'text-white hover:bg-white/5' : 'text-navy hover:bg-navy/5'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-white/10 rounded-2xl mx-auto w-[90%] bg-navy/95 backdrop-blur-md overflow-hidden pointer-events-auto shadow-2xl mt-3"
          >
            <div className="px-4 pt-3 pb-6 space-y-3.5 text-left">
              {navLinks.map((link) => {
                const active = activeView === link.view && (
                  link.view !== 'landing' || 
                  (link.targetId ? activeSection === link.targetId : activeSection === 'home')
                );
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.view, link.targetId)}
                    className={`block w-full text-left py-2 px-3 rounded-none text-sm transition-colors hover:bg-white/5 ${
                      active ? 'text-royal font-bold bg-white/5' : 'text-white/85 hover:text-white font-medium'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/5 flex flex-col space-y-2.5">
                {user ? (
                  <>
                    {(user.role === 'admin' || user.role === 'support_agent') && (
                      <button
                        onClick={() => handleLinkClick('admin')}
                        className="flex items-center justify-center space-x-2 py-2.5 px-4 text-sm font-semibold rounded-none bg-royal text-white text-center"
                      >
                        <PanelsTopLeft className="w-4 h-4" />
                        <span>{user.role === 'admin' ? 'Admin Portal' : 'Support Desk'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 py-2 px-4 text-xs font-semibold rounded-none text-red-400 hover:bg-red-400/10 w-full"
                    >
                      <span>Log Out ($ {user.email})</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleLinkClick('register')}
                      className="flex items-center justify-center space-x-1.5 py-3 px-4 text-sm font-semibold text-center rounded-none bg-royal text-white w-full"
                    >
                      <span>Get Shielded</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
