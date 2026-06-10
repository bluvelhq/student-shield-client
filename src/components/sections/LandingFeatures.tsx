/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Monitor, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Settings 
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingFeatures: React.FC = () => {
  const coverageItems = [
    {
      title: 'Windows OS',
      desc: 'Full installation, activation, repair and update management for Windows 10 and 11.',
      icon: Monitor,
      badge: 'Both Plans',
      badgeColor: 'bg-emerald-50 border border-emerald-200/50 text-emerald-700',
    },
    {
      title: 'Office Suite',
      desc: 'Microsoft Office installation, activation and full configuration — Word, Excel, PowerPoint and more.',
      icon: FileText,
      badge: 'Both Plans',
      badgeColor: 'bg-emerald-50 border border-emerald-200/50 text-emerald-700',
    },
    {
      title: 'Virus & Malware',
      desc: 'Deep scans, full malware removal, rootkit cleaning and system hardening. Your data stays safe.',
      icon: ShieldAlert,
      badge: 'Both Plans',
      badgeColor: 'bg-emerald-50 border border-emerald-200/50 text-emerald-700',
    },
    {
      title: 'BSOD & Crashes',
      desc: 'Blue screen diagnosis, crash log analysis, driver repair and full Windows recovery.',
      icon: Activity,
      badge: 'Both Plans',
      badgeColor: 'bg-emerald-50 border border-emerald-200/50 text-emerald-700',
    },
    {
      title: 'Hardware Repair',
      desc: 'Screen, keyboard, battery, charging port, RAM — zero labour charge for Premium members.',
      icon: Cpu,
      badge: 'Premium Only',
      badgeColor: 'bg-blue-50 border border-blue-200/50 text-royal',
    },
    {
      title: 'General Software',
      desc: 'Driver conflicts, slow performance, startup issues, corrupted files — all covered free.',
      icon: Settings,
      badge: 'Both Plans',
      badgeColor: 'bg-emerald-50 border border-emerald-200/50 text-emerald-700',
    },
  ];

  return (
    <div id="features" className="py-24 bg-white relative overflow-hidden select-none border-y border-slate-200/40">
      
      {/* Background accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-royal/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-royal/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="bg-royal/10 border border-royal/20 text-royal text-[11px] font-body font-semibold px-4 py-2 rounded-full uppercase tracking-wide inline-block mb-6">
            Key Services
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-navy leading-tight mb-6">
            Complete Protection Coverage
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto font-body font-light">
            Six categories of comprehensive support tailored for academic success.
          </p>
        </div>

        {/* Bento Grid clean card components without shadow or curves */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {coverageItems.map((item, idx) => {
            const Icon = item.icon;
            const colSpans = [
              'md:col-span-7 lg:col-span-7',
              'md:col-span-5 lg:col-span-5',
              'md:col-span-4 lg:col-span-3',
              'md:col-span-8 lg:col-span-6',
              'md:col-span-6 lg:col-span-3',
              'md:col-span-6 lg:col-span-12',
            ];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className={`${colSpans[idx] || 'md:col-span-4'} bg-white border border-slate-200/50 p-6 rounded-lg flex flex-col justify-between hover:border-slate-300 hover:-translate-y-px transition-all group text-left relative`}
              >
                <div className="space-y-5">
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-royal/5 text-royal rounded-lg flex items-center justify-center border border-royal/10 group-hover:bg-royal group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-body font-semibold px-3 py-1.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-heading font-semibold text-[#00183D]">{item.title}</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-body font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-mono flex justify-between items-center">
                  <span>Category {(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="text-royal opacity-0 group-hover:opacity-100 transition-opacity">● Instant claim</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
