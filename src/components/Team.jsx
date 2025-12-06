// src/components/Team.jsx
import React, { useRef, useEffect } from 'react';
import ProfileDirectory from './ProfileDirectory'; // Import ProfileDirectory

const Team = ({ gsapLoaded }) => {
  const teamTitleRef = useRef(null);
  const teamSectionRef = useRef(null);

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (teamTitleRef.current) {
        window.gsap.from(teamTitleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: teamSectionRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]);

  return (
    <section id="team" ref={teamSectionRef} className=" bg-white dark:bg-black py-24">
      <div className="container  mx-auto max-w-7xl px-6">
        <h2 ref={teamTitleRef} className=" text-5xl font-bold text-center text-gray-900  dark:text-white mb-16 font-heading">
          Meet the <span className="text-lime-600 dark:text-lime-400">Team</span>
        </h2>
        <div className="">
        <ProfileDirectory gsapLoaded={gsapLoaded} />
        </div>
      </div>
    </section>
  );
};

export default Team;