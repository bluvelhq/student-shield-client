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
    { name: 'Software installation for one device per semester', basic: true, premium: true, bonanza: true },
    { name: 'Free diagnosis for hardware faults', basic: true, premium: true, bonanza: true },
    { name: 'Repair coordination & transport support', basic: true, premium: true, bonanza: true },
    { name: 'Free technician repair labor fees', basic: false, premium: true, bonanza: true },
    { name: 'Free tech consultations for the semester', basic: false, premium: false, bonanza: true },
    { name: 'Monthly maintenance and health checks', basic: false, premium: false, bonanza: true },
    { name: 'Max registered academic devices covered', basic: '1 device', premium: '1 device', bonanza: 'Up to 3 devices' }
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
            Flexible semester rates with no hidden fees. Choose what works best for your academic needs.
          </p>
        </div>

        {/* Flat pricing cards layout - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

          {/* Basic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-slate-200 p-6 sm:p-8 rounded-2xl bg-white relative flex flex-col justify-between text-left hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer"
          >
            <div>
              <div className="bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200/50 mb-8 relative">
                <span className="inline-block bg-white border border-slate-300 text-slate-800 text-[10px] font-body font-semibold uppercase tracking-wide px-4 py-2 mb-6 rounded-full">
                  Basic
                </span>

                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-heading font-bold text-slate-900 tracking-tight">GH₵20</span>
                    <span className="text-slate-500 text-xs font-body">/semester</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 font-body font-light mb-8 leading-relaxed">
                  Essential software support & diagnosis for one device.
                </p>

                <button
                  onClick={() => handleSubscribeClick('basic-plan')}
                  className="w-full py-3.5 px-6 text-xs font-bold bg-[#111111] hover:bg-black text-white rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98]"
                >
                  Start Basic Cover
                </button>
              </div>

              <ul className="space-y-4 px-2.5 text-xs text-slate-600 font-sans">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Software installation (1 device)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Free diagnosis for hardware faults</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">Repair coordination & logistics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-450">No free labor for hardware repairs</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-slate-200 p-6 sm:p-8 rounded-[2.5rem] bg-white relative flex flex-col justify-between text-left hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full shadow-none cursor-pointer"
          >
            <div>
              <div className="bg-linear-to-br from-[#E2EAFD] via-[#E8EBFF] to-[#FAF9F6] border border-royal/10 p-6 sm:p-7 rounded-4xl mb-8 relative">
                <span className="inline-block bg-white border border-slate-200/70 text-slate-800 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 mb-6 rounded-full shadow-sm">
                  Premium
                </span>

                <div className="mb-3">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 font-sans tracking-tight">GH₵50</span>
                    <span className="text-royal text-xs font-bold font-sans">/semester</span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 font-semibold font-sans mb-6 leading-relaxed">
                  Free repair labor + priority support.
                </p>

                <button
                  onClick={() => handleSubscribeClick('premium-plan')}
                  className="w-full py-3.5 px-6 text-xs font-bold bg-royal hover:bg-blue-700 text-white rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98]"
                >
                  Start Premium Cover
                </button>
              </div>

              <ul className="space-y-4 px-2.5 text-xs text-slate-600 font-sans">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">All Basic features included</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Free technician labor always</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-royal mt-0.5 shrink-0" />
                  <span className="font-medium">Priority response queue</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-450">Single registered device limit</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Bonanza Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-amber-300 p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-[#FFFDF6] to-[#FFFDF9] relative flex flex-col justify-between text-left hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full shadow-md cursor-pointer"
          >
            <div>
              <div className="bg-linear-to-br from-[#FFF5D1] via-[#FFF8E7] to-[#FAF9F6] border border-amber-200 p-6 sm:p-7 rounded-4xl mb-8 relative">
                <span className="inline-block bg-amber-500 border border-amber-400 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 mb-6 rounded-full shadow-sm animate-pulse">
                  Bonanza
                </span>

                <div className="mb-3">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-950 font-sans tracking-tight">GH₵120</span>
                    <span className="text-amber-700 text-xs font-bold font-sans">/semester</span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-amber-900 font-semibold font-sans mb-6 leading-relaxed">
                  Ultimate cover: 3 devices + dedicated maintenance.
                </p>

                <button
                  onClick={() => handleSubscribeClick('bonanza-plan')}
                  className="w-full py-3.5 px-6 text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98]"
                >
                  Start Bonanza Cover
                </button>
              </div>

              <ul className="space-y-4 px-2.5 text-xs text-slate-600 font-sans">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span className="font-medium font-bold text-amber-900">All Premium features included</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span className="font-medium">Free tech consultations all semester</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span className="font-medium">Monthly maintenance & checks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span className="font-medium font-bold text-amber-900">Up to 3 registered devices</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* High-Fidelity Comparison Table */}
        <div className="hidden md:block max-w-5xl mx-auto mb-20 border border-slate-200/40 rounded-none overflow-hidden bg-white select-none shadow-none">
          <div className="bg-white px-6 py-4.5 border-b border-slate-100 text-left">
            <h3 className="text-sm font-bold text-navy">Feature-by-Feature Plan Alignment</h3>
          </div>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 font-semibold text-slate-500">
                <th className="px-6 py-3.5">Technical Cover Feature</th>
                <th className="px-6 py-3.5 w-32 text-center">Basic (GH₵20)</th>
                <th className="px-6 py-3.5 w-32 text-center">Premium (GH₵50)</th>
                <th className="px-6 py-3.5 w-32 text-center text-amber-700">Bonanza (GH₵120)</th>
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
                  <td className="px-6 py-3.5 text-center">
                    {typeof feat.bonanza === 'boolean' ? (
                      feat.bonanza ? <Check className="w-4.5 h-4.5 text-amber-600 mx-auto" /> : <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      <span className="font-bold text-amber-700 font-mono">{feat.bonanza}</span>
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
