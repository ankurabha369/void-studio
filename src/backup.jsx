import React, { useState, useEffect, useRef, createContext, useContext, Profiler } from 'react';
import { Menu, X, ArrowUpRight, Github, Linkedin, Twitter, Sun, Moon, Send } from 'lucide-react';
import ProfileDirectory from './components/profiledirectory';
import ImageCarousel from './components/ImageCarousel';
// --- REMOVED GSAP Imports ---
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// --- Create Theme Context ---
const ThemeContext = createContext(null);

// Assume your logo is placed in the `public` folder of your Vite project
const VOID_STUDIO_LOGO_URL = '/logo.png'; // CHANGE THIS to your logo path in /public (e.g., /void-logo-white.svg)

// --- Add your transparent image URLs here ---
// Place your images in the /public folder (e.g., /public/image1.png)
// and update these paths.
const FLOATING_IMAGE_URLS = [
  './public/1.png', // Assumes shape-01.svg is in /public
  './public/2.png', // Assumes shape-02.svg is in /public
  './public/3.png', // Assumes shape-03.svg is in /public
  './public/4.png', // Assumes shape-04.svg is in /public
  './public/me.png', // Assumes shape-04.svg is in /public
  './public/6.png', // Assumes shape-04.svg is in /public
  './public/7.png', // Assumes shape-04.svg is in /public


];
// --- End of new image URLs ---

// --- Logo Display Component ---
const LogoDisplay = ({ id }) => (
  <img
    id={id}
    src={'./public/logo.png'} // Update path as needed
    alt="Void Studio Logo"
    className="h-full w-full object-contain dark:invert dark:brightness-[1.75]" // Adjust filter as needed based on your logo
    onError={(e) => e.target.src = 'https://placehold.co/100x40/000000/FFFFFF?text=Logo'} // Simple fallback
  />
);

// --- Header Component ---
const Header = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const [activeLink, setActiveLink] = useState('Home');
  const highlightRef = useRef(null);
  const navLinksRef = useRef({});
  const navContainerRef = useRef(null);
  const navLinks = ['Home', 'Work', 'Team', 'Contact'];
  const isUserScrolling = useRef(false);

  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap) {
      window.gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  const handleHighlightUpdate = (linkName) => {
    const linkEl = navLinksRef.current[linkName];
    // --- ADDED CHECK ---
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
    // --- ADDED CHECK ---
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
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  useEffect(() => {
    // --- ADDED CHECK ---
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
  }, [gsapLoaded, navLinks]); // --- ADDED gsapLoaded ---

  const handleNavClick = (e, link) => {
    e.preventDefault();
    handleHighlightUpdate(link);
    const sectionEl = document.querySelector(`#${link.toLowerCase()}`);
    // --- ADDED CHECK ---
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
    if (isOpen) setIsOpen(false); // Close mobile menu on click
  };


  return (
    <header ref={headerRef} className="fixed top-0 left-0 my-3 mx-12 rounded-2xl right-0 z-50  backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-gray-300 dark:border-lime-500/20">
      <nav className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center h-8 md:h-10">
          <LogoDisplay id="header-logo" />
        </div>
        <div ref={navContainerRef} className="hidden md:flex space-x-2 relative">
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
            onClick={(e) => handleNavClick(e, 'Contact')} // Use handler for smooth scroll
            className="flex items-center space-x-2 bg-lime-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-lime-600 dark:bg-lime-400 dark:hover:bg-lime-300 transition-all duration-300 transform hover:scale-105"
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
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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


// --- Staggered Text Component ---
const StaggeredText = ({ text, className, delay = 0, gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const textRef = useRef(null);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && textRef.current && window.gsap) {
      // Ensure children are spans
      if (!textRef.current.children || textRef.current.children.length === 0 || textRef.current.children[0].tagName !== 'SPAN') {
        textRef.current.innerHTML = text.split('').map(char =>
          `<span class="inline-block">${char === ' ' ? '\u00A0' : char}</span>`
        ).join('');
      }

      const children = Array.from(textRef.current.children);
      if (children.length > 0) {
        window.gsap.fromTo(children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.05,
            delay: delay
          }
        );
      }
    }
  }, [gsapLoaded, delay, text]); // --- ADDED gsapLoaded ---

  // Apply font class directly using Tailwind variable defined in index.css
  return (
    <div ref={textRef} className={`${className} font-heading`} aria-label={text}>
      {/* Content will be generated by useEffect */}
    </div>
  );
};


