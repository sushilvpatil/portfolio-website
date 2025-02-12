import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

function Contact() {
  return (
    <div className='container Contact' id='Contact'>
      <h1>Contact</h1>
      <div className="Contact-Icons" data-aos="zoom-in-up" data-aos-duration="1000">
        <a href="https://www.linkedin.com/in/sushil-patil01" className="items" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className='Icon' />
        </a>
        <a href="https://github.com/sushilvpatil" className="items" target="_blank" rel="noopener noreferrer">
          <FaGithub className='Icon' />
        </a>
        <a href="mailto:sushilpatil562@gmail.com" className="items" target="_blank" rel="noopener noreferrer">
          <SiGmail className='Icon' />
        </a>
        <a href="https://www.instagram.com"  className="items" target="_blank" rel="noopener noreferrer">
          <FaInstagram className='Icon' />
        </a>
        <a href="https://www.facebook.com" className="items" target="_blank" rel="noopener noreferrer">
          <CiFacebook className='Icon' />
        </a>
      </div>
    </div>
  );
}

export default Contact;