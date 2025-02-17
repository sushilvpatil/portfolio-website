import React, { useState } from 'react';

export const Navebar = () => {
  // State to manage the toggle for the navbar on small screens
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu state
  };

  return (
    <div className='container nav_bar' data-aos="fade-down" data-aos-duration="1000">
      <div className='left nav_items'>Portfolio</div>
      <div className={`right ${menuOpen ? 'show' : ''}`}>
        <a href="#Home" className="nav_items">Home</a>
        <a href="#About" className="nav_items">About</a>
        <a href="#Experience" className="nav_items">Experience</a>
        <a href="#Project" className="nav_items">Projects</a>
        <a href="#Skills" className="nav_items">Skills</a>
        <a href="#Contact" className="nav_items">Contact</a>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
