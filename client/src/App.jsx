import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import{BrowserRouter,Routes,Route}from 'react-router-dom'
import Navbar from './components/navbar'
import Signup from './components/signup'
import Login from './components/login'
import Home from './components/home'
import PayNow from './components/payment'
import './index.css'

function App() {
  

  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/pay'element={<PayNow/>}/>
      
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
