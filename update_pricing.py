import re

with open("src/components/sections/PricingGrid.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the static cards with mapped cards
mapped_code = """
        {/* Flat pricing cards layout - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((p: any) => {
            const isBonanza = p.type === 'BONANZA';
            const isPremium = p.type === 'PREMIUM';
            const buttonText = isBonanza ? 'Start Bonanza Cover' : isPremium ? 'Start Premium Cover' : 'Start Basic Cover';
            
            const defaultBenefits = isBonanza ? [
              'All Premium features included',
              'Free tech consultations all semester',
              'Monthly maintenance & checks',
              'Up to 3 registered devices'
            ] : isPremium ? [
              'All Basic features included',
              'Free technician labor always',
              'Priority response queue',
              'Single registered device limit'
            ] : [
              'Software installation (1 device)',
              'Free diagnosis for hardware faults',
              'Repair coordination & logistics',
              'No free labor for hardware repairs'
            ];
            
            const benefitsList = (p.benefits && p.benefits.length > 0) ? p.benefits : defaultBenefits;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`border p-6 sm:p-8 ${isPremium || isBonanza ? 'rounded-[2.5rem]' : 'rounded-2xl'} bg-white relative flex flex-col justify-between text-left hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer ${
                  isBonanza ? 'border-amber-300 bg-gradient-to-b from-[#FFFDF6] to-[#FFFDF9] shadow-md' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className={`p-6 sm:p-7 ${isPremium || isBonanza ? 'rounded-4xl' : 'rounded-xl'} mb-8 relative border ${
                    isBonanza 
                      ? 'bg-linear-to-br from-[#FFF5D1] via-[#FFF8E7] to-[#FAF9F6] border-amber-200' 
                      : isPremium 
                        ? 'bg-linear-to-br from-[#E2EAFD] via-[#E8EBFF] to-[#FAF9F6] border-royal/10'
                        : 'bg-slate-50 border-slate-200/50'
                  }`}>
                    <span className={`inline-block border text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 mb-6 rounded-full shadow-sm ${
                      isBonanza 
                        ? 'bg-amber-500 border-amber-400 text-white animate-pulse' 
                        : isPremium 
                          ? 'bg-white border-slate-200/70 text-slate-800'
                          : 'bg-white border-slate-300 text-slate-850'
                    }`}>
                      {p.type.charAt(0) + p.type.slice(1).toLowerCase()}
                    </span>

                    <div className="mb-3">
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-4xl sm:text-5xl font-bold text-slate-900 font-sans tracking-tight">GH₵{p.fee}</span>
                        <span className={`${isBonanza ? 'text-amber-700' : isPremium ? 'text-royal' : 'text-slate-500'} text-xs font-bold font-sans`}>/semester</span>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-[13px] font-semibold font-sans mb-6 leading-relaxed ${isBonanza ? 'text-amber-900' : 'text-slate-550'}`}>
                      {p.summary || (isBonanza ? 'Ultimate cover: 3 devices + dedicated maintenance.' : isPremium ? 'Free repair labor + priority support.' : 'Essential software support & diagnosis for one device.')}
                    </p>

                    <button
                      onClick={() => handleSubscribeClick(p.id)}
                      className={`w-full py-3.5 px-6 text-xs font-bold rounded-full transition-all cursor-pointer font-sans tracking-widest uppercase border-0 text-center shadow-none active:scale-[0.98] ${
                        isBonanza 
                          ? 'bg-[#D97706] hover:bg-[#B45309] text-white' 
                          : isPremium 
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
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isBonanza ? 'text-amber-600' : isPremium ? 'text-royal' : 'text-emerald-500'}`} />
                          )}
                          <span className={`font-medium ${isBonanza && !isNeg ? 'text-amber-900' : 'text-slate-650'}`}>{benefit}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
"""

# Extract the static layout code
pattern = re.compile(r"\{\/\* Flat pricing cards layout - 3 columns \*\/\}.*?\{\/\* High-Fidelity Comparison Table \*\/\}", re.DOTALL)
content = pattern.sub(mapped_code + "\n        {/* High-Fidelity Comparison Table */}", content)

# Add state and useEffect for plans
import_pattern = re.compile(r"import \{ motion \} from 'motion/react';")
content = import_pattern.sub("import { motion } from 'motion/react';\nimport { authService } from '../../services/authService';\nimport { useState, useEffect } from 'react';", content)

component_pattern = re.compile(r"export const PricingGrid: React\.FC = \(\) => \{\n  const \{ navigate, user \} = useApp\(\);")
component_repl = """export const PricingGrid: React.FC = () => {
  const { navigate, user } = useApp();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    authService.getPlans()
      .then(res => setPlans(res || []))
      .catch(err => {
        console.error('Failed to fetch plans:', err);
        setPlans([]);
      });
  }, []);"""
content = component_pattern.sub(component_repl, content)

with open("src/components/sections/PricingGrid.tsx", "w", encoding="utf-8") as f:
    f.write(content)
