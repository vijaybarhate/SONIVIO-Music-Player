import { useState, useEffect } from 'react';

export const useCurrentPath = () => {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const updatePath = () => {
      // Clean up base path for comparison if deployed in subdirectories (like GitHub Pages path)
      const currentPath = window.location.pathname;
      setPath(currentPath);
    };

    updatePath();

    // Listen to Astro transition events
    document.addEventListener('astro:after-swap', updatePath);
    document.addEventListener('astro:page-load', updatePath);
    window.addEventListener('popstate', updatePath);

    return () => {
      document.removeEventListener('astro:after-swap', updatePath);
      document.removeEventListener('astro:page-load', updatePath);
      window.removeEventListener('popstate', updatePath);
    };
  }, []);

  return path;
};
