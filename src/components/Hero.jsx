// src/components/Hero.jsx
import React, { useRef, useEffect, useContext } from 'react';
import StaggeredText from './StaggeredText';
import FloatingObject from './FloatingObject';
import LogoDisplay from './LogoDisplay'; // Import LogoDisplay
import { ArrowDown } from 'lucide-react';
import { ThemeContext } from '../App'; // Import ThemeContext from App



// --- Add your transparent image URLs here ---
const FLOATING_IMAGE_URLS = [
  'css.png',
  'html.png',
  'react.png',
  'mongodb.png',
  'tailwind.png',
  'js.png',
  'sql.png',
];
// --- End of new image URLs ---

const Hero = ({ gsapLoaded }) => {
  const heroRef = useRef(null);
  const heroLogoRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  // Placeholder texture image URLs. Replace these with your actual image paths or external URLs.
  // const DARK_TEXTURE_URL = ''; 
  // const LIGHT_TEXTURE_URL = '';
  // const currentTextureUrl = theme === 'dark' ? DARK_TEXTURE_URL : LIGHT_TEXTURE_URL;

  const scrollToWork = () => {
    // Tries to find 'work' section first, then 'samples'
    const targetSection = document.getElementById('work') || document.getElementById('samples');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
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
  }, [gsapLoaded, theme]);

  return (
    <section id="home" ref={heroRef} className="h-screen w-full flex flex-col justify-center items-center text-center relative overflow-hidden bg-white dark:bg-black px-4">
      {/* Background Grid */}
      <div className="absolute inset-0  z-0" style={{
        backgroundImage: theme === 'dark'
          ? `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`
          : `linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}></div>

      {/* Floating Objects */}
      <div className="absolute inset-0 z-10">
        {FLOATING_IMAGE_URLS.map((url, index) => {
          const positions = [
            // Top Left (High on Top, Low on Left)
            { top: '5%', left: '10%' },
            
            // Top Center (High on Top, Near Center Left)
            { top: '15%', left: '30%' }, 
            
            // Top Right (High on Top, High on Right)
            { top: '10%', left: '90%' },
            
            // Middle Right (Avoids 50% Top)
            { top: '40%', left: '95%' },
            
            // Bottom Left (Low on Left, High on Bottom)
            { top: '85%', left: '5%' },
            
            // Bottom Center (High on Bottom, Near Center Right)
            { top: '90%', left: '70%' },
            
            // Middle Left (Avoids 50% Top)
            { top: '60%', left: '5%' }
          ];
          const sizes = [100, 60, 80, 50, 45];
          return (
            <FloatingObject
              key={index}
              imageUrl={url}
              size={sizes[index % sizes.length]}
              position={positions[index % positions.length]}
              gsapLoaded={gsapLoaded}
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
          We are a design team building the digital face of tomorrow.<br />Bold, fluid, and unforgettable.
        </p>
    

        <div className=" text-center border-t border-white/10">
             <h3 className="text-2xl font-bold mb-6">Ready to enter the Void?</h3>
             <button 
             onClick={scrollToWork}
             className="group relative px-8 py-3 bg-white border-2 border-lime-400 dark:border-0 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-lime-400 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                <span className="relative group-hover:text-black transition-colors z-10">Explore<ArrowDown className="inline-block ml-2" /></span>
            </button>
        </div>
      </div>
      <div className='fixed bottom-0 right-0 m-4 z-50 hover:scale-105  transition-transform duration-300 hover:-translate-y-8 '> 
        <a href="" target='_blank' className=' flex items-center justify-center backdrop-blur-md bg-white/50 hover:bg-[#4caf50]  text-lime-600 hover:text-white  dark:bg-black/50 border-b border-gray-400 dark:border-lime-500/20  rounded-full'>
          <img src="whatsapp.png" alt="Whatsapp Logo" className="w-10 h-10 m-3"/>
          <p className='font-mono font-bold  mr-6'>Chat</p>
        </a>
      </div>

    </section>
  );
};

export default Hero;