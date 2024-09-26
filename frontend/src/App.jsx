import { useState,useEffect} from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
// import HomePage from './components/HomePage'
import VedioPlayer from './components/VedioPlayer'
import Vedios from './components/Vedios'
import { VedioProvider } from './contexts/VedioPlayercontext'
function App() {
  const [vedioLink,setVedioLink]=useState('');
  return (
    <>
    <Navbar/>
    <div className='flex content-center '>
      <Sidebar/>
      <VedioProvider value={vedioLink}>
        <Vedios/>
        <VedioPlayer/>
      </VedioProvider>
      

    </div>
    
    </>
  )
}

export default App
