import { useEffect } from 'react';
import Aos from 'aos';
import './App.css';
import Portfolio from './Components/Portfolio';

function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div>
      <Portfolio />
    </div>
  );
}

export default App;