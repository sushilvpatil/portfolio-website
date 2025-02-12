import React from 'react'
import Experiance from './Data/Experiance.json'
function Experience() {
  return (
    <div className='container EX ' id='Experience'>
      <h1 className='ExperienceHeader'>Experience</h1>
      {Experiance.map((data, index) => (
        <div key={data.id} className=' my-5 EX-item text-center' data-aos="zoom-in" data-aos-duration="1000">
          <div className='left'>
            <img src={data.ImageUrl} alt={data.role} />
          </div>
          <div className='right'>
            <h2>{data.role}</h2>
            <h4 style={{color:'yellowgreen'}}>{data.organisation}</h4>
            <p style={{color:'yellow'}}>{data.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Experience