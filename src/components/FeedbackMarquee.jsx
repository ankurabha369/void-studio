// src/components/FeedbackMarquee.jsx
import React, { useRef, useEffect } from 'react';

// Mock Data for Feedbacks
const testimonials = [
  {
    id: 1,
    name: "Alex Vonder",
    role: "CTO, Nexus Tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    content: "Void Studio transformed our vague concept into a digital masterpiece. The 'V' identity is iconic.",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Founder, Orbit Startups",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Minimal, aggressive, and professional. Exactly what we needed to stand out in the fintech noise.",
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Director, Solstice Systems",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content: "The dark mode aesthetic they built for us increased our user engagement by 40%. Incredible work.",
  },
  {
    id: 4,
    name: "Elena Ross",
    role: "Product Lead, Aether",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    content: "Fast, responsive, and aesthetically perfect. Void Studio lives up to the name—limitless potential.",
  },
  {
    id: 5,
    name: "David K.",
    role: "CEO, DarkMatter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    content: "They understand the 'cyber' aesthetic better than anyone. Our rebranding was seamless.",
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "VP Marketing, Flux Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content: "Serious authority. That's what their design gave us. We closed our Series B two weeks after launch.",
  },
];

const FeedbackCard = ({ data }) => (
  <div className="w-[350px] flex-shrink-0 p-6 mx-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-lime-400/50 transition-colors duration-300 group">
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-lime-400 transition-colors duration-300">
          <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-500 rounded-full border-2 border-black"></div>
      </div>
      <div>
        <h3 className="text-white font-bold text-sm tracking-wide">{data.name}</h3>
        <p className="text-gray-500 text-xs font-mono">{data.role}</p>
      </div>
    </div>
    <p className="text-gray-500 text-sm leading-relaxed italic">"{data.content}"</p>
  </div>
);

const FeedbackMarquee = ({ gsapLoaded }) => {
  // 1. Corrected variable names to match what is used in useEffect
  const feedbackTitleRef = useRef(null); 
  const marqueeRef = useRef(null);
  const sectionRef = useRef(null);  

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      // Animate Title
      if (feedbackTitleRef.current) {
        window.gsap.from(feedbackTitleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: feedbackTitleRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // Animate Marquee Container Entrance
      if (marqueeRef.current) {
        window.gsap.from(marqueeRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        });
      }
    }
  }, [gsapLoaded]);

  return (
    // UPDATED: Changed id="feedback" to id="feedbacks" to match Header.jsx
    <section id="feedbacks" ref={sectionRef} className="bg-gray-100 dark:bg-black text-white py-6 relative overflow-hidden">
       {/* Injecting CSS Animation Styles for the Marquee loop */}
       <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Section Title - 3. Used correct ref name 'feedbackTitleRef' */}
        <div ref={feedbackTitleRef} className="text-center mb-16">
            <h2 className="text-lime-600 font-mono text-sm tracking-[0.2em] mb-4 uppercase">Client Validation</h2>
            <h2 className="text-5xl font-bold text-black dark:text-white font-heading">
                Voices from <span className="text-transparent bg-clip-text bg-gradient-to-b from-lime-300 to-lime-700/100">The Voids</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
            We don't just build websites; we build authority. Here is what the industry leaders are saying about our impact.
            </p>
        </div>

        {/* Marquee Content */}
        <div ref={marqueeRef} className="relative w-full overflow-hidden">
             {/* Gradient Masks */}
            <div className="absolute top-0 left-0 w-32 h-full z-20 bg-gradient-to-r from-gray-100 dark:from-black to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full z-20 bg-gradient-to-l from-gray-100 dark:from-black to-transparent pointer-events-none"></div>

            {/* Single Row: Scrolling Left */}
            <div className="flex w-max animate-scroll-left pause-on-hover">
                {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                    <FeedbackCard key={`row1-${index}`} data={item} />
                ))}
            </div>
        </div>

        {/* Call to Action */}
        <div className="mt-4 text-center border-t border-white/10 pt-6">
             <h3 className=" text-black dark:text-white text-2xl font-bold">Ready to enter the Void?</h3>
        </div>

      </div>
    </section>
  );
};

export default FeedbackMarquee;