// --- Floating Object Component ---
const FloatingObject = ({ imageUrl, size, position, gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const objRef = useRef(null);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && objRef.current && window.gsap && window.gsap.utils) {
      const randX = window.gsap.utils.random(-100, 50, 10);
      const randY = window.gsap.utils.random(-100, 90, 10);
      const randScale = window.gsap.utils.random(0.5, 1.5, 0.8);
      const randRotate = window.gsap.utils.random(-360, 360, 30);
      const randDelay = window.gsap.utils.random(0.5, 1.5, 0.2);
      const randDuration = window.gsap.utils.random(10, 20, 1);

      window.gsap.set(objRef.current, {
        x: randX, y: 200, scale: randScale, rotation: randRotate, opacity: 0
      });

      const tl = window.gsap.timeline({ delay: randDelay });
      tl.to(objRef.current, {
        y: randY,
        opacity: window.gsap.utils.random(1, 1),
        duration: window.gsap.utils.random(1, 2, 0.5),
        ease: "power2.out"
      });
      tl.to(objRef.current, {
        x: window.gsap.utils.random(-100, 100, 10),
        y: window.gsap.utils.random(-100, 100, 10),
        scale: window.gsap.utils.random(0.5, 1.5, 0.1),
        rotation: window.gsap.utils.random(-360, 360, 30),
        duration: randDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  const style = {
    position: 'absolute', ...position, width: size, height: size,
  };

  return (
    <div ref={objRef} style={style} className="opacity-50 dark:opacity-30">
      <img
        src={imageUrl}
        alt="Floating decorative object"
        className="w-full h-full object-contain"
        onError={(e) => { e.target.src = `https://placehold.co/${size}x${size}/111111/FFFFFF?text=X`; }}
      />
    </div>
  );
};


// --- Hero Component ---
const Hero = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const heroRef = useRef(null);
  const heroLogoRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      const headerLogo = document.getElementById('header-logo');
      const heroLogo = heroLogoRef.current;

      if (headerLogo && heroLogo) {
        window.gsap.set(headerLogo, { opacity: 0 });
        setTimeout(() => {
          if (!headerLogo || !heroLogo) return;
          const finalRect = headerLogo.getBoundingClientRect();
          const startRect = heroLogo.getBoundingClientRect();
          if (startRect.width === 0) return;
          const deltaX = finalRect.left - startRect.left;
          const deltaY = finalRect.top - startRect.top;
          const deltaScale = finalRect.width / startRect.width;

          window.gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current, start: "top top", end: "bottom 70%", scrub: 1,
            }
          })
            .to(heroLogo, { x: deltaX, y: deltaY, scale: deltaScale, ease: "power2.inOut" })
            .to(heroLogo, { opacity: 0 }, "<")
            .to(headerLogo, { opacity: 1 }, "<");
        }, 100);
      }

      if (taglineRef.current && buttonRef.current) {
        const tl = window.gsap.timeline({ defaults: { ease: "power3.out" }, delay: 1.0 });
        tl.from(taglineRef.current, { opacity: 0, y: 20, duration: 1.2 })
          .from(buttonRef.current, { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3");

        window.gsap.to(buttonRef.current, {
          boxShadow: theme === 'dark' ? "0 0 30px 10px rgba(50, 205, 50, 0.5)" : "0 0 30px 10px rgba(101, 163, 13, 0.4)",
          repeat: -1, yoyo: true, duration: 2, ease: "power1.inOut",
        });
      }
    }
  }, [gsapLoaded, theme]); // --- ADDED gsapLoaded ---

  return (
    <section id="home" ref={heroRef} className="h-screen w-full flex flex-col justify-center items-center text-center relative overflow-hidden bg-white dark:bg-black px-4">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: theme === 'dark'
          ? `linear-gradient(to right, rgb(50 205 50 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(50 205 50 / 0.1) 1px, transparent 1px)`
          : `linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}></div>

      {/* Floating Objects */}
      <div className="absolute inset-0 z-10">
        {FLOATING_IMAGE_URLS.map((url, index) => {
           const positions = [
             { top: '15%', left: '10%' }, { top: '25%', left: '80%' },
             { top: '70%', left: '20%' }, { top: '80%', left: '90%' },
             { top: '40%', left: '50%' }
           ];
           const sizes = [100, 60, 80, 50, 45];
           return (
             <FloatingObject
               key={index}
               imageUrl={url}
               size={sizes[index % sizes.length]}
               position={positions[index % positions.length]}
               gsapLoaded={gsapLoaded} // Pass prop
             />
           )
        })}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center">
        <div ref={heroLogoRef} className="w-24 md:w-32 mb-8">
          <LogoDisplay />
        </div>
        <StaggeredText text="DESIGN BEYOND" gsapLoaded={gsapLoaded} className="text-5xl sm:text-6xl md:text-8xl font-bold text-gray-900 dark:text-white tracking-tighter flex justify-center" />
        <StaggeredText text="THE VOID" gsapLoaded={gsapLoaded} delay={0.3} className="text-5xl sm:text-6xl md:text-8xl font-bold text-lime-600 dark:text-lime-400 tracking-tighter flex justify-center" />
        <p ref={taglineRef} className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto font-sans">
          We are a Genz design team building the digital face of tomorrow.<br />Bold, fluid, and unforgettable.
        </p>
        <a href="#work" ref={buttonRef} onClick={(e) => { e.preventDefault(); const el = document.querySelector('#work'); if (el && window.gsap && window.ScrollToPlugin) window.gsap.to(window, { duration: 1.2, scrollTo: el, ease: 'power2.inOut' }); }} className="mt-10 px-8 py-4 bg-lime-500 text-black font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 dark:bg-lime-400" style={{ boxShadow: theme === 'dark' ? '0 0 15px 5px rgba(50, 205, 50, 0.3)' : '0 0 15px 5px rgba(101, 163, 13, 0.4)' }}>
          See Our Work
        </a>
      </div>
    </section>
  );
};


// --- Project Card Component ---
const ProjectCard = ({ title, category, imageUrl, gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const cardRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      window.gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: cardRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  const handleMouseEnter = () => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap) {
      const shadowColor = theme === 'dark' ? "rgba(50, 205, 50, 0.4)" : "rgba(101, 163, 13, 0.3)";
      window.gsap.to(cardRef.current, { scale: 1.05, boxShadow: `0 0 30px ${shadowColor}`, duration: 0.3 });
      window.gsap.to(cardRef.current.querySelector('img'), { scale: 1.1, duration: 0.3 });
    }
  };
  const handleMouseLeave = () => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap) {
      const shadowColor = theme === 'dark' ? "rgba(50, 205, 50, 0.2)" : "rgba(101, 163, 13, 0.1)";
      window.gsap.to(cardRef.current, { scale: 1, boxShadow: `0 0 15px ${shadowColor}`, duration: 0.3 });
      window.gsap.to(cardRef.current.querySelector('img'), { scale: 1, duration: 0.3 });
    }
  };

  return (
    <div ref={cardRef} className="bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-lime-500/20 rounded-xl overflow-hidden cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ boxShadow: theme === 'dark' ? '0 0 15px rgba(50, 205, 50, 0.2)' : '0 0 15px rgba(101, 163, 13, 0.1)' }}>
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400/111/FFF?text=Error'} />
      <div className="p-6">
        <p className="text-lime-600 dark:text-lime-400 text-sm font-semibold">{category}</p>
        <h3 className="text-gray-900 dark:text-white text-2xl font-bold mt-2">{title}</h3>
      </div>
    </div>
  );
};


// --- Work Component ---
const Work = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const workTitleRef = useRef(null);
  const workSubtitleRef = useRef(null);
  const workSectionRef = useRef(null);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (workTitleRef.current && workSubtitleRef.current) {
        const tl = window.gsap.timeline({ scrollTrigger: { trigger: workSectionRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
        tl.from(workTitleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(workSubtitleRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");
      }
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  const projects = [
    { title: "Project Alpha", category: "Branding / Web Design", imageUrl: "https://placehold.co/600x400/000000/34d399?text=Alpha" },
    { title: "CyberCore UI", category: "UX/UI Design", imageUrl: "https://placehold.co/600x400/222222/34d399?text=CyberCore" },
    { title: "NeoWave Motion", category: "Motion Graphics", imageUrl: "https://placehold.co/600x400/111111/34d399?text=NeoWave" },
    { title: "FutureWear", category: "E-commerce", imageUrl: "https://placehold.co/600x400/333333/34d399?text=FutureWear" },
  ];

  return (
    <section id="work" ref={workSectionRef} className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 ref={workTitleRef} className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-4 font-heading">
          Our <span className="text-lime-600 dark:text-lime-400">Samples</span>
        </h2>
        <p ref={workSubtitleRef} className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-xl mx-auto mb-16 font-sans">
          A glimpse into the void. We don't just design; we create experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => <ProjectCard key={project.title} {...project} gsapLoaded={gsapLoaded} />)} Pass prop
        </div>
      </div>
    </section>
  );
};




// --- Team Component ---
const Team = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const teamTitleRef = useRef(null);
  const teamSectionRef = useRef(null);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (teamTitleRef.current) {
        window.gsap.from(teamTitleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: teamSectionRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---


  return (
    <section id="team" ref={teamSectionRef} className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 ref={teamTitleRef} className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-16 font-heading">
          Meet the <span className="text-lime-600 dark:text-lime-400">Team</span>
        </h2>
        <div className="">
          <ProfileDirectory gsapLoaded={gsapLoaded} /> {/* Pass prop */}
        </div>
      </div>
    </section>
  );
};


// --- Contact Component ---
const Contact = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const contactRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (titleRef.current) {
        window.gsap.from(titleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: contactRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
      }
      if (formRef.current) {
        window.gsap.from(formRef.current.children, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.2, scrollTrigger: { trigger: formRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

  const inputStyle = "w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-lime-500/20 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-600 font-sans";

  return (
    <section id="contact" ref={contactRef} className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 ref={titleRef} className="text-5xl font-bold text-gray-900 dark:text-white mb-12 font-heading">
          Let's <span className="text-lime-600 dark:text-lime-400">Collaborate</span>
        </h2>
        <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Your Name" className={inputStyle} aria-label="Your Name" />
            <input type="email" placeholder="Your Email" className={inputStyle} aria-label="Your Email" />
          </div>
          <textarea placeholder="Your Message" rows="6" className={inputStyle} aria-label="Your Message"></textarea>
          <button type="submit" className="flex items-center justify-center space-x-2 w-full md:w-auto px-8 py-4 bg-lime-500 text-black font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 dark:bg-lime-400 dark:hover:bg-lime-300 mx-auto" style={{ boxShadow: theme === 'dark' ? '0 0 20px 5px rgba(50, 205, 50, 0.3)' : '0 0 20px 5px rgba(101, 163, 13, 0.4)' }}>
            <span>Send Message</span>
            <Send size={20} />
          </button>
        </form>
      </div>
    </section>
  );
};


// --- Footer Component ---
const Footer = ({ gsapLoaded }) => { // --- ADDED BACK gsapLoaded prop ---
  const footerRef = useRef(null);

  useEffect(() => {
    // --- ADDED CHECK ---
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (footerRef.current) {
        window.gsap.from(footerRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out", scrollTrigger: { trigger: footerRef.current, start: "top 95%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]); // --- ADDED gsapLoaded ---

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
          <a href="#" aria-label="GitHub" className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"><Github size={24} /></a>
          <a href="#" aria-label="LinkedIn" className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"><Linkedin size={24} /></a>
          <a href="#" aria-label="Twitter" className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"><Twitter size={24} /></a>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-sans">
          © {new Date().getFullYear()} Void Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};


// --- Main App Component ---
function App() {
  const [theme, setTheme] = useState('dark');
  const [gsapLoaded, setGsapLoaded] = useState(false); // --- ADDED BACK STATE ---

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // --- ADDED BACK SCRIPT LOADING useEffect ---
  useEffect(() => {
    // Check if scripts are already loaded
    if (window.gsap && window.ScrollTrigger && window.gsap.utils && window.ScrollToPlugin) {
       // Ensure plugins are registered
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
                 // Scripts loaded but might not be on window yet, retry check
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
  // --- END OF SCRIPT LOADING ---


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Base font set in index.css */}
      <div className="font-sans antialiased transition-colors duration-300">        
        <Header gsapLoaded={gsapLoaded} /> {/* Pass prop */}
        <main>
          <Hero gsapLoaded={gsapLoaded} /> {/* Pass prop */}
          <Work gsapLoaded={gsapLoaded} /> {/* Pass prop */}
          <Team gsapLoaded={gsapLoaded} /> {/* Pass prop */}
          <p/>
          <Contact gsapLoaded={gsapLoaded} /> {/* Pass prop */}
        </main>
        <Footer gsapLoaded={gsapLoaded} /> {/* Pass prop */}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

