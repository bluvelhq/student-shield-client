/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';

export const LandingTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Ama Korantema',
      school: 'UG LEGON',
      role: 'Level 300 Business Student',
      comment: 'My laptop had a persistent blue screen crash right in the middle of revision week. If not for StudentShield, I would have paid over GH₵300 in town. They reinstalled Windows and configured Office within 2 hours!',
      stars: 5,
    },
    {
      name: 'Kwame Mensah',
      school: 'UG LEGON',
      role: 'Level 200 Engineering Student',
      comment: 'Super convenient! As a Premium subscriber, when my battery died, they came straight to my hostel, diagnosed it free, and I only paid for the battery part. No labor charges at all. Absolute life-saver.',
      stars: 5,
    },
    {
      name: 'Efua Asante',
      school: 'UG LEGON',
      role: 'Level 400 Computer Science Student',
      comment: 'Setting up MS Office is always such a struggle. The StudentShield team activated it on my Mac in minutes. Highly recommend GHC 10 Basic plans for year-round software peace of mind on campus.',
      stars: 5,
    },
    {
      name: 'Ebenezer Lartey',
      school: 'UG LEGON',
      role: 'Level 100 Accounting Student',
      comment: 'My laptop fell and the hard drive crashed. StudentShield recovered key class documents and reinstalled Windows on my new SSD. Completed everything in under 24 hours. Phenomenal SLA speed!',
      stars: 5,
    },
    {
      name: 'Abena Gyamfi',
      school: 'UG LEGON',
      role: 'Level 300 Education Student',
      comment: 'Malware kept redirecting my browser during final essays. Academic station team cleaned up my laptop and pre-loaded premium antivirus. Absolutely recommend to every student!',
      stars: 5,
    }
  ];

  // Triple the array to provide a seamless continuous loop overlay for infinite scroll
  const marqueeTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="py-24 bg-white relative overflow-hidden select-none border-t border-slate-200/40">
      
      {/* Background visual accents */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-royal/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="bg-royal/5 border border-royal/10 text-royal text-[10px] font-extrabold px-3 py-1 rounded-none uppercase tracking-widest font-sans inline-block mb-3.5">
            REVIEWS & EXPERIENCES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy leading-tight font-sans">
            Loved By Students. <br />
            <span className="text-royal">Tested and Trusted On Campus.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed max-w-2xl mx-auto font-sans font-medium">
            Hear from major tertiary students who saved time, cost, and extreme stress using StudentShield.
          </p>
        </div>
      </div>

      {/* Full-width seamless moving marquee slider */}
      <div className="w-full relative overflow-hidden py-4 select-none">
        
        {/* Premium fade gradient masks at left/right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow flex">
          {marqueeTestimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="w-[290px] xs:w-[320px] sm:w-[420px] flex-shrink-0 px-4 flex"
            >
              <div className="border border-slate-200/40 p-8 rounded-none bg-white hover:border-royal/45 transition-all duration-300 text-left relative flex flex-col justify-between shadow-none w-full min-h-[280px]">
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-0.5 text-[#FFC500]">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#FFC500]/33 fill-[#FFC500]/5" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-medium italic">
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#00183D] font-sans leading-none">{testimonial.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1.5 font-sans">{testimonial.role}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-50 text-slate-600 rounded-none border border-slate-200/40 font-sans">
                    {testimonial.school}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
