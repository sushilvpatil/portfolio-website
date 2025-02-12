import React from 'react';
import skill from './Data/Skills.json';

export default function Skills() {
  return (
    <div className='container Skills' id='Skills'>
      <h1>Skills</h1>
      <div className="items" data-aos="flip-left" data-aos-duration="1000">
        {skill.map((skill, index) => {
          return (
            <div className="item" key={index}>
              <img src={skill.imageUrl} alt={skill.title} />
              <h3>{skill.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}