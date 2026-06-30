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
      desc: 'Select Basic (GH₵20) or Premium (GH₵50) cover. Pay instantly using MoMo (MTN or Telecel) and get your digital cover card immediately.',
      icon: CreditCard,
      color: 'from-blue-600 to-royal',
      glow: 'shadow-blue-500/10'
    },
    {
      number: '02',
      title: 'Submit a Request',
      desc: 'Enter your student secret code and submit your issue details through our portal. No appointments, no lines, no diagnostics fee.',
      icon: MessageSquare,
      color: 'from-purple-600 to-indigo-600',
      glow: 'shadow-purple-500/10'
    },
    {
      number: '03',
      title: 'We Solve It, Free',
      desc: 'Bring your device to our campus library booth. Software issues are resolved same day, and hardware labor is covered fully.',
      icon: Wrench,
      color: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/10'
    },
  ];

  return (
    <div id="how-it-works" className="py-28 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden select-none border-y border-slate-150">
      {/* Animated Subtle Background Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.03, 0.07, 0.03],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-royal rounded-full blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.02, 0.05, 0.02],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[130px] pointer-events-none" 
      />

      {/* Floating Animated Circles */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          x: [-6, 6, -6]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-24 left-16 w-3 h-3 rounded-full bg-royal/35 pointer-events-none"
      />
      <motion.div
        animate={{
          y: [12, -12, 12],
          x: [6, -6, 6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-24 right-16 w-2.5 h-2.5 rounded-full bg-purple-400/35 pointer-events-none"
      />
      
      {/* Geometric background grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-royal/10 border border-royal/20 rounded-full px-4 py-1.5 text-xs text-royal font-extrabold uppercase tracking-widest font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-navy leading-tight">
            Three Steps. Zero Hassle.
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
            From activation to repair — built to provide instant on-campus diagnostic peace of mind.
          </p>
        </div>

        {/* Animated Timeline Vector Connectors (Desktop Only) */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="hidden md:block absolute top-[53%] left-12 right-12 h-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 -translate-y-1/2 pointer-events-none z-0 origin-left" 
        />

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-200/60 p-8 rounded-3xl relative text-left hover:border-royal/25 hover:bg-white hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group shadow-lg cursor-pointer"
              >
                {/* Step indicator number */}
                <div className="absolute top-6 right-8 text-7xl font-black text-slate-100/50 group-hover:text-royal/5 font-sans pointer-events-none select-none transition-colors duration-300">
                  {step.number}
                </div>

                <div className="space-y-6">
                  {/* Icon wrap with gradient glow */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-navy font-sans tracking-tight">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Card footer decorative tag */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400">
                  <span>Step {step.number}</span>
                  <span className="text-royal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Proceed →</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
