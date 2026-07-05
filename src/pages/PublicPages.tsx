/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Building2,
  Users2,
  ShieldAlert,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  Search,
  BookOpen,
  Compass,
  ExternalLink,
  ThumbsUp,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Shield,
  Lock,
  Cpu,
  Linkedin,
  Instagram,
  Twitter,
  CreditCard,
  Heart,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost, FAQ } from "../types";
import { BackgroundRippleEffect } from "../components/ui/background-ripple-effect";
import { CometCard } from "../components/ui/comet-card";
// @ts-expect-error - png asset loaded via vite builder
import studentshieldLady from "../assets/images/LADY WITH BACKROUND.png";
// @ts-expect-error - png asset loaded via vite builder
import officeSuite3 from "../assets/images/OFFICE SUIT 3.png";
// @ts-expect-error - jpg asset loaded via vite builder
import hoodieDesign from "../assets/images/hoodie-DESIGN.jpg";
// @ts-expect-error - png asset loaded via vite builder
import shirtDesign from "../assets/images/SHIRT.png";
// @ts-expect-error - jpg asset loaded via vite builder
import tableDesign from "../assets/images/TABLE DESIGN.jpg";
// @ts-expect-error - jpg asset loaded via vite builder
import dicksonImg from "../assets/images/dickson_img.jpeg";

const teamAvatarPlaceholder =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80";

