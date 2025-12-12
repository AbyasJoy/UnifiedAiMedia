import React from 'react';
import { Megaphone, Mail, Type, Share2, ArrowRight, Sparkles } from 'lucide-react';

interface FeaturesSectionProps {
  onOpenModal: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenModal }) => {
  const features = [
    {
      icon: Megaphone,
      title: "Voice-to-Poster",
      description: "Instantly generate visually stunning event posters from spoken details about time, venue, and theme.",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      title: "Voice-to-Invite",
      description: "Create formal or casual invitations ready to be emailed or messaged to your guest list.",
      color: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: Type,
      title: "Voice-to-Caption",
      description: "Get catchy, context-aware captions tailored for Instagram, LinkedIn, and Twitter.",
      color: "from-purple-500 to-fuchsia-500",
      bg: "bg-purple-50 text-purple-600"
    },
    {
      icon: Share2,
      title: "Voice-to-Social Post",
      description: "Full social media layouts formatted perfectly for stories, feeds, and reels.",
      color: "from-rose-500 to-orange-500",
      bg: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <section id="features" className="py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-brand-600 bg-brand-50 px-3 py-1 rounded-full text-sm font-semibold mb-6">
             <Sparkles size={16} />
             <span>The Suite</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">One Flow, No App Switching</h2>
          <p className="text-xl text-slate-600 font-body">
            A unified suite of tools designed to work in perfect harmony, powered by a single voice or text command.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-brand-900/5 transition-all duration-500 transform hover:-translate-y-2 group border border-slate-100 flex flex-col relative overflow-hidden"
            >
              {/* Top Gradient Border on Hover */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                <feature.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow text-sm font-body">
                {feature.description}
              </p>
              
              <button 
                className="flex items-center text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors cursor-pointer focus:outline-none mt-auto"
                onClick={onOpenModal}
              >
                Try it now <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};