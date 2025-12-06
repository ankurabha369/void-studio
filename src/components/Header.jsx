// src/components/Header.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import LogoDisplay from './LogoDisplay'; // Import LogoDisplay
import { ThemeContext } from '../App'; // Import ThemeContext from App

const Header = ({ gsapLoaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const [activeLink, setActiveLink] = useState('Home');
  const highlightRef = useRef(null);
  const navLinksRef = useRef({});
  const navContainerRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navLinks = ['Home', 'Work', 'Team', 'Feedbacks'];
  const isUserScrolling = useRef(false);

  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (gsapLoaded && window.gsap) {
      window.gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, [gsapLoaded]);

  const handleHighlightUpdate = (linkName) => {
    const linkEl = navLinksRef.current[linkName];
    if (linkEl && highlightRef.current && window.gsap) {
      window.gsap.to(highlightRef.current, {
        left: linkEl.offsetLeft,
        width: linkEl.offsetWidth,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
      setActiveLink(linkName);
    }
  };

  useEffect(() => {
    if (gsapLoaded && navContainerRef.current && window.gsap) {
      const setInitialHighlight = () => {
        const linkEl = navLinksRef.current['Home'];
        if (linkEl && linkEl.offsetWidth > 0 && highlightRef.current) {
          window.gsap.set(highlightRef.current, {
            left: linkEl.offsetLeft,
            width: linkEl.offsetWidth,
            opacity: 1
          });
          setActiveLink('Home');
        } else {
          requestAnimationFrame(setInitialHighlight);
        }
      };
      const initTimeout = setTimeout(setInitialHighlight, 100);
      return () => clearTimeout(initTimeout);
    }
  }, [gsapLoaded]);

  useEffect(() => {
    if (gsapLoaded && navContainerRef.current && window.ScrollTrigger) {
      let scrollTriggers = [];
      const createTriggers = () => {
        scrollTriggers.forEach(t => t.kill());
        window.ScrollTrigger.refresh();
        scrollTriggers = navLinks.map(link => {
          const sectionId = `#${link.toLowerCase()}`;
          const sectionEl = document.querySelector(sectionId);
          if (sectionEl) {
            return window.ScrollTrigger.create({
              trigger: sectionId,
              start: "top 50%",
              end: "bottom 50%",
              onEnter: () => !isUserScrolling.current && handleHighlightUpdate(link),
              onEnterBack: () => !isUserScrolling.current && handleHighlightUpdate(link)
            });
          }
          return null;
        }).filter(t => t !== null);
      };
      const setupTimeout = setTimeout(() => {
        createTriggers();
        window.addEventListener('resize', createTriggers);
      }, 500);

      return () => {
        clearTimeout(setupTimeout);
        scrollTriggers.forEach(t => t.kill());
        window.removeEventListener('resize', createTriggers);
      };
    }
  }, [gsapLoaded, navLinks]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    handleHighlightUpdate(link);
    const sectionEl = document.querySelector(`#${link.toLowerCase()}`);
    if (sectionEl && window.gsap && window.ScrollToPlugin) {
      isUserScrolling.current = true;
      window.gsap.to(window, {
        duration: 1.2,
        scrollTo: sectionEl,
        ease: 'power2.inOut',
        onComplete: () => {
          isUserScrolling.current = false;
        }
      });
    }
    if (isOpen) setIsOpen(false);
  };

  return (
    <header ref={headerRef} className="fixed top-0  z-50  my-3 mx-4 md:mx-12 rounded-2xl right-0 left-0   backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-gray-300 dark:border-lime-500/20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center h-8 gap-2 m-2 md:h-10">
          <LogoDisplay id="header-logo" />
          <div className='dark:text-white flex items-baseline gap-1 font-bold'>
            <p className='text-lime-400 text-2xl flex items-end '>Void</p>
            <span className='flex items-end text'>Studio</span>
          </div>

        </div>
        <div ref={navContainerRef} className="hidden md:flex  space-x-auto relative">
          <div
            ref={highlightRef}
            className="absolute bg-lime-600/20 dark:bg-lime-400/20 backdrop-blur-sm rounded-full h-8"
            style={{ opacity: 0 }}
          />
          {navLinks.map((link) => (
            <a
              key={link}
              ref={(el) => (navLinksRef.current[link] = el)}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, link)}
              className={`relative z-10 flex items-center justify-center h-8 px-4 rounded-full transition-colors duration-300 ${activeLink === link ? 'text-lime-600 dark:text-lime-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400'
                }`}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'Contact')}
            className="flex  items-center space-x-2 bg-lime-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-lime-600 dark:bg-lime-400 dark:hover:bg-lime-300 transition-all duration-300 transform hover:scale-105"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={18} />
          </a>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 dark:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div className={`md:hidden  overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-2 space-y-4 bg-white/95 dark:bg-black/95 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, link)}
              className="block text-gray-700 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400 transition-colors duration-300 py-2"
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'Contact')}
            className="flex items-center justify-center space-x-2 bg-lime-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-lime-600 dark:bg-lime-400 dark:hover:bg-lime-300 transition-all duration-300"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;