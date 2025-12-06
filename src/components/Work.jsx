// src/components/Work.jsx
import React, { useRef, useEffect } from 'react';
import ProjectCard from './ProjectCard'; // Import ProjectCard

const Work = ({ gsapLoaded }) => {
  const workTitleRef = useRef(null);
  const workSubtitleRef = useRef(null);
  const workSectionRef = useRef(null);

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (workTitleRef.current && workSubtitleRef.current) {
        const tl = window.gsap.timeline({ scrollTrigger: { trigger: workSectionRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
        tl.from(workTitleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(workSubtitleRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");
      }
    }
  }, [gsapLoaded]);

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
          {projects.map((project) => <ProjectCard key={project.title} {...project} gsapLoaded={gsapLoaded} />)}
        </div>
      </div>
    </section>
  );
};

export default Work;