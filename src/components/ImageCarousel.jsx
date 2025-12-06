import React, { useState, useCallback, useLayoutEffect, useRef, useEffect } from 'react';
// Assuming 'gsap' is available globally (as it was in the original HTML setup) or imported like below.
// If using a build system like Vite/CRA: import gsap from 'gsap'; 
// For this single-file context, we rely on the global 'gsap' object.

const IMAGES = [
    { id: 1, src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Lush green mountains under a cloudy sky' },
    { id: 2, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'A winding path through a misty green forest' },
    { id: 3, src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'A modern, luxurious house with a swimming pool at dusk' },
    { id: 4, src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Abstract image of a laptop with geometric light patterns' },
    { id: 5, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'A serene lake reflecting distant mountains and a dramatic sky' },
    { id: 6, src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Snowy mountain peak under a vibrant starry night sky' },
    { id: 7, src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1280&h=720&auto=format&fit=crop', alt: 'Sunlight filtering through trees onto a forest stream with mossy rocks' },
];

const ImageCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const galleryRef = useRef(null);
    const intervalRef = useRef(null);
    const animationContext = useRef(null); // Used for GSAP context management
    const totalImages = IMAGES.length;

    // --- Navigation Handlers ---

    const goToPrevious = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? totalImages - 1 : prevIndex - 1
        );
    }, [totalImages]);

    const goToNext = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === totalImages - 1 ? 0 : prevIndex + 1
        );
    }, [totalImages]);

    // --- Autoplay Logic ---

    const pauseAutoPlay = () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
    };

    const startAutoPlay = useCallback(() => {
        pauseAutoPlay();
        intervalRef.current = window.setInterval(() => {
            goToNext();
        }, 3000); // Change image every 3 seconds
    }, [goToNext]);

    useEffect(() => {
        startAutoPlay();
        // Cleanup function for autoplay interval
        return () => pauseAutoPlay();
    }, [startAutoPlay]);

    const handleManualNavigation = (navFunction) => {
        pauseAutoPlay();
        navFunction();
        // Restart autoplay after a slight delay or interaction (immediately restarting here)
        startAutoPlay();
    };

    // --- GSAP Animation Effect ---

    useLayoutEffect(() => {
        if (!galleryRef.current || !gsap || totalImages === 0) return;

        // Initialize or reuse GSAP context
        if (!animationContext.current) {
            animationContext.current = gsap.context(() => {}, galleryRef.current);
        }

        animationContext.current.add(() => {
            const imageElements = gsap.utils.toArray('.gallery-item');
            
            imageElements.forEach((el, index) => {
                let offset = index - activeIndex;

                // Handle wrapping (shortest path)
                if (offset > totalImages / 2) offset -= totalImages;
                if (offset < -totalImages / 2) offset += totalImages;
                
                const isCurrent = offset === 0;

                // GSAP animation properties
                gsap.to(el, {
                    xPercent: offset * 55, // Horizontal position
                    z: -Math.abs(offset) * 300, // Z depth for 3D perspective
                    rotationZ: offset * 8, // Slight rotation for depth
                    scale: 1 - Math.abs(offset) * 0.2, // Scale down non-active images
                    opacity: isCurrent ? 1 : 0.4,
                    filter: `blur(${Math.abs(offset) * 3}px) brightness(${1 - Math.abs(offset) * 0.4})`,
                    zIndex: totalImages - Math.abs(offset),
                    // Only allow clicking on previous/next and current for accessibility/usability
                    pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none',
                    duration: 0.8,
                    ease: 'power3.out',
                });
            });
        });

    }, [activeIndex, totalImages]);

    // Cleanup GSAP context on unmount
    useEffect(() => {
        return () => {
            animationContext.current?.revert();
        };
    }, []);
    
    // --- Render Logic ---

    if (totalImages === 0) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">No images to display.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-red font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            hello
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Interactive 3D Carousel
                    </h1>
                    <p className="mt-2 text-lg text-gray-400 font-medium">
                        GSAP-powered dynamic image gallery with auto-play.
                    </p>
                </header>
                <main>
                    {/* Carousel Container */}
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
                            {IMAGES.map((image, index) => {
                                let offset = index - activeIndex;
                                // Handle wrapping logic for click interaction mapping
                                if (offset > totalImages / 2) offset -= totalImages;
                                if (offset < -totalImages / 2) offset += totalImages;
                                
                                const isClickable = Math.abs(offset) === 1; // Only side images are directly clickable

                                return (
                                    <div
                                        key={image.id}
                                        // The 'gallery-item' class is crucial for the GSAP selection
                                        className={`gallery-item absolute w-full h-full aspect-video transition-shadow duration-300 rounded-xl overflow-hidden
                                            ${isClickable ? 'cursor-pointer hover:shadow-indigo-500/50' : (offset === 0 ? 'shadow-indigo-500/80' : 'cursor-default')}
                                        `}
                                        style={{ willChange: 'transform, opacity, filter', transition: 'box-shadow 0.3s' }}
                                        onClick={() => {
                                            if (isClickable) {
                                                // Navigate based on whether the clicked image is next (offset=1) or previous (offset=-1)
                                                handleManualNavigation(offset === 1 ? goToNext : goToPrevious);
                                            }
                                        }}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            // Fallback placeholder image for demonstration purposes
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = `https://placehold.co/1280x720/000000/cccccc?text=Image%20${image.id}`; 
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Current Image Indicator for focus */}
                                        {offset === 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-10 border-4 border-indigo-400 pointer-events-none rounded-xl"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Navigation Buttons */}
                        <NavigationButton 
                            direction="prev"
                            onClick={() => handleManualNavigation(goToPrevious)}
                        />
                        <NavigationButton 
                            direction="next"
                            onClick={() => handleManualNavigation(goToNext)}
                        />
                    </div>
                    {/* Alt Text Display for Current Image */}
                    <div className="text-center mt-6 h-10">
                        <p className="text-gray-300 italic transition-opacity duration-500 opacity-100">
                            {IMAGES[activeIndex]?.alt || "Image description loading..."}
                        </p>
                    </div>
                </main>
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Designed with React, GSAP for the 3D transforms, and Tailwind CSS.</p>
                </footer>
            </div>
        </div>
    );
};

// Extracted Navigation Button Component
const NavigationButton = ({ direction, onClick }) => {
    const isPrev = direction === 'prev';
    const positionClasses = isPrev 
        ? "left-0 sm:left-4 md:left-12 lg:left-24" 
        : "right-0 sm:right-4 md:right-12 lg:right-24";
    
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
                       bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 
                       text-white p-3 rounded-full shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-all duration-300 
                       focus:outline-none focus:ring-4 focus:ring-indigo-500/50 
                       transform hover:scale-105 active:scale-95`}
            aria-label={isPrev ? "Previous image" : "Next image"}
        >
            <Icon />
        </button>
    );
};

export default ImageCarousel;
