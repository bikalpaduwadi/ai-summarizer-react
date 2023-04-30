import Hero from './components/Hero';
import Demo from './components/Demo';

import './styles/app.css';

function App() {
  return (
    <>
      <main>
        <div className='main w-full'>
          <div className='gradient'></div>
          <div className='app'>
            <Hero />
            <Demo />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
