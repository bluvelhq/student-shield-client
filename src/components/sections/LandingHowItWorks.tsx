/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, MessageSquare, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

export const LandingHowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pick Your Plan',
      desc: 'Choose Basic (GHC 10) or Premium (GHC 30). Pay instantly via MTN MoMo or Telecel Cash. Receive your digital policy card with a unique key code and QR right away.',
      icon: CreditCard,
      color: 'bg-royal text-white',
    },
    {
      number: '02',
      title: 'Report an Issue',
      desc: 'Submit a ticket via WhatsApp, our web portal, or phone. Describe the problem — we handle everything. No diagnosis fee. No appointment queue. Ever.',
      icon: MessageSquare,
      color: 'bg-royal text-white',
    },
    {
      number: '03',
      title: 'We Fix It, Free',
      desc: 'Our technician comes to you — hostel, library, lecture block. Software issues same day. Hardware within 24 hrs. Premium subscribers pay parts cost only.',
      icon: Wrench,
      color: 'bg-royal text-white',
    },
  ];

  return (
    <div id="how-it-works" className="py-24 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Group */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-royal font-extrabold block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
            Three Steps. Zero Stress.
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">
            From sign-up to repair — built to be fast and entirely friction-free.
          </p>
        </div>

        {/* 3 Step Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="border border-slate-200/40 p-8 rounded-none bg-white relative text-left hover:border-slate-300 transition-all shadow-none"
              >
                {/* Number floating background indicator */}
                <div className="absolute top-6 right-8 text-6xl font-black text-slate-100 font-sans pointer-events-none select-none">
                  {step.number}
                </div>

                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-none flex items-center justify-center ${step.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-navy font-sans mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
