import React from 'react';
import { CheckCircle, Zap, Box, Palette } from 'lucide-react';

export const SolutionSection: React.FC = () => {
  return (
    <section id="solution" className="py-32 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Graphic - The "Engine" */}
          <div className="order-2 lg:order-1 relative">
            <div className="glass-dark p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                {/* Internal Glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
                
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono tracking-wider">UNIFIED_CORE_V1.0</div>
                </div>

                <div className="space-y-6">
                    {/* Input Node */}
                    <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Input</div>
                            <div className="font-medium text-slate-200">Raw Voice Command</div>
                        </div>
                    </div>

                    {/* Processing Line */}
                    <div className="h-12 border-l-2 border-dashed border-slate-700 ml-[2.35rem] relative">
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    </div>

                    {/* Output Node */}
                     <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-brand-900/50 to-accent-900/50 rounded-2xl border border-brand-500/30 shadow-lg shadow-brand-900/20">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-brand-300 uppercase tracking-wider font-semibold">Output</div>
                            <div className="font-medium text-white">Complete Media Package</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 lg:order-2 space-y-8">
             <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-2">
              The Solution
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              One Voice Input. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Infinite Possibilities.</span>
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed font-body">
              This project proposes an AI system that converts rough voice instructions into complete event/media communication formats. 
            </p>
            <p className="text-lg text-slate-400 leading-relaxed font-body">
              It generates posters, invites, captions, and social posts in one flow without editing or app switching. The solution ensures consistent design, tone, and ready-to-use output from a single voice input.
            </p>

            <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="border border-white/10 rounded-2xl p-5 bg-white/5 hover:bg-white/10 transition-colors group">
                    <Box className="text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-white mb-1">Unified</div>
                    <div className="text-sm text-slate-400">All formats in one go</div>
                </div>
                <div className="border border-white/10 rounded-2xl p-5 bg-white/5 hover:bg-white/10 transition-colors group">
                    <Palette className="text-accent-400 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-white mb-1">Consistent</div>
                    <div className="text-sm text-slate-400">On-brand design</div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};