// src/components/ProjectCard.jsx
import React, { useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../App'; // Import ThemeContext from App

const ProjectCard = ({ title, category, imageUrl, gsapLoaded }) => {
  const cardRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      window.gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: cardRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
  }, [gsapLoaded]);

  const handleMouseEnter = () => {
    if (gsapLoaded && window.gsap) {
      const shadowColor = theme === 'dark' ? "rgba(50, 205, 50, 0.4)" : "rgba(101, 163, 13, 0.3)";
      window.gsap.to(cardRef.current, { scale: 1.05, boxShadow: `0 0 30px ${shadowColor}`, duration: 0.3 });
      window.gsap.to(cardRef.current.querySelector('img'), { scale: 1.1, duration: 0.3 });
    }
  };
  const handleMouseLeave = () => {
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

export default ProjectCard;