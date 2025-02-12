import { Navebar } from './Components/Navebar';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Components/Home';
import About from './Components/About';
import  Experience from './Components/Experience';
import Skills from './Components/Skills';
import Project from './Components/Project';
import Contact from './Components/Contact';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { use, useEffect } from 'react';
import Aos from 'aos';
function App() {
  useEffect(() => {
    Aos.init();
  },[])
  return (
    <div >
      <Navebar />
     <div className="container">
      <Home/>
      <About></About>
      <Experience></Experience>
      <Skills/>
      <Project/>
      <Contact/>
     </div>
    </div>
  );
}

export default App;
