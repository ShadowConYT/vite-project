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
import MaterialDisplay from './pages/MaterialDisplay'
import DrawerAppBar from './DrawerAppBar'

function App() {

  const dispatch = useDispatch();

  axios.defaults.baseURL="http://localhost:8000";
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      console.log("Token found:", token); // Debugging
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log("No token found in localStorage."); // Debugging
    }

    store.dispatch(loadUser());

    // Debugging: Check if the headers are correctly set
    console.log("Axios default headers:", axios.defaults.headers.common);
  }, []);
  return (
    <>
    <Router>
  <DrawerAppBar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/uploads' element={<Uploads />} />
        <Route path='/live' element={<LiveStatus />} />
        <Route path='/material' element={<MaterialDisplay />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
