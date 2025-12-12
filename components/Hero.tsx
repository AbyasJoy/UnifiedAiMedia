import React from 'react';
import { ArrowRight, Mic, Sparkles, Layout, Send } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onOpenModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-slate-50">
      
      {/* Animated Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 shadow-sm text-brand-700 text-xs font-bold tracking-wide uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-brand-500" />
            <span>AI-Powered Communication</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
            Unified AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-accent-600 to-brand-600 bg-size-200 animate-gradient">
              Communication
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 font-body leading-relaxed">
            Transform raw voice input into professionally designed posters, invites, and social campaigns in a single step.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Button size="lg" className="shadow-xl shadow-brand-500/20" onClick={onOpenModal}>
              Start Creating <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="white" onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth'})}>
              How it works
            </Button>
          </div>
          
          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-400 text-sm font-medium">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Voice Activated
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                Instant Generation
             </div>
          </div>
        </div>

        {/* Visual Content */}
        <div className="relative perspective-1000">
          <div className="relative z-10 animate-float">
            <div className="glass-card rounded-3xl shadow-2xl shadow-brand-900/10 p-6 md:p-8 border border-white/60">
              
              {/* Mock Interface Header */}
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                      <Mic size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 font-medium">Input Source</div>
                      <div className="text-slate-900 font-semibold">Voice Recording...</div>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
              </div>

              {/* Mock Audio Waveform */}
              <div className="flex items-center justify-center gap-1 h-12 mb-8 px-8">
                 {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1.5 bg-brand-500 rounded-full animate-pulse-soft"
                        style={{ 
                            height: `${Math.random() * 100}%`, 
                            opacity: Math.random() * 0.5 + 0.5,
                            animationDelay: `${i * 0.1}s` 
                        }}
                    ></div>
                 ))}
              </div>
              
              {/* Generated Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/5] bg-brand-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-accent-400 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <Layout className="text-brand-500 relative z-10" />
                    </div>
                    <div className="h-2 w-20 bg-slate-100 rounded mb-1.5"></div>
                    <div className="h-2 w-12 bg-slate-100 rounded"></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow mt-8">
                    <div className="aspect-[4/3] bg-accent-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-purple-400 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <Send className="text-accent-500 relative z-10" />
                    </div>
                    <div className="h-2 w-20 bg-slate-100 rounded mb-1.5"></div>
                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-bounce border border-slate-50">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Sparkles size={16} />
                </div>
                <div className="text-sm font-semibold text-slate-800">Done in 2.4s</div>
              </div>

            </div>
          </div>
          
          {/* Decorative Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-accent-600 rounded-[2.5rem] transform rotate-6 translate-x-4 translate-y-4 -z-10 opacity-20 blur-xl"></div>
        </div>
      </div>
    </section>
  );
};