import React from 'react';
import { AlertCircle, Clock, Layers, ArrowRight } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm font-semibold">
               <AlertCircle size={16} />
               <span>The Challenge</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Creating event content is <br/>
              <span className="relative">
                fragmented
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-rose-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>.
            </h2>
            
            <p className="text-lg text-slate-600 leading-relaxed font-body">
              No existing system can convert a simple spoken briefing into a full communication package in one step.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-body">
              Current tools require switching between multiple apps for posters, invites, captions, and social media layouts. This leads to friction, inconsistency, and wasted time.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-900 font-bold mb-2">
                    <Clock className="text-rose-500 w-5 h-5" />
                    <span>Time Consuming</span>
                  </div>
                  <p className="text-sm text-slate-500">Hours spent formatting across different tools manually.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-900 font-bold mb-2">
                    <Layers className="text-rose-500 w-5 h-5" />
                    <span>Inconsistent Design</span>
                  </div>
                  <p className="text-sm text-slate-500">Mismatched branding when using separate generators.</p>
              </div>
            </div>
          </div>

          {/* Right illustration - The "Messy" Process */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
                {/* Background chaos lines */}
                <svg className="absolute inset-0 w-full h-full text-slate-200 -z-10" style={{ transform: 'scale(1.2)' }}>
                    <path d="M50,50 Q150,150 250,50 T450,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10" />
                    <path d="M50,250 Q150,150 250,250 T450,250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10" />
                </svg>

                <div className="grid grid-cols-2 gap-6">
                    {['Design App', 'Email Tool', 'Social Mgr', 'Copy AI'].map((app, i) => (
                        <div key={i} className={`p-6 rounded-2xl border-2 border-dashed ${i % 2 === 0 ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white'} flex flex-col items-center justify-center h-40 shadow-sm transform transition-transform hover:scale-105`}>
                            <div className="w-12 h-12 rounded-full bg-slate-200 mb-3 flex items-center justify-center text-slate-400 font-bold">
                                {i + 1}
                            </div>
                            <span className="font-semibold text-slate-500">{app}</span>
                        </div>
                    ))}
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl border border-rose-100 z-10">
                    <div className="bg-rose-100 text-rose-600 w-10 h-10 rounded-full flex items-center justify-center">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};