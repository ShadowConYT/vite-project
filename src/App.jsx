import "./App.css";
import LiveStatus from "./pages/LiveStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router";
import Uploads from "./pages/Uploads";
import api from "./api/axiosConfig";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";
import store from "./store";
import MaterialDisplay from "./pages/MaterialDisplay";
import DrawerAppBar from "./DrawerAppBar";
import Delivered from "./pages/Delivered";
import Home from "./pages/Home";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, access_token } = useSelector((state) => state.auth);

  // Set up token in axios instance and load user on mount
  useEffect(() => {
    store.dispatch(loadUser());
  }, [dispatch, isAuthenticated]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Optionally decode token for user info (remove logs in production)
  useEffect(() => {
    if (access_token) {
      try {
        const userData = jwtDecode(access_token);
        // You can use userData for role-based rendering if needed
      } catch (error) {
        // Optionally handle token decode errors
      }
    }
  }, [access_token]);

  return (
    <>
      <DrawerAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/live" element={<LiveStatus />} />
        <Route path="/material" element={<MaterialDisplay />} />
        <Route path="/delivered" element={<Delivered />} />
      </Routes>
    </>
  );
}

export default App;
