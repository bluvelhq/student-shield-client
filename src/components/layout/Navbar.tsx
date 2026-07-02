/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { LogOut, Menu, X, PanelsTopLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppLogo } from "../ui/AppLogo";

export const Navbar: React.FC = () => {
  const { activeView, navigate, user, profile, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Active section tracker for the landing/home page sections
  const [activeSection, setActiveSection] = useState<
    "home" | "how-it-works" | "coverage-plans" | "faq" | null
  >("home");

  useEffect(() => {
    const handleScrollTransition = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled past top offset for sticky glass appearance
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener("scroll", handleScrollTransition, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScrollTransition);
    };
  }, []);

  // Track active section element visible offset on scroll (for landing view)
  useEffect(() => {
    if (activeView !== "landing") {
      setActiveSection(null);
      return;
    }

    const handleScrollSection = () => {
      const scrollPosition = window.scrollY + 200; // offset trigger trigger

      const sections = [
        { id: "home", value: "home" },
        { id: "how-it-works", value: "how-it-works" },
        { id: "coverage-plans", value: "coverage-plans" },
        { id: "faq", value: "faq" },
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
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScrollSection, { passive: true });
    handleScrollSection(); // run immediately on render

    return () => window.removeEventListener("scroll", handleScrollSection);
  }, [activeView]);

  interface NavLink {
    label: string;
    view: string;
    targetId?: string;
  }

  const navLinks: NavLink[] = [
    { label: "Home", view: "landing" },
    { label: "About", view: "about" },
    { label: "How It Works", view: "how-it-works" },
    { label: "Plans", view: "plans" },
    { label: "FAQ", view: "faq" },
    { label: "Contact", view: "contact" },
  ];

  const handleLinkClick = (view: string, targetId?: string) => {
    if (view === "landing") {
      navigate("landing");
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (view === "dashboard" && !user) {
        navigate("login");
      } else {
        navigate(view);
      }
    }
    setMobileMenuOpen(false);
  };

  // Determine navbar styles based on active scroll state and route view
  const isMainPage = [
    "landing",
    "about",
    "contact",
    "how-it-works",
    "plans",
    "faq",
    "services",
    "blog",
    "help-center"
  ].includes(activeView);
  const isDarkBg = isScrolled || !isMainPage;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-sans select-none pointer-events-none flex flex-col items-center w-full">
      <motion.div
        animate={{
          width: isScrolled || !isMainPage ? "90%" : "100%",
          y: isScrolled || !isMainPage ? 12 : 0,
          borderRadius: isScrolled || !isMainPage ? "9999px" : "0px", // Modern capsule rounded corner style!
          backgroundColor:
            isScrolled || !isMainPage
              ? "rgba(15, 23, 42, 0.85)"
              : "transparent", // slate-900 transparent glassmorphic look
          boxShadow:
            isScrolled || !isMainPage
              ? "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08)"
              : "none",
          borderColor:
            isScrolled || !isMainPage
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(255, 255, 255, 0)",
          backdropFilter: isScrolled || !isMainPage ? "blur(16px)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 28,
        }}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        className="w-full max-w-6xl px-6 pointer-events-auto h-16 flex items-center justify-between transition-all duration-300 relative"
      >
        {/* Brand Logo with Geometric 'S' emblem */}
        <div
          onClick={() => handleLinkClick("landing")}
          className="flex items-center space-x-2.5 cursor-pointer select-none group focus:outline-none"
          id="nav-logo"
        >
          <AppLogo textColor={isDarkBg ? "text-white" : "text-navy"} />
        </div>

        {/* Desktop Navigation (Minimalist Navigation Links with Aceternity-inspired background pill hover) */}
        <div
          onMouseLeave={() => setHoveredIndex(null)}
          className="hidden md:flex space-x-1 items-center font-semibold text-[13px] tracking-normal relative"
        >
          {navLinks.map((link, idx) => {
            const active =
              activeView === link.view &&
              (link.view !== "landing" ||
                (link.targetId
                  ? activeSection === link.targetId
                  : activeSection === "home"));
            return (
              <button
                key={link.label}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => handleLinkClick(link.view, link.targetId)}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer relative ${
                  active
                    ? isDarkBg
                      ? "text-white font-bold bg-white/10 shadow-sm"
                      : "text-royal font-bold bg-royal/5 shadow-sm"
                    : isDarkBg
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navHover"
                    className={`absolute inset-0 h-full w-full rounded-full -z-10 ${
                      isDarkBg ? "bg-white/8" : "bg-slate-100"
                    }`}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {(user.role === "admin" || user.role === "support_agent") && (
                <button
                  onClick={() => handleLinkClick("admin")}
                  className="flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full transition-all bg-royal text-white hover:bg-royal/90 shadow-md shadow-royal/10 hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
                >
                  <PanelsTopLeft className="w-3.5 h-3.5" />
                  <span>{user.role === "admin" ? "Admin" : "Support"}</span>
                </button>
              )}

              <div
                className={`flex items-center space-x-2.5 px-2.5 py-1 rounded-full border transition-all duration-350 ${isDarkBg ? "bg-white/10 border-white/10 hover:bg-white/15" : "bg-slate-100 border-slate-200 hover:bg-slate-200/70"} cursor-pointer`}
              >
                <div className="h-6 w-6 rounded-full overflow-hidden border border-royal/30">
                  <img
                    src={
                      profile?.avatar_url ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                    }
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className={`p-1 px-1.5 text-[10px] font-semibold transition-colors duration-350 cursor-pointer ${isDarkBg ? "text-slate-400 hover:text-red-400" : "text-slate-500 hover:text-red-500"}`}
                >
                  Exit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => handleLinkClick("login")}
                className={`py-2 px-4.5 text-xs font-bold rounded-full border transition-all hover:-translate-y-[1px] active:translate-y-0 cursor-pointer ${
                  isDarkBg
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-200 text-navy hover:bg-slate-50"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleLinkClick("register")}
                className="py-2 px-5 text-xs font-bold rounded-full bg-gradient-to-r from-royal to-blue-600 text-white shadow-lg shadow-royal/20 transition-all hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
              >
                Get Shielded
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-none transition-colors ${isDarkBg ? "text-white hover:bg-white/5" : "text-navy hover:bg-navy/5"}`}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-white/10 rounded-2xl mx-auto w-[90%] bg-navy/95 backdrop-blur-md overflow-hidden pointer-events-auto shadow-2xl mt-3"
          >
            <div className="px-4 pt-3 pb-6 space-y-3.5 text-left">
              {navLinks.map((link) => {
                const active =
                  activeView === link.view &&
                  (link.view !== "landing" ||
                    (link.targetId
                      ? activeSection === link.targetId
                      : activeSection === "home"));
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.view, link.targetId)}
                    className={`block w-full text-left py-2 px-3 rounded-none text-sm transition-colors hover:bg-white/5 ${
                      active
                        ? "text-royal font-bold bg-white/5"
                        : "text-white/85 hover:text-white font-medium"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/5 flex flex-col space-y-2.5">
                {user ? (
                  <>
                    {(user.role === "admin" ||
                      user.role === "support_agent") && (
                      <button
                        onClick={() => handleLinkClick("admin")}
                        className="flex items-center justify-center space-x-2 py-2.5 px-4 text-sm font-semibold rounded-none bg-royal text-white text-center"
                      >
                        <PanelsTopLeft className="w-4 h-4" />
                        <span>
                          {user.role === "admin"
                            ? "Admin Portal"
                            : "Support Desk"}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 py-2 px-4 text-xs font-semibold rounded-none text-red-400 hover:bg-red-400/10 w-full"
                    >
                      <span>Log Out ({user.email})</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2.5 w-full">
                    <button
                      onClick={() => handleLinkClick("login")}
                      className="flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-center rounded-none border border-white/20 text-white hover:bg-white/5 w-full cursor-pointer"
                    >
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick("register")}
                      className="flex items-center justify-center space-x-1.5 py-3 px-4 text-sm font-semibold text-center rounded-none bg-royal text-white w-full cursor-pointer"
                    >
                      <span>Get Shielded</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
