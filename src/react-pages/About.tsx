import React from 'react';
import { Music2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const GithubMark: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, ease: EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const About: React.FC = () => {
  const specs = [
    { name: 'Framework', value: 'Astro (with React Islands)' },
    { name: 'Styling', value: 'Tailwind CSS v4 (CSS-first config)' },
    { name: 'State Management', value: 'Zustand (4 Decoupled stores)' },
    { name: 'API Layer', value: 'YouTube Data API v3 (Secure server proxy)' },
    { name: 'Deployment', value: 'Cloudflare Pages (SSR Edge network)' },
    { name: 'Performance', value: 'Astro View Transitions & Lazy Loading' },
  ];

  const features = [
    {
      title: 'Edge Routing.',
      desc: 'Serverless Astro endpoints shield API keys from browser exposure, proxying traffic securely.',
    },
    {
      title: 'Islands Architecture.',
      desc: 'React components act as interactive islands on top of pre-rendered, fast HTML shells.',
    },
    {
      title: 'Continuous Stream.',
      desc: 'Astro ClientRouter view transitions persist the player state, allowing uninterrupted audio playback during page changes.',
    },
    {
      title: 'Modular Stores.',
      desc: 'Zustand state is decoupled into player, queue, library, and UI stores for scalable client memory.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24 select-none">
      {/* Cinematic header band */}
      <header className="relative -mx-4 md:-mx-8 px-4 md:px-8 pt-10 pb-12 md:pt-14 md:pb-16 mb-10 md:mb-14 overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 mesh-gradient-live pointer-events-none" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-canvas-soft to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow mb-4"
          >
            <span className="text-ink/60 tabular-nums">03 /</span> System Documentation
          </motion.p>

          <div className="flex items-center gap-5 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="w-14 h-14 bg-ink flex items-center justify-center rounded-md card-shadow-lvl4 flex-shrink-0"
            >
              <Music2 className="text-canvas w-7 h-7" />
            </motion.div>
            <div>
              <h1 className="text-display-lg md:text-display-xl text-ink">SONIVIO v2.</h1>
              <div className="inline-flex mt-1.5 px-2 py-0.5 bg-canvas/80 backdrop-blur-sm border border-hairline rounded-full font-mono text-[10px] text-mute uppercase font-medium">
                Engine_v2.0.0_Stable
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.22 }}
            className="max-w-2xl text-body-lg text-body leading-relaxed"
          >
            SONIVIO is a premium, developer-oriented music streaming platform. It merges the global
            archive of YouTube with a stark, lightweight interface inspired by modern developer
            tools. Engineered for focus, stability, and zero visual clutter.
          </motion.p>
        </div>
      </header>

      {/* Core Architectural Features — numbered tracklist rows */}
      <Reveal className="mb-14">
        <h2 className="text-display-sm text-ink mb-6">Engine Architecture.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 bg-canvas border border-hairline rounded-lg card-shadow-lvl3 hover:border-hairline-strong hover:card-shadow-lvl4 transition-[border-color,box-shadow] duration-200 group"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] text-mute tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans font-semibold text-sm text-ink group-hover:text-link transition-colors">
                  {f.title}
                </h3>
              </div>
              <p className="font-sans text-xs text-body leading-relaxed pl-6">{f.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Technical Specifications Table */}
      <Reveal className="mb-14" delay={0.05}>
        <h2 className="text-display-sm text-ink mb-6">Technical Specifications.</h2>
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
                  <td className="px-5 py-3 font-medium text-ink">{spec.name}</td>
                  <td className="px-5 py-3 text-body font-mono">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Footer / Links */}
      <Reveal delay={0.05}>
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-sans text-xs text-body hover:text-ink transition-colors group"
          >
            <GithubMark size={14} />
            <span>Repository</span>
            <ArrowUpRight size={12} className="text-mute group-hover:text-ink transition-colors" />
          </a>
          <div className="font-mono text-[9px] text-mute uppercase tracking-wider">
            © 2026 SONIVIO SYSTEMS // ALL RIGHTS RESERVED.
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default About;
