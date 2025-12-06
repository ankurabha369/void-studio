// src/components/FloatingObject.jsx
import React, { useRef, useEffect } from 'react';

const FloatingObject = ({ imageUrl, size, position, gsapLoaded }) => {
  const objRef = useRef(null);

  useEffect(() => {
    if (gsapLoaded && objRef.current && window.gsap && window.gsap.utils) {
      const randX = window.gsap.utils.random(-100, 90, 10);
      const randY = window.gsap.utils.random(-100, 90, 10);
      const randScale = window.gsap.utils.random(1,1.5, 1);
      const randRotate = window.gsap.utils.random(-360, 360, 180);
      const randDelay = window.gsap.utils.random(1, 1.5, 1);
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
        scale: window.gsap.utils.random(1, 1.5, 0.8),
        rotation: window.gsap.utils.random(-360, 360, 180),
        duration: randDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [gsapLoaded]);

  const style = {
    position: 'absolute', ...position, width: size, height: size,
  };

  return (
    <div ref={objRef} style={style} className="opacity-50 dark:opacity-30">
      <img
        src={imageUrl}
        alt="Floating decorative object"
        className="w-10 h-10 object-contain"
        onError={(e) => { e.target.src = `https://placehold.co/${size}x${size}/111111/FFFFFF?text=X`; }}
      />
    </div>
  );
};

export default FloatingObject;