import './App.css';
import LiveStatus from './pages/LiveStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router';
import Uploads from './pages/Uploads';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './actions/userAction';
import store from './store';
import MaterialDisplay from './pages/MaterialDisplay';
import DrawerAppBar from './DrawerAppBar';
import Delivered from './pages/Delivered';
import Home from './pages/Home';
import { jwtDecode } from 'jwt-decode'; // Corrected import

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  axios.defaults.baseURL = "http://localhost:8000";
  const { isAuthenticated, access_token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated.");
    } else {
      console.log("User is not authenticated.");
      navigate('/login');
      // window.location.href = '/login';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (access_token) {
      try {
        const userData = jwtDecode(access_token); // Decode the token
        console.log('Decoded token:', JSON.stringify(userData, null, 2)); // Log the decoded token

        // Extract specific fields from the decoded token
        const userId = userData?.id || null;
        const isAdmin = userData?.is_admin || false;
        const email = userData?.email || '';
        const username = userData?.username || '';

        console.log('User ID:', userId);
        console.log('Is Admin:', isAdmin);
        console.log('Email:', email);
        console.log('Username:', username);
      } catch (error) {
        console.error('Error decoding access token:', error);
      }
    }
  }, [access_token]);

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
        <DrawerAppBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/uploads' element={<Uploads />} />
          <Route path='/live' element={<LiveStatus />} />
          <Route path='/material' element={<MaterialDisplay />} />
          <Route path='/delivered' element={<Delivered />} />
        </Routes>
    </>
  );
}

export default App;