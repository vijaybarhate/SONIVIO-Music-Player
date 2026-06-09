import React from 'react';
import { Music2, Github, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const specs = [
    { name: 'Framework', value: 'Astro (with React Islands)' },
    { name: 'Styling', value: 'Tailwind CSS v4 (CSS-first config)' },
    { name: 'State Management', value: 'Zustand (4 Decoupled stores)' },
    { name: 'API Layer', value: 'YouTube Data API v3 (Secure server proxy)' },
    { name: 'Deployment', value: 'Cloudflare Pages (SSR Edge network)' },
    { name: 'Performance', value: 'Astro View Transitions & Lazy Loading' }
  ];

  const features = [
    { title: 'Edge Routing.', desc: 'Serverless Astro endpoints shield API keys from browser exposure, proxying traffic securely.' },
    { title: 'Islands Architecture.', desc: 'React components act as interactive islands on top of pre-rendered, fast HTML shells.' },
    { title: 'Continuous Stream.', desc: 'Astro ClientRouter view transitions persist the player state, allowing uninterrupted audio playback during page changes.' },
    { title: 'Modular Stores.', desc: 'Zustand state is decoupled into player, queue, library, and UI stores for scalable client memory.' }
  ];

  return (
    <div
      className="max-w-4xl mx-auto pb-24 select-none"
    >
      {/* Brand Header */}
      <div className="flex flex-col items-start mb-12 pb-8 border-b border-hairline">
        <div className="flex items-center gap-2 mb-4">
           <span className="font-mono text-[10px] text-mute uppercase tracking-wider">System Documentation</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-ink flex items-center justify-center rounded-md card-shadow-lvl3">
            <Music2 className="text-canvas w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-sans font-semibold tracking-tight text-ink">SONIVIO v2.</h1>
            <div className="inline-flex mt-1.5 px-2 py-0.5 bg-canvas-soft-2 border border-hairline rounded font-mono text-[10px] text-mute uppercase font-medium">
              Engine_v2.0.0_Stable
            </div>
          </div>
        </div>
      </div>

      {/* Main Pitch */}
      <div className="mb-16">
        <p className="text-lg text-ink font-sans leading-relaxed tracking-tight">
          SONIVIO is a premium, developer-oriented music streaming platform. 
          It merges the global archive of YouTube with a stark, lightweight interface 
          inspired by modern developer tools. Engineered for ultimate focus, stability, and zero visual clutter.
        </p>
      </div>

      {/* Core Architectural Features */}
      <div className="mb-16">
        <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-6">Engine Architecture.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 bg-canvas border border-hairline rounded-lg card-shadow-lvl3 hover:border-hairline-strong transition-all duration-200"
            >
              <h3 className="font-sans font-semibold text-sm text-ink mb-2">{f.title}</h3>
              <p className="font-sans text-xs text-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="mb-16">
        <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-6">Technical Specifications.</h2>
        <div className="border border-hairline rounded-lg overflow-hidden bg-canvas card-shadow-lvl3">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-canvas-soft-2 border-b border-hairline text-mute font-mono uppercase text-[9px] tracking-wider">
                <th className="px-5 py-2.5 font-medium">Stack Layer</th>
                <th className="px-5 py-2.5 font-medium">Technology Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {specs.map((spec, i) => (
                <tr key={i} className="hover:bg-canvas-soft transition-colors">
                  <td className="px-5 py-3 font-semibold text-ink">{spec.name}</td>
                  <td className="px-5 py-3 text-body font-mono">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Links */}
      <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-sans text-xs text-body hover:text-ink transition-colors"
          >
            <Github size={14} />
            <span>Repository</span>
            <ArrowUpRight size={12} className="text-mute" />
          </a>
        </div>
        <div className="font-mono text-[9px] text-mute uppercase tracking-wider">
          © 2026 SONIVIO SYSTEMS // ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
};

export default About;
