/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const LandingFAQ: React.FC = () => {
  const { navigate, user } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Does the StudentShield plan cover accidental physical cracks?',
      a: 'Yes! Our Premium Shield plan assists in accidental damage routing. While physical repair parts themselves are sourced at cost from verified hubs, StudentShield covers 100% of diagnostic profiling labor, thermal refresh, and certified technician installation logistics.'
    },
    {
      q: 'How fast is the turnaround guarantee?',
      a: 'We guarantee a under 2-hour turnaround SLA for software optimizations, diagnostic profiles, clean OS formatting, and malware wipes at campus hubs. For complex physical hardware repairs (e.g. screen replacements), we guarantee dispatch and transit back within 24 to 48 hours maximum.'
    },
    {
      q: 'What payment options are supported on campus?',
      a: 'We fully support MTN MoMo, Telecel Cash, and standard Visa or MasterCard. You pay once for academic protection, completely offline-safe, and instantly bind protection to your serial number without recurring bill surprises.'
    },
    {
      q: 'Can I subscribe mid-semester?',
      a: 'Absolutely! You can initiate coverage at any point during the scholastic year. Your diagnostic shield remains fully active for the entirety of the semester term in which your checkout transaction is verified.'
    },
    {
      q: 'Is my private scholastic data secure during repairs?',
      a: 'Security is our core doctrine. Our technicians are fully vetted and sign strict academic data protection accords. System diagnostics scans are entirely sandboxed to profile hardware stability, and your physical files/directories are never accessed or cloned.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="py-24 bg-white border-t border-slate-100 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-royal/5 border border-royal/10 text-royal text-[10px] font-extrabold px-3 py-1 rounded-none uppercase tracking-widest font-mono inline-block mb-3">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
            We Have Answers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3.5 leading-relaxed">
            Everything you need to know about our semester device protection logistics and diagnostic coverage.
          </p>
        </div>

        {/* FAQs Accordion Stream */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="border border-slate-200/40 rounded-none bg-[#FFFFFF] overflow-hidden transition-all hover:border-royal/10"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 stroke-slate-400 flex items-center justify-between text-left font-sans cursor-pointer focus:outline-none"
                >
                  <span className="text-sm font-bold text-navy select-none pr-4">{faq.q}</span>
                  <div className="text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3 font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* High impact CTA Banner matching the uploaded image */}
        <div className="mt-20 bg-[#00183D] text-white p-8 sm:p-12 text-center rounded-none relative overflow-hidden border border-white/10 select-none">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-royal/10 filter blur-2xl rounded-full" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Your Laptop Deserves Protection.<br />
              You Deserve <span className="text-royal">Peace of Mind.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-semibold">
              Join 500+ students on campus today, and secure your device. No consultation fees. No hidden charges.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => navigate(user ? 'dashboard' : 'register')}
                className="py-3.5 px-8 text-xs font-black uppercase tracking-widest bg-royal hover:bg-royal/90 text-white rounded-none transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer inline-flex items-center space-x-2 shadow-none"
              >
                <Shield className="w-4 h-4 text-white" />
                <span>Get Insured for GH₵ 10</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
