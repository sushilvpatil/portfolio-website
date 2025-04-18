import React from 'react';
import Projects from './Data/Project.json';

function Project() {
    return (
        <div className='container projects my-3' id='Project'>
            <h1>Projects</h1>
            <div className='row d-flex justify-content-center align-items-center'>
                {Projects.map((project, index) => {
                    return (
                        <div key={project.id} className='col-sm-6 col-md-4 col-lg-4 my-4 mx-4' data-aos="flip-right" data-aos-duration="1000">
                            <div className="card bg-dark text-light" style={{ width: '100%', height: '28rem', border: '1px solid yellow', boxShadow: '5px 5px 10px 10px rgba(101, 175,10, 0.5)' }}>
                                <div className="img d-flex justify-content-center align-items-center p-3">
                                    <img src={project.imageUrl} className="card-img-top card-img-cls" alt={project.title} />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{project.title}</h5>
                                    <p className="card-text">{project.description}</p>

                                    {/* Conditional link */}
                                    {project.Link && (
                                        <a href={project.Link} className="btn btn-warning me-2" target="_blank" rel="noopener noreferrer">
                                            View Live
                                        </a>
                                    )}

                                    <a href={project.source} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                        Source Code
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Project;
