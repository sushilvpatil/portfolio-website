import React, { useEffect, useRef } from 'react';
import  pdf from './Pdf/Resume.pdf';
import images from './Data/Images.json';
import typed from 'typed.js';

function Home() {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Welcome to My Profile", "Hi I am Sushil Patil", "I am a Frontend Developer"],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true
    };
    const typedInstance = new typed(typedRef.current, options);

    return () => {
      typedInstance.destroy();
    };
  }, []);

  return (
    <div className='container home' id='Home'>
      <div className="left" data-aos="fade-up-right" data-aos-duration="1000">
        <h1 ref={typedRef}></h1>
        <a href={pdf} download="Resume.pdf" className='btn btn-outline-warning my-3'>
          Download Resume
        </a>
      </div>
      <div className="right" data-aos="fade-up-left" data-aos-duration="1000">
        <div className="img">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREnKbATfnK--KR21jiDXdJiMKGpy429kcBeQ&s" alt="image here" />
        </div>
      </div>
    </div>
  );
}

export default Home;
