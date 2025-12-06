// src/components/Footer.jsx
import React, { useRef, useEffect } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import LogoDisplay from './LogoDisplay'; // Import LogoDisplay

const Footer = ({ gsapLoaded }) => {
  const footerRef = useRef(null);

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (footerRef.current) {
        window.gsap.from(footerRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out", scrollTrigger: { trigger: footerRef.current, start: "top 95%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]);

  return (
    <footer ref={footerRef} className="py-16 bg-white dark:bg-black border-t border-gray-200 dark:border-lime-500/20">
      <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start h-8 md:h-10">
            <LogoDisplay />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-sans">Designing the digital frontier.</p>
        </div>
        <div className="flex space-x-6 mb-6 md:mb-0">
          <a href="#" aria-label="GitHub" className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"><Github size={40} /></a>
          <a href="#" aria-label="LinkedIn" className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"><Linkedin size={40} /></a>
          <a href="#" aria-label="Twitter" className="text-gray-500 text-4xl font-normal dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors">X</a>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-sans">
          © {new Date().getFullYear()} Void Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;