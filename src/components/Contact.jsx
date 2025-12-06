// src/components/Contact.jsx
import React, { useRef, useEffect, useContext } from 'react';     
import { Send,Mail, } from 'lucide-react';
import { ThemeContext } from '../App'; // Import ThemeContext from App


const Contact = ({ gsapLoaded }) => {
  const contactRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (gsapLoaded && window.gsap && window.ScrollTrigger) {
      if (titleRef.current) {
        window.gsap.from(titleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: contactRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
      }
      if (formRef.current) {
        window.gsap.from(formRef.current.children, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.2, scrollTrigger: { trigger: formRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }
    }
  }, [gsapLoaded]);

  const inputStyle = "w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-lime-500/20 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-600 font-sans";

  return (
    <section id="contact" ref={contactRef} className="py-10 bg-white dark:bg-black mb">
      <div className="container mx-auto text-center">
        <h2 ref={titleRef} className="text-4xl font-bold text-gray-900 dark:text-white py-4 font-heading">
          Let's <span className="text-lime-600 dark:text-lime-400">Collaborate</span>
        </h2>
        <div className=' flex w-full my-14'>
          <div className='flex  text-gray-950 dark:text-white text-xl w-full  justify-around flex-wrap ' ref={formRef}>
            <a href="#" target='_blank' className='pointer-cursor m-4'>
              <div className='flex items-center gap-4 h-10  p-2'><img className='h-12' src="https://images.icon-icons.com/2642/PNG/512/google_mail_gmail_logo_icon_159346.png" alt="Gmail" />contact@voidstudio.co</div>
            </a>
            <a href="#" target='_blank' className='cursor-pointer'>
              <div className='flex items-center gap-4 h-10  p-2 m-4'><img className='h-10' src="https://static.vecteezy.com/system/resources/previews/025/732/716/non_2x/fiverr-logo-icon-online-platform-for-freelancers-free-vector.jpg" alt="Fiver" />Fiver</div>
            </a>

            <a href="#" target='_blank' className='cursor-pointer'>
              <div className='flex items-center gap-4 h-10  p-2 m-4'><img className='h-10' src="https://cdn.worldvectorlogo.com/logos/upwork-roundedsquare-1.svg" alt="Upwork" />Upwork</div>
            </a>

            <div className='flex items-center gap-4 h-10  curs p-2 m-4 '><img className='h-10' src='https://cdn.pixabay.com/photo/2015/08/03/13/58/whatsapp-873316_1280.png' alt="Gmail" />Whatsapp No: +1234567890</div>
          </div>


        </div>
  
      </div>
    </section>
  );
};

export default Contact;