// src/App.jsx
import React, { useState, useEffect, createContext } from 'react';

// Import all your components
import Header from './components/Header';
import Hero from './components/Hero';
// import Work from './components/Work';
import Team from './components/Team';
import Footer from './components/Footer';
import Contact from './components/Contact';
import WorksCarousel from './components/WorkCarousel';
import FeedbackMarquee from './components/FeedbackMarquee';
// --- Create Theme Context (Export it so other components can use it) ---
export const ThemeContext = createContext(null); // Exported!

// Main App Component
function App() {
  const [theme, setTheme] = useState('light');
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Effect to apply dark/light class to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Effect to dynamically load GSAP and its plugins
  useEffect(() => {
    // Check if scripts are already loaded
    if (window.gsap && window.ScrollTrigger && window.gsap.utils && window.ScrollToPlugin) {
        if (!window.gsap.plugins || !window.gsap.plugins.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
        if (!window.gsap.plugins || !window.gsap.plugins.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);
        setGsapLoaded(true);
        return;
    }

    const loadScripts = () => {
        let scriptLoaded = false;
        let triggerLoaded = false;
        let scrollToLoaded = false;

        const checkAllLoaded = () => {
            if (scriptLoaded && triggerLoaded && scrollToLoaded && window.gsap && window.ScrollTrigger && window.gsap.utils && window.ScrollToPlugin) {
                if (!window.gsap.plugins || !window.gsap.plugins.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
                if (!window.gsap.plugins || !window.gsap.plugins.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);
                setGsapLoaded(true);
                console.log("GSAP and plugins loaded and registered.");
            } else if (scriptLoaded && triggerLoaded && scrollToLoaded) {
                console.warn("Scripts loaded but GSAP objects not found on window, retrying...");
                setTimeout(checkAllLoaded, 100);
            }
        };

      // Load GSAP Core
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.async = true;
      script.onload = () => { scriptLoaded = true; checkAllLoaded(); };
      script.onerror = () => console.error("Failed to load GSAP core script.");
      document.body.appendChild(script);

      // Load ScrollTrigger
      const triggerScript = document.createElement('script');
      triggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      triggerScript.async = true;
      triggerScript.onload = () => { triggerLoaded = true; checkAllLoaded(); };
      triggerScript.onerror = () => console.error("Failed to load GSAP ScrollTrigger script.");
      document.body.appendChild(triggerScript);

      // Load ScrollToPlugin
      const scrollToScript = document.createElement('script');
      scrollToScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js';
      scrollToScript.async = true;
      scrollToScript.onload = () => { scrollToLoaded = true; checkAllLoaded(); };
      scrollToScript.onerror = () => console.error("Failed to load GSAP ScrollToPlugin script.");
      document.body.appendChild(scrollToScript);
    }

    loadScripts();

  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="font-sans darkbg-black bg-white antialiased transition-colors duration-300" >
        {/* Pass gsapLoaded to all components that need it */}
        <Header gsapLoaded={gsapLoaded} />
        <main>
          <Hero gsapLoaded={gsapLoaded} />
          {/* <Work gsapLoaded={gsapLoaded} /> */}
          <WorksCarousel gsapLoaded={gsapLoaded} />
          <Team gsapLoaded={gsapLoaded} />
          <FeedbackMarquee gsapLoaded={gsapLoaded} />
          <Contact gsapLoaded={gsapLoaded} />
          
        </main>
        <Footer gsapLoaded={gsapLoaded} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;