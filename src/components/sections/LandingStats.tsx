import React, { useEffect, useState, useRef } from 'react';
import { Shield, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', prefix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export const LandingStats: React.FC = () => {
  const stats = [
    {
      numericValue: 500,
      prefix: '',
      suffix: '+',
      label: 'Students Protected',
      desc: 'Active policy holders secure across major tertiary campuses.',
      icon: Shield,
    },
    {
      numericValue: 98,
      prefix: '',
      suffix: '%',
      label: 'Resolution Rate',
      desc: 'Problems resolved successfully within our service level agreement.',
      icon: CheckCircle2,
    },
    {
      numericValue: 340,
      prefix: 'GH₵',
      suffix: '',
      label: 'Average Saved',
      desc: 'Saved per semester compared to off-campus local repair shops.',
      icon: DollarSign,
    },
    {
      numericValue: 24,
      prefix: '',
      suffix: 'hr',
      label: 'Max Turnaround',
      desc: 'Maximum wait time for complex hardware diagnoses and fixes.',
      icon: Clock,
    },
  ];

  return (
    <div className="py-20 bg-[#00183D] text-white relative select-none overflow-hidden">
      {/* Decorative dark grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title / Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-royal font-semibold block mb-2">
            PROVEN PERFORMANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight font-sans">
            By Students, For Students. <br />
            Our Impact in <span className="text-royal animate-pulse">Numbers.</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-navy/45 border border-white/10 p-8 rounded-none text-left relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-royal font-sans tracking-tight">
                    <CountUp 
                      end={stat.numericValue} 
                      suffix={stat.suffix} 
                      prefix={stat.prefix} 
                    />
                  </span>
                  <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center text-slate-400 bg-white/5">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide font-sans">{stat.label}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
