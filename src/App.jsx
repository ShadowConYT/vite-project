import './App.css'
import LiveStatus from './pages/LiveStatus'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Uploads from './pages/Uploads'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loadUser } from './actions/userAction'
import store from './store'

function App() {

  const dispatch = useDispatch();

  axios.defaults.baseURL="http://localhost:8000";
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if ( token ) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      store.dispatch(loadUser());
    } else {
      store.dispatch(loadUser());
    }
  }, [])

  return (
    <>
    <Router>
      <Routes>

        <Route path='/register' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/uploads' element={<Uploads />} />
        <Route path='/live' element={<LiveStatus />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
