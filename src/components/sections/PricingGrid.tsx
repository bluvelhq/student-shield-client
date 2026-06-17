/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Minus, Shield, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const PricingGrid: React.FC = () => {
  const { navigate, user } = useApp();

  const handleSubscribeClick = (planId: string) => {
    if (user) {
      if (user.role === 'admin') {
        navigate('admin');
      } else {
        navigate('dashboard', { tab: 'billing', selectPlanId: planId });
      }
    } else {
      navigate('register', { selectPlanId: planId });
    }
  };

  const planFeatures = [
    { name: 'Windows OS install, repair & activation', basic: true, premium: true },
    { name: 'Microsoft Office setup & activation', basic: true, premium: true },
    { name: 'Virus & malware removal', basic: true, premium: true },
    { name: 'BSOD diagnosis & recovery', basic: true, premium: true },
    { name: 'Driver issues & system optimisation', basic: true, premium: true },
    { name: 'All other software glitches', basic: 'Free', premium: 'Free' },
    { name: 'Hardware repair representation', basic: 'Discount Applies', premium: 'Free Labour Always' },
    { name: 'Same-day priority response', basic: false, premium: true },
    { name: 'Free laptop health check each semester', basic: false, premium: true },
    { name: 'Dedicated WhatsApp support line', basic: false, premium: true },
    { name: 'Remote support for minor issues', basic: false, premium: true },
    { name: 'Renewal loyalty discount', basic: false, premium: true },
  ];

  return (
    <div id="coverage-plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Titles */}
        <div className="text-center max-w-3xl mx-auto mb-20 select-none">
          <span className="text-[11px] font-body font-semibold text-royal block mb-4 uppercase tracking-wide">
            Pricing Plans
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-navy mb-6">
            Choose Your Protection Plan
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-body font-light max-w-2xl mx-auto">
            Flexible semester rates with no hidden fees. Choose what works best for you.
          </p>
        </div>

        {/* Flat pricing cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">

          {/* Basic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-slate-200 p-8 rounded-2xl bg-white relative flex flex-col justify-between text-left hover:shadow-lg transition-all h-full"
          >
            <div>
              {/* Nested top container block */}
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200/50 mb-8 relative">
                {/* Basic Pill Badge */}
                <span className="inline-block bg-white border border-slate-300 text-slate-800 text-[10px] font-body font-semibold uppercase tracking-wide px-4 py-2 mb-6 rounded-full">
                  Basic
                </span>

                {/* Big Bold Price */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl sm:text-6xl font-heading font-bold text-slate-900 tracking-tight">GH₵20</span>
                    <span className="text-slate-500 text-base font-body">/semester</span>
                  </div>
                </div>

                {/* Caption text */}
                <p className="text-base text-slate-600 font-body font-light mb-8 leading-relaxed">
                  Unlimited software support — all semester long
                </p>

                {/* Subscribing Pill black button matching start hiring button layout */}
                <button
                  onClick={() => handleSubscribeClick('basic-plan')}
                  className="w-full py-4 px-6 text-xs font-bold bg-[#111111] hover:bg-black text-white rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98]"
                >
                  Start Basic Cover
                </button>
              </div>

              {/* Clean list with tick/minus/cross icons below the nested box */}
              <ul className="space-y-4 px-2.5 text-xs sm:text-[13px] text-slate-600 font-sans">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Windows OS install, repair & activation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Microsoft Office setup & activation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Virus & malware removal</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">BSOD diagnosis & recovery</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Driver issues & system optimisation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">All other software glitches — free</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Minus className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-500">Hardware repair: discounted rate applies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-400">No same-day priority response</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-400">No free laptop health check</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-slate-200 p-8 rounded-[2.5rem] bg-white relative flex flex-col justify-between text-left hover:scale-[1.01] transition-all h-full shadow-none"
          >
            <div>
              {/* Nested top container block with subtle Blue gradient as in design's Premium card */}
              <div className="bg-linear-to-br from-[#E2EAFD] via-[#E8EBFF] to-[#FAF9F6] border border-royal/10 p-7 rounded-4xl mb-8 relative">
                {/* Premium Pill Badge */}
                <span className="inline-block bg-white border border-slate-200/70 text-slate-800 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 mb-6 rounded-full shadow-sm">
                  Premium
                </span>

                {/* Big Bold Price */}
                <div className="mb-3">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 font-sans tracking-tight">GH₵50</span>
                    <span className="text-royal text-xs font-bold font-sans">/semester</span>
                  </div>
                </div>

                {/* Caption text */}
                <p className="text-xs sm:text-[13px] text-slate-500 font-semibold font-sans mb-6 leading-relaxed">
                  Full protection — software + hardware covered
                </p>

                {/* Subscribing Pill black button matching start hiring button layout */}
                <button
                  onClick={() => handleSubscribeClick('premium-plan')}
                  className="w-full py-4 px-6 text-xs font-bold bg-[#111111] hover:bg-black text-white rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98]"
                >
                  Start Premium Cover
                </button>
              </div>

              {/* Clean list with checkmarks below the blue nested box */}
              <ul className="space-y-4 px-2.5 text-xs sm:text-[13px] text-slate-600 font-sans">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">All Basic features — unlimited</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Hardware repair — <b className="text-navy">free labour always</b></span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">You only pay cost of replacement parts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Same-day priority response</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Dedicated WhatsApp support line</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Free laptop health check each semester</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Remote support for minor issues</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Renewal loyalty discount</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Priority ticket queue</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* High-Fidelity Comparison Table */}
        <div className="hidden md:block max-w-4xl mx-auto mb-20 border border-slate-200/40 rounded-none overflow-hidden bg-white select-none shadow-none">
          <div className="bg-white px-6 py-4.5 border-b border-slate-100 text-left">
            <h3 className="text-sm font-bold text-navy">Feature-by-Feature Plan Alignment</h3>
          </div>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 font-semibold text-slate-500">
                <th className="px-6 py-3.5">Technical Cover Feature</th>
                <th className="px-6 py-3.5 w-40 text-center">Basic (GH₵20)</th>
                <th className="px-6 py-3.5 w-40 text-center">Premium (GH₵50)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {planFeatures.map((feat, index) => (
                <tr key={index} className="hover:bg-slate-50/10 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{feat.name}</td>
                  <td className="px-6 py-3.5 text-center">
                    {typeof feat.basic === 'boolean' ? (
                      feat.basic ? <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /> : <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="font-semibold text-slate-600 font-mono">{feat.basic}</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {typeof feat.premium === 'boolean' ? (
                      feat.premium ? <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /> : <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="font-semibold text-royal font-mono">{feat.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
