import React from 'react';
import { Music2, Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const features = [
    { title: 'Global_Archive', desc: 'Direct link to the YouTube Data API archive.' },
    { title: 'Industrial_UI', desc: 'Utilitarian interface built for precision and clarity.' },
    { title: 'System_Optimization', desc: 'Hardware-level caching and rapid data processing.' },
    { title: 'Zero_Latency', desc: 'Immediate stream initialization for continuous playback.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-8 py-16 pb-32"
    >
      {/* Logo */}
      <div className="flex flex-col items-start mb-20 border-b border-border-hard pb-12">
        <div className="flex items-center gap-2 mb-8">
           <span className="w-8 h-px bg-brand" />
           <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em]">System_Documentation</p>
        </div>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-brand flex items-center justify-center border border-black shadow-[8px_8px_0px_0px_rgba(238,255,0,0.2)]">
            <Music2 className="text-black w-12 h-12" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-7xl md:text-9xl font-display uppercase leading-none tracking-tighter">SONIVIO</h1>
            <div className="inline-block mt-2 px-3 py-1 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest">
              Engine_v1.0.42_Stable
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-0 border-l border-t border-border-hard mb-20">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 border-r border-b border-border-hard bg-bg-light hover:bg-brand hover:text-black transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-2xl uppercase tracking-tight">{f.title}</h3>
              <span className="font-mono text-[10px] opacity-40">CH_{i+1}</span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wider leading-relaxed group-hover:text-black/70">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
           <p className="font-mono text-sm text-text-sub uppercase tracking-widest leading-loose">
            SONIVIO IS A HIGH-PERFORMANCE AUDIO INTERFACE DESIGNED TO REDEFINE DIGITAL STREAMING. 
            IT MERGES THE EXPANSIVE GLOBAL ARCHIVE OF YOUTUBE WITH A RAW, UTILITARIAN INTERFACE 
            ENGINEERED FOR STABILITY AND IMPACT.
          </p>
        </div>
        <div className="space-y-6">
          <p className="font-mono text-sm text-text-sub uppercase tracking-widest leading-loose">
            BUILT WITH REACT AND TYPESCRIPT, SONIVIO BYPASSES CONVENTIONAL DESIGN TRENDS IN FAVOR 
            OF INDUSTRIAL-GRADE CLARITY. OUR MISSION IS TO PROVIDE A SYSTEM THAT FEELS LIKE 
            PHYSICAL HARDWARE: FOCUSING ENTIRELY ON THE SIGNAL AND THE LISTENER.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-12 border-t border-border-hard flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-sub hover:text-brand transition-colors">
            <Github size={18} />
            <span>Archive_Repo</span>
          </a>
          <a href="#" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-sub hover:text-brand transition-colors">
            <Globe size={18} />
            <span>System_Web</span>
          </a>
        </div>
        <div className="font-mono text-[10px] text-text-sub uppercase tracking-[0.3em]">
          © 2026 SONIVIO_SYSTEMS // ALL_RIGHTS_RESERVED
        </div>
      </div>
    </motion.div>
  );
};

export default About;