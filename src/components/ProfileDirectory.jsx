import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import {  } from '@fortawesome/free-solid-svg-icons'; // For a solid icon
    import { faLinkedin,faGithub,faInstagram } from '@fortawesome/free-brands-svg-icons'; // For a brand icon
// --- CONFIGURATION AND INITIALIZATION ---
// NOTE: Images placed in the public folder are referenced directly by their path string.

// Hardcoded initial data for profiles (used directly instead of fetching from Firestore)
const INITIAL_PROFILES = [
  // YOUR PERSONAL IMAGE AND DETAILS GO HERE
  { name: "Ankur Rabha", role: "Frontend Engineer", bio: "Specializing in modern web standards, dedicated to crafting pixel-perfect, accessible, and responsive user experiences.", imageUrl: "Ankur.jpg" },
  
  // Placeholder profiles for other team members
  { name: "Nitiksh Das", role: "Backend Engineer", bio: "Architecting scalable and secure backend services, ensuring robust data flow and system reliability", imageUrl: "Nitiksh.png" },
  { name: "Hariom Rai", role: "Manager", bio: "Advocating for accessibility and inclusive design, ensuring our platforms provide meaningful value for every user.", imageUrl: "Hariom.jpg" },
];

// Icons for social links (using inline SVGs for stability)
const LinkIcons = {
  LinkedIn: (
    <FontAwesomeIcon size="2xl" icon={faLinkedin} />
  ),
  GitHub: (
    <FontAwesomeIcon size="2xl" icon={faGithub} />
  ),
  Instagram: (
    <FontAwesomeIcon size="2xl" icon={faInstagram} />
  )
};


// --- SINGLE PROFILE CARD COMPONENT ---

const UserCardDisplay = ({ profile }) => {
  // isExpanded is controlled by mouse (hover) on desktop and click on mobile/tablet
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  // Standard set of links (can be customized per profile if needed)
  const profileLinks = [
    { name: "LinkedIn", url: "#", icon: LinkIcons.LinkedIn },
    { name: "GitHub", url: "#", icon: LinkIcons.GitHub },
    { name: "Instagram", url: "#", icon: LinkIcons.Instagram },
  ];

  return (
    <div
      className={`
        relative mx-auto bg-[#fffce1] rounded-2xl transition-all duration-700 ease-in-out overflow-hidden
        cursor-pointer text-white font-sans shadow-lg dark:shadow-[0_0_10px_10px_rgba(255,255,255,0.2)]
        w-64  p-4
      `} style={{ backgroundImage: "url('dark_texture.jpg')", backgroundSize: 'cover' }}
      // Desktop Hover functionality
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      // Click/Touch functionality for mobile/tablet
      onClick={toggleExpand}
    >
      {/* LARGE IMAGE OVERLAY (COMPACT STATE) */}
      <div className={`
        absolute top-0 left-0 w-full bg-white transition-all duration-700 ease-in-out
        ${isExpanded ? 'h-0 opacity-0' : 'h-[80%] opacity-100'} // Adjusted height ratio
      `}>
         <img
            // Uses the string path from the profile data
            src={profile.imageUrl}
            alt={`${profile.name} profile`}
            className={`
              object-cover w-full h-full rounded-t-2xl
              transition-opacity duration-500 ease-in-out
            `}
            onError={(e) => { e.target.onerror = null; e.target.src = profile.imageUrl }}
          />
      </div>

      {/* COMPACT CONTENT (Name & Role) */}
      <div className={`
        absolute bottom-0 left-0 w-full p-4  text-center transition-all duration-500 ease-in-out 
        ${isExpanded ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100'}
      `}>
        <h2 className="text-xl font-serif font-semibold text-white">{profile.name}</h2> {/* Reduced text size */}
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{profile.role}</p> {/* Reduced text size */}
      </div>

      {/* CIRCULAR IMAGE  */}
      <div className={`
         transition-all duration-700 ease-in-out flex gap-4
        ${isExpanded ? 'opacity-100 scale-100 ' : 'opacity-0 scale-0 translate-x-1/2 translate-y-1/2 pointer-events-none'}
      `}>
        <div className={`
            p-1  shadow-xl ring-2 ring-gray-300
             h-20 w-20 rounded-full // Reduced size of circular image
        `}>
            <img
                // Uses the string path from the profile data
                src={profile.imageUrl}
                alt={`${profile.name} profile`}
                className="object-cover w-full h-full rounded-full"
                onError={(e) => { e.target.onerror = null; e.target.src = profile.imageUrl }}
            />
        </div>
          <div className='mt-4'>
            <h2 className="text-xl font-serif font-extrabold text-lime-300"> {/* Reduced text size */}
                {profile.name}
            </h2>
            <p className="text-xs font-semibold text-gray-200 mb-2"> {/* Reduced text size */}
                {profile.role}
            </p>
          </div>

      </div>
      
      {/* EXPANDED CONTENT WRAPPER (Vertical Stack Flow) */}
      <div className={`
          transition-opacity duration-700 ease-in-out
        // pt-12 leaves space for the circular image and its surrounding padding
        ${isExpanded ? 'opacity-100 pt-4' : 'opacity-0 pointer-events-none'}
      `}>
         
         {/* DETAILS SECTION (Flows below the image area) */}
         <div className="text-left px-4">
            <hr className="mb-3 border-t border-gray-200/50" />
            <p className="text-xm font-serif text-gray-200 mb-4  overflow-y-auto"> {/* Reduced text size and bio height */}
              "{profile.bio}"
            </p>

            {/* Social Media Links */}
            <div className="flex justify-start space-x-3">
              {profileLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400   duration-200 p-1 transition-transform  hover:scale-125 " // Reduced padding
                  onClick={(e) => e.stopPropagation()} // Prevent card collapse when clicking links
                  aria-label={`Visit ${profile.name}'s ${link.name}`}
                >
                  <div className='hover:text-gray-100'> {/* Reduced icon size */}
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
         </div>
      </div>

      {/* Instructional Message (Responsive) */}
      <div className={`
        absolute left-1/2 transform -translate-x-1/2
        text-xs text-gray-400 block transition-opacity duration-300
        ${isExpanded ? 'opacity-0 bottom-6' : 'opacity-100 bottom-2'} // Adjusted position
      `}>
      </div>

    </div>
  );
};

// --- MAIN APPLICATION COMPONENT (Pure Component) ---

const ProfileDirectory = () => {
  // Profiles are loaded directly from the hardcoded array
  const profiles = INITIAL_PROFILES;

  return (
    <div className="bg-transparent p-6 font-sans w-full"> {/* Removed bg-gray-50 and min-h-screen */}
      <div className="max-w-6xl mx-auto">
        <p className="text-base text-gray-600 mb-6">
        </p>

        {/* Responsive Grid Layout - Adjusted to fit smaller cards */}
        <div className="w-full flex flex-wrap gap-8 justify-items-center">
          {profiles.map((profile, index) => (
            // Using index as a key is fine since this is a static list now
            <UserCardDisplay key={index} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDirectory;
