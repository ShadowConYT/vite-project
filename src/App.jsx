import './App.css'
import LiveStatus from './pages/LiveStatus'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Uploads from './pages/Uploads'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    axios.defaults.baseURL = 'http://localhost:8000/api/v0';
  })

  return (
    <>
    <Router>
      <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path='/uploads' element={<Uploads />} />
        <Route path='/live' element={<LiveStatus />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
