import { useState } from 'react'
import VideoList from './components/VideoList'
import Vedioupload from './components/Vedioupload'
import { Route,Router,Routes } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Router>
      <Routes>
        <Route path=''/>
      </Routes>
    </Router> */}
     <VideoList/>
    {/* <Vedioupload/> */}
    </>
  )
}

export default App
