// src/components/WorksCarousel.jsx
import React, { useState, useCallback, useLayoutEffect, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../App'; // Import ThemeContext for theme-based styles

// Define your work items with GIF, alt text, and a target URL
const WORK_ITEMS = [
    { id: 1, image:'Dainik.gif', alt: 'Your Daily Task Tracker', url: 'https://ankurabha369.github.io/daily-task-tracker/' },
    { id: 2, image: 'letsfocus.gif', alt: 'Drive into the Zen Mode', url: 'https://ankurabha369.github.io/LetsFocus/' },
    { id: 3, image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Interactive landing page showcasing a creative agency', url: 'https://voidstudio.co/agency-landing-page' },
    { id: 4, image:'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Brand identity and animated logo for a tech startup', url: 'https://voidstudio.co/tech-startup-branding' },
    { id: 5, image:'https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'A clean and modern portfolio website for a photographer', url: 'https://voidstudio.co/photographer-portfolio' },
    { id: 6, image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'User experience flow for a complex data visualization tool', url: 'https://voidstudio.co/data-viz-ux' },
];



const WorksCarousel = ({ gsapLoaded }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const galleryRef = useRef(null);
    const intervalRef = useRef(null);
    const animationContext = useRef(null);
    const totalItems = WORK_ITEMS.length;
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
    

    const { theme } = useContext(ThemeContext); // Use theme context

    const goToPrevious = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? totalItems - 1 : prevIndex - 1
        );
    }, [totalItems]);

    const goToNext = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === totalItems - 1 ? 0 : prevIndex + 1
        );
    }, [totalItems]);

    const pauseAutoPlay = () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
    };

    const startAutoPlay = useCallback(() => {
        pauseAutoPlay();
        intervalRef.current = window.setInterval(() => {
            goToNext();
        }, 4500); // Change item every 2.5 seconds
    }, [goToNext]);

    useEffect(() => {
        if (gsapLoaded) { // Only start autoplay if GSAP is loaded
            startAutoPlay();
        }
        return () => pauseAutoPlay();
    }, [startAutoPlay, gsapLoaded]); // Depend on gsapLoaded

    const handleManualNavigation = (navFunction) => {
        pauseAutoPlay();
        navFunction();
        // Give a moment before restarting autoplay, or just keep it paused for a bit.
        // Here, we restart immediately, but a delay (e.g., 5000ms) could also be added before calling startAutoPlay()
        startAutoPlay();
    };

    useLayoutEffect(() => {
        if (!gsapLoaded || !galleryRef.current || !window.gsap || totalItems === 0) return;

        if (!animationContext.current) {
            animationContext.current = window.gsap.context(() => {}, galleryRef.current);
        }

        animationContext.current.add(() => {
            const itemElements = window.gsap.utils.toArray('.carousel-item');

            itemElements.forEach((el, index) => {
                let offset = index - activeIndex;

                if (offset > totalItems / 2) offset -= totalItems;
                if (offset < -totalItems / 2) offset += totalItems;
                
                // const isCurrent = offset === 0;

                window.gsap.to(el, {
                    xPercent: offset * 55, // Horizontal position
                    z: -Math.abs(offset) * 300, // Z depth for 3D perspective
                    rotationZ: offset * 8, // Slight rotation for depth
                    scale: 1 - Math.abs(offset) * 0.2, // Scale down non-active items
                    opacity:1,
                    filter: `blur(${Math.abs(offset) * 5}px)`,
                    zIndex: totalItems - Math.abs(offset),
                    pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none', // Only prev/next/current are clickable
                    duration: 0.8,
                    ease: 'power3.out',
                });
            });
        });

    }, [activeIndex, totalItems, gsapLoaded]);

    useEffect(() => {
        return () => {
            animationContext.current?.revert();
        };
    }, []);
    
    
    if (totalItems === 0) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">No work items to display.</div>;
    }

    const shadowColor = theme === 'dark' ? "shadow-lime-500/50" : "shadow-lime-600/50";
    const highlightBorder = theme === 'dark' ? "border-lime-400" : "border-lime-600";

    return (
        <section id="work" ref={workSectionRef} className="bg-white dark:bg-black text-white font-sans flex flex-col items-center justify-center p-4 sm:p-6 ">
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-8 mt-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
                        Our <span className="text-lime-600 dark:text-lime-400">Works</span>
                    </h2>
                </header>
                <main className='overflow-x-hidden md:overflow-x-visible'>
                    <div className="text-center mt-6 h-10">
                        <p className="text-gray-600 dark:text-gray-300 italic transition-opacity duration-500 opacity-100 font-sans">
                            {WORK_ITEMS[activeIndex]?.alt || "Work description loading..."}
                        </p>
                    </div>

                    <div 
                        className="relative group w-full flex items-center justify-center py-4"
                        onMouseEnter={pauseAutoPlay}
                        onMouseLeave={startAutoPlay}
                    >
                        <div 
                            ref={galleryRef} 
                            className="relative w-full md:w-2/3 lg:w-1/2 aspect-video" 
                            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                        >
                            {WORK_ITEMS.map((item, index) => {
                                let offset = index - activeIndex;
                                if (offset > totalItems / 2) offset -= totalItems;
                                if (offset < -totalItems / 2) offset += totalItems;
                                
                                const isClickable = Math.abs(offset) === 1; // Only side items are directly clickable

                                return (
                                    <div
                                        key={item.id}
                                        className={`carousel-item absolute w-full h-full aspect-video transition-shadow duration-300 rounded-xl overflow-hidden
                                            ${isClickable ? `cursor-pointer hover:${shadowColor}` : (offset === 0 ? `${shadowColor}` : 'cursor-default')}
                                        `}
                                        style={{ willChange: 'transform, opacity, filter', transition: 'box-shadow 0.3s' }}
                                        onClick={() => {
                                            if (offset === 1) { // Clicked the next item
                                                handleManualNavigation(goToNext);
                                            } else if (offset === -1) { // Clicked the previous item
                                                handleManualNavigation(goToPrevious);
                                            } else if (offset === 0) { // Clicked the current (center) item
                                                if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
                                            }
                                        }}
                                    >
                                        <img
                                            src={item.image} //item.gif
                                            alt={item.alt}
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = `https://placehold.co/1280x720/000000/cccccc?text=GIF%20Loading%20Error`; 
                                            }}
                                            className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
                                        />
                                        {offset === 0 && (
                                            <div className={`absolute inset-0 bg-black bg-opacity-10 border-4 ${highlightBorder} pointer-events-none rounded-xl`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <NavigationButton 
                            direction="prev"
                            onClick={() => handleManualNavigation(goToPrevious)}
                            theme={theme}
                        />
                        <NavigationButton 
                            direction="next"
                            onClick={() => handleManualNavigation(goToNext)}
                            theme={theme}
                        />
                    </div>
                    <div className="text-center text-sm h-10">
                        <p className="text-gray-600 dark:text-gray-300 italic transition-opacity duration-500 opacity-100 font-sans">
                        Click to Visit.
                        </p>
                    </div>


                </main>

                <div className='mt-12 flex  p-8 text-black  dark:text-white  w-full  bg-lime-50 rounded-2xl dark:bg-gray-950 dark:border-2 border-lime-100/10'>

                    <div>
                        <h3 className='px-6 py-2 text-2xl shadow-sm text-lime-700 dark:text-white  rounded-2xl bg-white w-fit dark:bg-gray-900  font-bold mb-4 font-heading'><span className='font-mono font-light'>At a Glance :</span></h3>
                        <div className='p-3  text-gray-800 dark:text-gray-300 mb-6 font-sans flex justify-center flex-wrap gap-8 overflow-x-auto'>
                            <div className='bg-white dark:bg-gray-900 shadow-sm  dark:shadow-lime-200 min-h-32 w-44 rounded-md flex flex-col justify-around hover:scale-110 cursor-pointer transition-transform duration-300'>
                                <a href="https://ankurabha369.github.io/daily-task-tracker/" target="_blank" rel="noopener noreferrer" className='flex flex-col items-center justify-center'>
                                    <img className='p-2' src="Dainik.png" alt="Dainik" />
                                   <div className='p-2'><span className='font-bold'>Dainik: </span>The Daily Task Tracker</div>
                                </a>
                            </div>
                            <div className='bg-white dark:bg-gray-900 shadow-sm  dark:shadow-lime-200 min-h-32 w-44 rounded-md flex flex-col justify-around hover:scale-110 cursor-pointer transition-transform duration-300'>
                                <a href="https://ankurabha369.github.io/LetsFocus/" target="_blank" rel="noopener noreferrer" className='flex flex-col items-center justify-center'>
                                    <img className='p-2' src="letsfocus.png" alt="LetsFocus" />
                                   <div className='p-2'><span className='font-bold'>LetsFocus: </span>Into the Zen Mode</div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

// Extracted Navigation Button Component
const NavigationButton = ({ direction, onClick, theme }) => {
    const isPrev = direction === 'prev';
    const positionClasses = isPrev 
        ? "left-0 sm:left-4 md:left-12 lg:left-24" 
        : "right-0 sm:right-4 md:right-12 lg:right-24";
    
    const bgColorClass = theme === 'dark' ? "bg-lime-600 hover:bg-lime-700 active:bg-lime-800" : "bg-lime-500 hover:bg-lime-600 active:bg-lime-700";
    const focusRingColor = theme === 'dark' ? "focus:ring-lime-500/50" : "focus:ring-lime-600/50";

    const Icon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="h-8 w-8"
        >
            {isPrev ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            )}
        </svg>
    );

    return (
        <button
            onClick={onClick}
            className={`absolute top-1/2 ${positionClasses} -translate-y-1/2 z-40 
                        ${bgColorClass} 
                        text-black p-3 rounded-full shadow-lg 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 
                        focus:outline-none focus:ring-4 ${focusRingColor} 
                        transform hover:scale-105 active:scale-95`}
            aria-label={isPrev ? "Previous work" : "Next work"}
        >
            <Icon />
        </button>
    );
};

export default WorksCarousel;