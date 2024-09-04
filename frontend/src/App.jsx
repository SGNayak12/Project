import { useState,useEffect} from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
function App() {
  return (
    <>
    <Navbar/>
    <HomePage/>
    <Sidebar/>
    
    </>
  )
}

export default App