// =========================================================================
// ABOUT PAGE
// =========================================================================
export const AboutPage: React.FC = () => {
  const team = [
    {
      name: "Derrick Boateng",
      role: "Founder & Chief Executive Officer",
      bio: "On a mission to redefine device reliability and structural peace of mind for Uni students and beyond",
      avatar: officeSuite3,
      imgPosition: "center top",
      socials: {
        linkedin: "https://www.linkedin.com/in/derrick-boateng-696263276/",
        instagram: "https://www.instagram.com/derryblinks_graphics/",
        twitter: "https://x.com/Derrick34474451",
      },
    },
    {
      name: "Dickson Peprah",
      role: "Co-Founder & Chief Operations Officer",
      bio: "On a mission to redefine device reliability and structural peace of mind for Uni students and beyond",
      avatar: dicksonImg,
      imgPosition: "center 20%",
      socials: {
        linkedin: "https://www.linkedin.com/in/dickson-daniel-peprah-69a409305",
        instagram: "https://www.instagram.com/dickson_peprah",
        twitter: "https://twitter.com/dickson_peprah",
      },
    },
  ];

  return (
    <div className="selection:bg-royal selection:text-white bg-white font-sans min-h-screen text-slate-800 pb-20 overflow-hidden leading-relaxed">
      {/* 1. HERO GRADIENT HEADER - Clean White Block with interactive background grid matching Home Page */}
      <div className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 text-center text-[#00183D]">
        {/* Background Ripple Effect - only Home Hero and About Hero */}
        <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-auto z-0 overflow-hidden [--cell-border-color:rgba(37,99,235,0.15)] [--cell-fill-color:rgba(37,99,235,0.005)]">
          <BackgroundRippleEffect rows={10} cols={35} cellSize={60} />
        </div>

        {/* Glowing Gradient Orbs for Modern Feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[80%] bg-blue-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[70%] bg-indigo-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-3xl opacity-60 mix-blend-multiply" />
        </div>

        {/* Floating background decorative dots matches the styling */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-royal/40 animate-pulse pointer-events-none" />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-royal/30 animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/12 w-2 h-2 rounded-full bg-royal/40 pointer-events-none" />
        <div className="absolute top-1/3 right-12 w-2.5 h-2.5 rounded-full bg-royal/40 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5 select-none text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-royal/10 to-blue-600/10 border border-royal/20 rounded-full px-4 py-1.5 text-[10px] text-royal font-bold uppercase tracking-widest font-mono shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            <span>OUR BRAND & PURPOSE</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-[#00183D] via-[#003078] to-[#00183D] font-sans max-w-4xl mx-auto drop-shadow-sm"
          >
            Protecting Every Student's Academic Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-sans font-medium"
          >
            At StudentShield, we believe no student should have to miss
            deadlines, lectures, or opportunities because of a damaged or faulty
            device. We provide affordable laptop protection, fast support, and
            reliable repair solutions that help students stay focused on what
            matters most; their education.
          </motion.p>
        </div>
      </div>

      {/* Primary body section limits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* 2. OUR MISSION & OUR VISION SECTION – Centered Card Layout */}
        <div className="mb-24 text-center select-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-royal/5 to-royal/10 border border-royal/20 p-8 rounded-2xl space-y-4 hover:border-royal/40 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-royal/15 flex items-center justify-center mx-auto text-royal mb-2">
                <span className="text-lg font-bold">🎯</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#00183D] uppercase tracking-tight">
                Our Mission
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                To revolutionize campus device security by offering sustainable,
                efficient, and innovative protection solutions that make
                academic life effortless and technical peace of mind accessible
                to all.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-golden/5 to-golden/10 border border-golden/30 p-8 rounded-2xl space-y-4 hover:border-golden/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-golden/15 flex items-center justify-center mx-auto text-golden mb-2">
                <span className="text-lg font-bold">✨</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#00183D] uppercase tracking-tight">
                Our Vision
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                To be the leading provider of reliable, rapid-response device
                protection solutions on campuses worldwide, fostering
                tech-backed academic excellence and contributing to
                uninterrupted study and productivity.
              </p>
            </div>
          </div>
        </div>

        {/* 3. OUR VALUES SECTION */}
        <div className="mb-24 text-center">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-royal font-sans uppercase">
              OUR VALUES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* VALUE 1: AFFORDABILITY */}
            <div className="bg-white border border-slate-100 p-8 text-left rounded-2xl hover:border-royal/20 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer space-y-4">
              <div className="w-10 h-10 rounded-lg border border-royal/20 bg-royal/5 flex items-center justify-center text-royal">
                <CreditCard className="w-5 h-5 flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-[#00183D] font-sans tracking-tight">
                Affordability
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                We strive to break down cost barriers that prevent students from
                securing their high-value gear, making professional technical
                care accessible without any surprise fees.
              </p>
            </div>

            {/* VALUE 2: SAFETY */}
            <div className="bg-white border border-slate-100 p-8 text-left rounded-2xl hover:border-royal/20 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer space-y-4">
              <div className="w-10 h-10 rounded-lg border border-royal/20 bg-royal/5 flex items-center justify-center text-royal">
                <Shield className="w-5 h-5 flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-[#00183D] font-sans tracking-tight">
                Safety
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                We provide secure care with hardware diagnostics, safety audits,
                and coverage for ensuring devices stay operational and students
                stay unbothered.
              </p>
            </div>

            {/* VALUE 3: TECH CARE / DEVICE WELLNESS */}
            <div className="bg-white border border-slate-100 p-8 text-left rounded-2xl hover:border-royal/20 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer space-y-4">
              <div className="w-10 h-10 rounded-lg border border-royal/20 bg-royal/5 flex items-center justify-center text-royal">
                <Heart className="w-5 h-5 flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-[#00183D] font-sans tracking-tight">
                Device Wellness
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Integrate regular hardware checkups and thermal paste updates
                with your usual academic routines for instant device peak
                performance on the go.
              </p>
            </div>

            {/* VALUE 4: INNOVATION */}
            <div className="bg-white border border-slate-100 p-8 text-left rounded-2xl hover:border-royal/20 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer space-y-4">
              <div className="w-10 h-10 rounded-lg border border-royal/20 bg-royal/5 flex items-center justify-center text-royal">
                <Lightbulb className="w-5 h-5 flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-[#00183D] font-sans tracking-tight">
                Innovation
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                We are driven to provide instant access through custom campus
                hardware diagnostics, automated claim processing, and real-time
                physical support booths.
              </p>
            </div>
          </div>
        </div>

        {/* 4. STATS BANNER RIBBON - Border-t / border-b metric horizontal layout inspired by bottom left of image */}
        <div className="border-t border-b border-slate-200/60 py-10 mb-24 select-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3.5xl font-bold text-royal font-sans tracking-tight">
                98%+
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Student Resolution
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3.5xl font-bold text-royal font-sans tracking-tight">
                GH₵340+
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Average Savings
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3.5xl font-bold text-royal font-sans tracking-tight">
                500+
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Active Protections
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3.5xl font-bold text-royal font-sans tracking-tight">
                100%
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Grade Safe Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* 5. TEAM OF EXPERTS - Inspired by vertical big portraits right page top layout of uploaded image */}
        <div className="mb-24 text-center">
          <div className="max-w-3xl mx-auto mb-16 select-none space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-royal font-semibold bg-royal/5 px-3.5 py-1 text-center inline-block">
              OUR TEAMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-navy leading-none">
              Meet The Team Behind <br className="sm:hidden" /> Student Shield's
              Innovation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
              Our team works with experienced technicians to keep your devices
              protected and your academic journey uninterrupted
            </p>
          </div>

          {/* Grid matching Team arrangement with vertical highly cropped focus portraits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((t, idx) => (
              <CometCard key={idx} className="h-full">
                <div className="bg-white border border-slate-200/45 p-0 rounded-2xl overflow-hidden hover:border-royal transition-all text-left flex flex-col justify-between h-full bg-cover shadow-none hover:-translate-y-1.5 hover:shadow-2xl duration-350 cursor-pointer group">
                  {/* Large cropped image box inspired by the vertical profiles */}
                  <div className="w-full aspect-[4/5] bg-slate-50 border-b border-slate-200/30 overflow-hidden relative">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover filter brightness-95 transition-transform duration-500 group-hover:scale-105 group-hover:translate-y-[-2px]"
                      style={{ objectPosition: t.imgPosition || "center" }}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Typography info centered immediately below frame */}
                  <div className="p-6">
                    <h4 className="text-base font-bold text-navy tracking-tight leading-none mb-1 text-ellipsis overflow-hidden font-sans">
                      {t.name}
                    </h4>
                    <span className="text-[9px] text-royal font-bold uppercase tracking-widest">
                      {t.role}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-3 leading-snug font-medium border-t border-slate-100 pt-3">
                      {t.bio}
                    </p>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 select-none">
                      <a
                        href={(t as any).socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-royal transition-colors p-0.5"
                        onClick={(e) => e.stopPropagation()}
                        title={`${t.name}'s LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={(t as any).socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-royal transition-colors p-0.5"
                        onClick={(e) => e.stopPropagation()}
                        title={`${t.name}'s Instagram`}
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a
                        href={(t as any).socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-royal transition-colors p-0.5"
                        onClick={(e) => e.stopPropagation()}
                        title={`${t.name}'s Twitter`}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        </div>

        {/* BENTO GRID GALLERY BELOW TEAM */}
        <div className="mt-32 mb-24">
          <div className="max-w-3xl mx-auto mb-16 text-center select-none space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#2563EB] font-semibold bg-[#2563EB]/5 px-3.5 py-1 text-center inline-block">
              EXPLORE OUR SPACES
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#00183D] leading-none uppercase">
              STUDENT SHIELD BENTO HUBS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-semibold">
              A visual look into our campus support infrastructures, real-world
              workspace configurations, and physical booths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-[220px] select-none">
            {/* Card 1: Great Portrait of StudentShield Lady representing Main Tech Hub (col-span-1 lg:col-span-2, row-span-2) */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-100 col-span-1 md:col-span-2 row-span-2 shadow-none transition-all duration-300 bg-[#f8fafc] flex items-center justify-center">
              <img
                src={hoodieDesign}
                alt="StudentShield Hoodie Design"
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 2: Interactive Location/Booths Companion Picture (col-span-1, row-span-2) */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-100 col-span-1 row-span-2 shadow-none transition-all duration-300">
              <img
                src={officeSuite3}
                alt="Active Campus Community study session"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 3: Board Diagnostics focus close-up (col-span-1) */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-100 col-span-1 shadow-none transition-all duration-300 bg-[#f8fafc] flex items-center justify-center">
              <img
                src={shirtDesign}
                alt="StudentShield Shirt Design"
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 4: Collaborative Research Room (col-span-1 lg:col-span-2) */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-100 col-span-1 md:col-span-2 shadow-none transition-all duration-300">
              <img
                src={tableDesign}
                alt="StudentShield Table Design"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* 6. PARTNERS LOGOS - Inspired by the 'Trusted by Leading Financial Institutions' logos in paynext right */}
        {/* <div className="my-24 py-12 border-t border-b border-slate-100/80 text-center select-none">
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-8">
            TRUSTED BY CAMPUS STUDENT NETWORKS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-300">
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-navy/70">UG SRC</span>
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-navy/70">UG COMPUTER SCIENCE</span>
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-navy/70">UG LEGON LIBRARY</span>
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-navy/70">UG BUSINESS SCHOOL</span>
          </div>
        </div> */}

        {/* 7. HIGH IMPACT bottom CALL TO ACTION BANNER - Resembling paynext signature CTA widget */}
        <div className="bg-gradient-to-br from-[#00183D] to-[#04337a] text-white p-10 md:p-14 rounded-none text-left relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 select-none shadow-none">
          {/* Subtle light leaks and grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-royal/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left part */}
          <div className="max-w-2xl space-y-3.5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight font-sans">
              Let's Redefine <br />
              Campus Care Together
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-medium">
              Connect with us to start your secure academic journey today and
              eradicate digital downtime.
            </p>
            <div className="pt-2">
              <a
                href="/register"
                className="inline-flex py-3 px-6 text-xs font-bold text-navy bg-white hover:bg-slate-100 transition-all rounded-none cursor-pointer"
              >
                Get Shielded Now
              </a>
            </div>
          </div>

          {/* Right part - Office metadata address */}
          <div className="w-full lg:w-auto relative z-10 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                Office Address
              </span>
              <p className="text-[12px] text-slate-200 font-semibold font-sans">
                Campus University of Ghana
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                Contact Info
              </span>
              <div className="space-y-1.5">
                <a
                  href="mailto:info@bluvelhq.com"
                  className="flex items-center space-x-2 text-[12px] text-royal hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>info@bluvelhq.com</span>
                </a>
                <a
                  href="tel:+233593705543"
                  className="flex items-center space-x-2 text-[12px] text-royal hover:underline font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+233 593705543</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SERVICES PAGE
// =========================================================================
export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "Software Support",
      desc: "Fix drivers, compiler configurations, visual studio workloads, database errors, and system lockups.",
      details: [
        "Environment variables configuration",
        "IDE crash resolution",
        "PDF & Academic setups",
        "Network adapter repairs",
      ],
      badge: "Software Desk",
    },
    {
      title: "OS Setup & Cleans",
      desc: "Wiping old corrupt partition maps, staging official Windows 11 layouts, and mac recovery systems.",
      details: [
        "Valid drivers install checks",
        "BIOS configurations",
        "Backup migration audits",
        "Partition management",
      ],
      badge: "OS Clean Station",
    },
    {
      title: "Virus Removal Diagnostics",
      desc: "Scanning hidden folders, deleting rootkits, browser hijack scripts, malware bundles, and infostealers.",
      details: [
        "Security diagnostics audits",
        "Antivirus key deployments",
        "Regedit hygiene fixes",
        "Phishing audit checks",
      ],
      badge: "Malware Lab",
    },
    {
      title: "Hardware Repair Management",
      desc: "Tracing hardware issues. Routing logic boards, key assemblies, and panels to certified workshops.",
      details: [
        "Notebook screen diagnostics",
        "M2 SSD speed audits",
        "Component labor coverage",
        "Dust & thermal pasta checks",
      ],
      badge: "Hardware Booth",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 select-none">
          <span className="text-[10px] uppercase tracking-widest text-royal font-bold block mb-2">
            Service Portfolio
          </span>
          <h1 className="text-4xl font-semibold text-navy tracking-tight">
            On-Campus Technical Capabilities
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">
            Professional diagnostic capabilities aligned under semester
            packages. No hidden labor commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 p-8 rounded-2xl shadow-none relative text-left hover:border-royal/35 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <span className="absolute top-6 right-6 bg-royal/10 text-royal font-mono font-bold text-[9px] px-2 py-0.5 rounded border border-royal/20 uppercase">
                {s.badge}
              </span>
              <h3 className="text-lg font-bold text-navy mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {s.desc}
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-5">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block">
                  Work scope details
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  {s.details.map((det, dIdx) => (
                    <li key={dIdx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-royal" />
                      <span>{det}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CONTACT PAGE
// =========================================================================
export const ContactPage: React.FC = () => {
  const [ticketCreated, setTicketCreated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    msg: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.msg) {
      setTicketCreated(true);
      setFormData({ name: "", email: "", msg: "" });
      setTimeout(() => setTicketCreated(false), 5000);
    }
  };

  return (
    <div className="selection:bg-royal selection:text-white bg-white font-sans min-h-screen text-slate-800 pb-24 overflow-hidden leading-relaxed">
      {/* 1. HERO HEADER - Clean White Block with interactive background grid */}
      <div className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 text-center text-[#00183D]">
        {/* Background Ripple Effect */}
        <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-auto z-0 overflow-hidden [--cell-border-color:rgba(37,99,235,0.12)] [--cell-fill-color:rgba(37,99,235,0.003)]">
          <BackgroundRippleEffect rows={9} cols={35} cellSize={60} />
        </div>

        {/* Floating background decorative dots with animations */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-royal/40 pointer-events-none"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-royal/30 pointer-events-none"
        />
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/12 w-2 h-2 rounded-full bg-royal/40 pointer-events-none"
        />
        <motion.div
          animate={{ x: [10, -10, 10] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 right-12 w-2.5 h-2.5 rounded-full bg-royal/40 pointer-events-none"
        />

        <div className="max-w-4xl mx-auto relative z-10 space-y-4 select-none text-center">
          <span className="bg-royal/10 border border-royal/20 text-royal text-[10px] font-bold font-mono px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
            CAMPUS HELP CENTER
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none text-[#00183D] font-sans max-w-3xl mx-auto">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
            Have questions about coverage, repairs, or campus booths? Drop us a
            line and let's get your device shielded.
          </p>
        </div>
      </div>

      {/* Primary Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-20">
        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* Left Block: Contact Channels Widget (Glassmorphic Deep Navy card) */}
          <div className="lg:col-span-5 bg-[#0b162c] text-white p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col justify-between text-left relative overflow-hidden border border-white/[0.05] hover:-translate-y-1.5 hover:shadow-royal/10 transition-all duration-300 cursor-pointer">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-royal/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                  Support Channels
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                  We run physical support locations and lines across campus
                  university hubs.
                </p>
              </div>

              <div className="border-t border-white/[0.08] w-full" />

              <div className="space-y-6 font-sans">
                {/* Call Channel */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-royal flex-shrink-0 group-hover:bg-royal group-hover:text-white transition-all duration-300">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
                      Direct Helpline
                    </span>
                    <a
                      href="tel:0593705543"
                      className="text-xs sm:text-sm font-semibold text-white block hover:text-royal transition-colors mt-0.5 font-mono"
                    >
                      0593705543
                    </a>
                  </div>
                </div>

                {/* Email Channel */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-royal flex-shrink-0 group-hover:bg-royal group-hover:text-white transition-all duration-300">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
                      Academic Email
                    </span>
                    <a
                      href="mailto:info@bluvelhq.com"
                      className="text-xs sm:text-sm font-semibold text-white block hover:text-royal transition-colors mt-0.5 font-mono"
                    >
                      info@bluvelhq.com
                    </a>
                  </div>
                </div>

                {/* Address Channel */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-royal flex-shrink-0 group-hover:bg-royal group-hover:text-white transition-all duration-300">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
                      Main Campus Booth
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug mt-0.5 font-sans">
                      Campus University of Ghana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 select-none relative z-10 text-[9px] text-white/30 tracking-widest font-mono font-bold uppercase border-t border-white/[0.05] mt-8">
              🔒 Shielded Care Guarantee
            </div>
          </div>

          {/* Right Block: Message Form (Glassmorphic Light card) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col justify-center text-left hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-royal font-semibold block">
                SEND MESSAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy font-sans tracking-tight mt-1 mb-3">
                Send us a message
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium mb-8">
                Got a question? Submit the form details and our triage support
                specialists will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your Full Name"
                  className="w-full text-xs font-medium border border-slate-200 hover:border-slate-300 focus:border-royal bg-slate-50/50 px-4 py-3.5 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400 font-sans shadow-inner rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your Email Address"
                  className="w-full text-xs font-medium border border-slate-200 hover:border-slate-300 focus:border-royal bg-slate-50/50 px-4 py-3.5 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400 font-sans shadow-inner rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <textarea
                  rows={4}
                  required
                  value={formData.msg}
                  onChange={(e) =>
                    setFormData({ ...formData, msg: e.target.value })
                  }
                  placeholder="Write your request details or query here..."
                  className="w-full text-xs font-medium border border-slate-200 hover:border-slate-300 focus:border-royal bg-slate-50/50 px-4 py-3.5 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400 font-sans resize-none shadow-inner rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-royal text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md hover:bg-blue-700 active:scale-[0.98] cursor-pointer rounded-xl"
                >
                  Send Message
                </button>
              </div>
            </form>

            <AnimatePresence>
              {ticketCreated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2.5 relative z-10"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span className="font-semibold">
                    Message dispatched successfully. We'll reply within 24
                    hours!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. CAMPUS BOOTH & MAPS */}
        <div className="border-t border-slate-200/60 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
            {/* HQ Desk Info */}
            <div className="bg-white border border-slate-200/50 p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider text-royal font-semibold block">
                  BOOTHS LOCATION
                </span>
                <h3 className="text-xl font-semibold text-navy font-sans tracking-tight">
                  Main Campus Library Desk
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Drop by our central support desk inside the Central Balme
                  Library. Students can check diagnostic status and consult with
                  technical advisors in person.
                </p>
              </div>

              <div className="space-y-4 pt-4 text-xs text-slate-650 border-t border-slate-100 font-sans">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-royal mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-navy block">
                      Central Balme Library
                    </span>
                    <span className="text-slate-500 block">
                      Ground floor left-wing booth 2. Legon Campus, Accra.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-royal mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-navy block">
                      Operating Hours
                    </span>
                    <span className="text-slate-500 block">
                      Monday to Saturday (8:00 AM — 5:00 PM)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps view */}
            <div className="border border-slate-200/60 rounded-3xl overflow-hidden h-full min-h-[280px] shadow-sm hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6698942202685!2d-0.18731792518388484!3d5.651737494329241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11eecf84db091011%3A0xe54e6e666a7b7914!2sBalme%20Library!5e0!3m2!1sen!2sgh!4v1718928000000!5m2!1sen!2sgh"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - Balme Library, University of Ghana"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// BLOG PAGE LOGIC
// =========================================================================
const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "5 Crucial Steps to Protect Your Academic Laptop from Viruses",
    slug: "protect-academic-laptop-viruses",
    excerpt:
      "Losing your class essays or thesis file is a nightmare. Read these quick security guidelines to keep your system clean and protected on open university network hotspots.",
    category: "security",
    author: "Daniel Amegashie, Senior CyberSec Lead",
    read_time: "4 min read",
    image_url:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-05-18T10:00:00Z",
    content:
      'University networks are highly target-rich environments for malware and adware vectors. Because thousands of students share access points, malware can propagate horizontally inside subnetworks.\n\nHere are the critical measures to ensure safety:\n1. **Disable Public Sharing**: Always ensure that "network sharing" is disabled in your system adapter settings.\n2. **Setup a Standard Account**: Avoid running your notebook continuously on the "Administrator account". Creating a normal user profile prevents software from silently writing to system directories.\n3. **Equip Managed Antivirus**: Standard Windows Defender works beautifully when updated daily.\n4. **Backup, Backup, Backup**: Sync your "Documents" and "Desktop" folders to trusted cloud storage or a secondary flash disk.\n5. **Beware of Crack Software**: Downloading unauthorized activations for software packages like MS Office is the primary delivery channel for malicious infostealers.',
  },
  {
    id: "blog-2",
    title: "Boost Windows 11 Load Performance on Older Student Laptops",
    slug: "boost-windows-11-load-performance",
    excerpt:
      "Is your laptop taking ages to start during a lecture? Try these simple, safe optimizations designed to clean background workloads and speed up responsiveness.",
    category: "tips",
    author: "Kofi Boateng, System Diagnostic Architect",
    read_time: "5 min read",
    image_url:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-05-20T14:30:00Z",
    content:
      'We frequently see laptops at our hub that are perfectly fine hardwarewise but severely choked by startup items. \n\nSimple, step-by-step optimizations to execute today:\n- **Triage Task Manager Startup Apps**: Press Ctrl + Shift + Esc, head to Startup Apps, and disable unnecessary services like Spotify, Steam, or helper update engines.\n- **Perform Storage Sense Cleanups**: Activate Windows Storage Sense to automatically erase temporary files and old cached browser structures.\n- **Defragment and Optimize Drive**: If you are still running a traditional spinning hard drive (HDD), search "Defragment and Optimize Drives" to index files properly. If on SSD, optimization triggers standard TRIM controls to maintain top write speeds.',
  },
  {
    id: "blog-3",
    title: "The Student Hardware Guide: Upgrading RAM vs. Buying New Laptop",
    slug: "upgrading-ram-vs-buying-new-laptop",
    excerpt:
      "Do you really need to dump GH₵5,000 on a brand new notebook, or will a GH₵250 solid state drive upgrade rejuvenate it? Let us calculate the value math.",
    category: "support",
    author: "Amina Osei, Electronics Hardware Desk",
    read_time: "6 min read",
    image_url:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-05-22T09:15:00Z",
    content:
      "Academic workloads are increasing, with demanding web apps running alongside complex spreadsheets and PDF viewers. Many students believe a slow notebook requires a total hardware replacement. \n\nHowever, we find that 85% of underperforming legacy notebooks have two massive bottlenecks: a traditional mechanical HDD and insufficient RAM (4GB or 8GB).\n\n**Why SSD is a Game Changer**: Traditional HDDs read data at ~100 MB/s. Modern SATA SSDs read at ~500 MB/s, and NVMe SSDs read up to ~3000 MB/s. Boot time drops from 3 minutes to under 15 seconds!\n\n**The RAM Sweet Spot**: Upgrading from 8GB to 16GB ensures you can run Chrome tabs, Zoom sessions, and Word files concurrently without the OS engaging slow disk pagefile swap techniques.",
  },
];

export const BlogPage: React.FC = () => {
  const blogs = useMemo(() => DEFAULT_BLOGS, []);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || b.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  return (
    <div className="py-16 bg-white text-left min-h-[600px] selection:bg-royal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header content and search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10 mb-10">
          <div className="max-w-md select-none">
            <span className="text-[10px] uppercase tracking-widest text-royal font-bold block mb-1.5">
              Academic Forum
            </span>
            <h1 className="text-4xl font-semibold text-navy tracking-tight">
              Tech Diagnostics Blog
            </h1>
            <p className="text-xs text-slate-500 mt-2.5">
              Guides, insights, and warnings regarding academic PC safety and
              Windows/macOS health audits.
            </p>
          </div>

          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tech articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-royal shadow-none"
            />
          </div>
        </div>

        {/* Category select tools */}
        <div className="flex flex-wrap gap-2 mb-8 select-none">
          {["all", "security", "tips", "support"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border capitalize font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-royal text-white border-royal shadow-none"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat === "all" ? "All Guides" : cat}
            </button>
          ))}
        </div>

        {/* Blog lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              onClick={() => setActiveBlog(b)}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer shadow-none transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden border-b border-slate-100 bg-slate-50 relative">
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="h-full w-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-navy text-yellow-400 border border-white/5 font-mono">
                    {b.category}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{b.read_time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-600 font-semibold bg-slate-50/50">
                <span>{b.author.split(",")[0]}</span>
                <span className="text-royal flex items-center space-x-1 hover:underline">
                  <span>Read Article</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="col-span-1 md:col-span-3 text-center py-16 bg-white rounded-2xl border border-slate-100 select-none">
              <span className="text-3xl">🔍</span>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                No diagnostic tech guides match your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Modal display of individual blog element */}
        <AnimatePresence>
          {activeBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 15 }}
                className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-100 flex flex-col justify-between max-h-[85vh] shadow-none relative"
              >
                {/* Visual header */}
                <div className="h-56 bg-slate-50 relative pointer-events-none select-none">
                  <img
                    src={activeBlog.image_url}
                    alt="Hero"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <button
                    onClick={() => setActiveBlog(null)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-4 left-6 right-6 text-white text-left">
                    <span className="bg-royal font-mono font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-white/10 text-white">
                      {activeBlog.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-semibold mt-2 leading-snug">
                      {activeBlog.title}
                    </h2>
                  </div>
                </div>

                {/* Real reading arena inside modal */}
                <div className="p-6 sm:p-8 overflow-y-auto text-xs text-slate-600 space-y-4 max-h-[50vh] leading-relaxed select-text">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5 select-none text-slate-400 font-semibold font-mono text-[10px]">
                    <span className="text-slate-500 uppercase">
                      By {activeBlog.author}
                    </span>
                    <span>READ LENGTH: {activeBlog.read_time}</span>
                  </div>

                  {/* Standard formatting support */}
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed pt-2">
                    {activeBlog.content}
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex items-start space-x-2.5 select-none pt-4">
                    <ThumbsUp className="w-5 h-5 text-royal flex-shrink-0" />
                    <div>
                      <span className="font-bold text-navy block text-[11px]">
                        Was this tech advisory constructive?
                      </span>
                      <span className="text-slate-500 text-[10px] block leading-none mt-1">
                        Leave feedback at Booth locations. Always practice
                        backup guidelines!
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end select-none">
                  <button
                    onClick={() => setActiveBlog(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Finish Reading
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// =========================================================================
// HELP CENTER
// =========================================================================
const DEFAULT_FAQS = [
  {
    id: "faq-1",
    category: "General",
    question: "How does StudentShield work?",
    answer:
      "StudentShield is a tech support subscription. University students subscribe to either our Basic or Premium semester plan. Once covered, you can open digital tickets for any device issues (slow laptop, virus, software install errors), bring your device to our campus support hub, and get diagnostic/repair assistance free of charge.",
  },
  {
    id: "faq-2",
    category: "Pricing",
    question: "Is the billing automatic or semester-based?",
    answer:
      "It is semester-based! We understand student budgets. You pay a single payment of GH₵20 (Basic) or GH₵50 (Premium) for the entire semester. No automatic recurring surprises.",
  },
  {
    id: "faq-3",
    category: "Hardware",
    question: "Does the GH₵50 tier pay for broken spare parts?",
    answer:
      "The Premium plan covers complete diagnostic evaluation, device cleaning, operating system setups, and labor fees for replacing components. If you need physical hardware replacement parts (like a new laptop screen or battery), you only pay the direct parts cost from our certified supplier; our technician labor charge is completely covered under your Premium Shield plan.",
  },
  {
    id: "faq-4",
    category: "Campus Support",
    question: "Where can I find StudentShield technicians on campus?",
    answer:
      "We operate support boots at central campus locations (typically near the Main Library and Science Complex). Our technicians are available Monday to Saturday from 8:00 AM to 5:00 PM.",
  },
  {
    id: "faq-5",
    category: "Devices Coverage",
    question: "How many devices can I register under my plan?",
    answer:
      "Each semester plan covers one primary academic device (laptop or desktop). You can register additional secondary devices (like a tablet or smartphone) for an extra GH₵5 per semester.",
  },
];

export const HelpCenterPage: React.FC = () => {
  const faqs = useMemo(() => DEFAULT_FAQS, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [faqs, searchQuery]);

  return (
    <div className="py-16 bg-white text-left min-h-[560px] selection:bg-royal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Upper heading dashboard */}
        <div className="text-center max-w-2xl mx-auto mb-12 select-none">
          <span className="text-[10px] uppercase tracking-widest text-royal font-bold block mb-2">
            Knowledge repository
          </span>
          <h1 className="text-4xl font-semibold text-navy tracking-tight">
            How Can We Assist?
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Lookup semester coverage plans, campus boots operating hours, and
            active repair queries.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Query help guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-none focus:outline-none focus:border-royal"
            />
          </div>
        </div>

        {/* Accordion list */}
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-none divide-y divide-slate-150">
          {filteredFaqs.map((f) => {
            const isOpen = openFaq === f.id;
            return (
              <div key={f.id} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : f.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start space-x-3.5 pr-4">
                    <HelpCircle className="w-4.5 h-4.5 text-royal mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                        CATEGORY: {f.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-navy mt-0.5">
                        {f.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50/50 px-6 pb-5 border-t border-slate-100"
                    >
                      <p className="whitespace-pre-line text-xs text-slate-600 leading-relaxed pt-4 font-medium select-text">
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center select-none">
              <span className="text-2xl">⚡</span>
              <p className="text-xs text-slate-400 mt-2 font-semibold">
                No direct support articles answer that search syntax.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ServiceAgreementPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="selection:bg-royal selection:text-white bg-white font-sans min-h-screen text-slate-800 pb-20 overflow-hidden leading-relaxed">
      <div className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 text-center text-[#00183D]">
        <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-auto z-0 overflow-hidden [--cell-border-color:rgba(37,99,235,0.15)] [--cell-fill-color:rgba(37,99,235,0.005)]">
          <BackgroundRippleEffect rows={6} cols={35} cellSize={60} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-4 select-none">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-royal/10 to-blue-600/10 border border-royal/20 rounded-full px-4 py-1.5 text-[10px] text-royal font-bold uppercase tracking-widest font-mono shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>LEGAL & RULES OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#00183D] font-sans">
            StudentShield Service Agreement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully. By subscribing to any
            StudentShield protection plan, you agree to these operating
            principles and service limits.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10 font-sans">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">
            1. Platform Scope & Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            StudentShield provides technology diagnostics, minor hardware
            checkups, and software troubleshooting services specifically for
            active university students in Ghana. To be eligible for plan
            registration, you must possess a valid academic email address and
            student identification code.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">
            2. Protection Plan Limits & Labor Fees
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Your semester subscription covers technician labor fees and
            diagnostic assessments based on your selected tier (Basic, Premium,
            or Bonanza).
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-2 font-medium">
            <li>
              <strong>Labor Coverage:</strong> Basic coverage covers software
              diagnosis and general health reports. Premium/Bonanza tiers cover
              full labor coordinates for physical component replacements.
            </li>
            <li>
              <strong>Hardware Parts Cost Exclusion:</strong> Subscription plans
              do NOT cover the cost of physical replacement parts (e.g.,
              keyboards, screens, hard drives, batteries, charging ports).
              Students are responsible for procuring parts, though our hub
              technicians will assist with free installation labor.
            </li>
            <li>
              <strong>Device Limits:</strong> Coverage is restricted strictly to
              the specific system serial numbers registered on your
              StudentShield dashboard profile.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">
            3. Data Backup & Limitation of Liability
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 block">
                CRITICAL DATA DISCLAIMER
              </span>
              <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                StudentShield is NOT liable for any loss of academic progress,
                personal files, source code, or media assets during diagnostic
                re-installs, malware sweeps, or physical hardware repairs.{" "}
                <strong>
                  It is the sole responsibility of the student subscriber to
                  back up their data prior to handing over a device to hub
                  technicians.
                </strong>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">
            4. Subscription Term & Paystack Billing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Plans run strictly on a per-semester schedule and automatically
            expire at the end of the academic period. All transactions are
            securely initialized through Paystack. Due to instant setup
            allocations, plan fees are non-refundable once payment verification
            has succeeded.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">
            5. Courier & Transportation Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            For complex logic board repairs or hardware issues requiring
            specialized laboratory machinery, StudentShield coordinates secure
            transport and shipping to certified external partners. We bear the
            shipping transit risk, but partner service pricing logs will be
            shared transparently for your approval before work begins.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-550 font-medium">
            Last Updated: July 2026 | StudentShield Ghana
          </p>
          <button
            onClick={() => navigate("landing")}
            className="px-5 py-2.5 bg-royal text-white font-bold text-xs rounded-full hover:bg-royal/90 shadow-md shadow-royal/10 transition-all cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
