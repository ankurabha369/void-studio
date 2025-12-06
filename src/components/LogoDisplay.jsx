// src/components/LogoDisplay.jsx
import React from 'react';

const LogoDisplay = ({ id }) => (
  <img
    id={id}
    src={'void-studio.png'} // Update path as needed
    alt="Void Studio Logo"
    className="h-full w-full object-contain dark:invert dark:brightness-[1.75]" // Adjust filter as needed based on your logo
    onError={(e) => e.target.src = ''} // Simple fallback
  />
);

export default LogoDisplay;
