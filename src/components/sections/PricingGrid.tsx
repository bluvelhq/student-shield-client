/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Minus, Shield, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../../services/authService';
import { useState, useEffect } from 'react';

export const PricingGrid: React.FC = () => {
  const { navigate, user } = useApp();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    authService.getPlans()
      .then(res => setPlans(res || []))
      .catch(err => {
        console.error('Failed to fetch plans:', err);
        setPlans([]);
      });
  }, []);

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

  // Sort plans by fee ascending (so lowest is first, highest is last)
  const sortedPlans = [...plans].sort((a, b) => (a.fee || 0) - (b.fee || 0));

  // Extract all unique benefits dynamically from the backend plans
  const uniqueBenefits = Array.from(
    new Set(sortedPlans.flatMap((p: any) => p.benefits || []))
  );

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

        {/* Dynamic pricing cards layout */}
        <div className={`grid grid-cols-1 ${sortedPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3 max-w-6xl'} gap-8 mx-auto mb-20`}>
          {sortedPlans.map((p: any) => {
            const isHighestPlan = p.id === sortedPlans[sortedPlans.length - 1]?.id;
            const planTypeName = p.type ? (p.type.charAt(0) + p.type.slice(1).toLowerCase()) : 'Shield';
            const buttonText = `Start ${planTypeName} Cover`;
            const benefitsList = p.benefits || [];

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`border p-6 sm:p-8 ${isHighestPlan ? 'rounded-[2.5rem]' : 'rounded-2xl'} bg-white relative flex flex-col justify-between text-left hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer ${
                  isHighestPlan ? 'border-blue-300 bg-gradient-to-b from-[#F2F6FF] to-white shadow-xl shadow-blue-100/50' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className={`p-6 sm:p-7 ${isHighestPlan ? 'rounded-4xl' : 'rounded-xl'} mb-8 relative border ${
                    isHighestPlan 
                      ? 'bg-linear-to-br from-[#E2EAFD] via-[#E8EBFF] to-[#FAF9F6] border-royal/10'
                      : 'bg-slate-50 border-slate-200/50'
                  }`}>
                    <span className={`inline-block border text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 mb-6 rounded-full shadow-sm ${
                      isHighestPlan 
                        ? 'bg-royal border-blue-400 text-white animate-pulse' 
                        : 'bg-white border-slate-350 text-slate-850'
                    }`}>
                      {planTypeName}
                    </span>

                    <div className="mb-3">
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-4xl sm:text-5xl font-bold text-slate-900 font-sans tracking-tight">GH₵{p.fee}</span>
                        <span className={`${isHighestPlan ? 'text-royal font-bold' : 'text-slate-500'} text-xs font-sans`}>/semester</span>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-[13px] font-semibold font-sans mb-6 leading-relaxed ${isHighestPlan ? 'text-blue-900' : 'text-slate-550'}`}>
                      {p.summary || `${planTypeName} protection plan.`}
                    </p>

                    <button
                      onClick={() => handleSubscribeClick(p.id)}
                      className={`w-full py-3.5 px-6 text-xs font-bold rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98] ${
                        isHighestPlan 
                          ? 'bg-royal hover:bg-blue-700 text-white' 
                          : 'bg-[#111111] hover:bg-black text-white'
                      }`}
                    >
                      {buttonText}
                    </button>
                  </div>

                  <ul className="space-y-4 px-2.5 text-xs font-sans">
                    {benefitsList.map((benefit: string, idx: number) => {
                      const isNeg = benefit.toLowerCase().includes('no free') || benefit.toLowerCase().includes('limit');
                      return (
                        <li key={idx} className="flex items-start space-x-3">
                          {isNeg ? (
                            <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                          ) : (
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isHighestPlan ? 'text-royal' : 'text-emerald-500'}`} />
                          )}
                          <span className={`font-medium ${isHighestPlan && !isNeg ? 'text-blue-900 font-semibold' : 'text-slate-650'}`}>{benefit}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* High-Fidelity Dynamic Comparison Table */}
        {sortedPlans.length > 0 && (
          <div className="hidden md:block max-w-5xl mx-auto mb-20 border border-slate-200/40 rounded-none overflow-hidden bg-white select-none shadow-none">
            <div className="bg-white px-6 py-4.5 border-b border-slate-100 text-left">
              <h3 className="text-sm font-bold text-navy">Feature-by-Feature Plan Alignment</h3>
            </div>
            <table className="w-full text-xs text-left font-sans">
              <thead>
                <tr className="bg-white border-b border-slate-100 font-semibold text-slate-500">
                  <th className="px-6 py-3.5">Technical Cover Feature</th>
                  {sortedPlans.map((p: any) => {
                    const isHighest = p.id === sortedPlans[sortedPlans.length - 1]?.id;
                    const planTypeName = p.type ? (p.type.charAt(0) + p.type.slice(1).toLowerCase()) : 'Shield';
                    return (
                      <th key={p.id} className={`px-6 py-3.5 w-48 text-center ${isHighest ? 'text-royal font-bold' : ''}`}>
                        {planTypeName} (GH₵{p.fee})
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {uniqueBenefits.map((benefit, index) => (
                  <tr key={index} className="hover:bg-slate-50/10 transition-colors">
                    <td className="px-6 py-3.5 font-medium">{benefit}</td>
                    {sortedPlans.map((p: any) => {
                      const isHighest = p.id === sortedPlans[sortedPlans.length - 1]?.id;
                      const isPremium = p.type === 'PREMIUM';
                      const hasBenefit = isPremium || isHighest || p.benefits?.some(
                        (b: string) => b.toLowerCase() === benefit.toLowerCase()
                      );
                      return (
                        <td key={p.id} className="px-6 py-3.5 text-center">
                          {hasBenefit ? (
                            <Check className={`w-4.5 h-4.5 mx-auto ${isHighest ? 'text-royal font-bold' : 'text-emerald-500'}`} />
                          ) : (
                            <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Max registered academic devices covered */}
                <tr className="hover:bg-slate-50/10 transition-colors">
                  <td className="px-6 py-3.5 font-medium">Max registered academic devices covered</td>
                  {sortedPlans.map((p: any) => {
                    const maxDev = p.maxDevices ?? p.max_devices ?? 1;
                    const isHighest = p.id === sortedPlans[sortedPlans.length - 1]?.id;
                    const isPremium = p.type === 'PREMIUM';
                    return (
                      <td key={p.id} className={`px-6 py-3.5 text-center font-semibold font-mono ${isHighest ? 'text-royal' : 'text-slate-650'}`}>
                        {isPremium ? '-' : (maxDev === 1 ? '1 device' : `${maxDev} devices`)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
